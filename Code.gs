/**
 * Snack Vote backend (Google Apps Script + Google Sheets).
 * Free, no credit card. Paste this whole file into Extensions > Apps Script
 * in a Google Sheet, then deploy it as a Web app (see README.md).
 *
 * @OnlyCurrentDoc
 */

const SHEET_NAME = "votes";
const HEADERS = ["round", "voter_id", "fptp", "rcv", "scores", "approvals", "condorcet", "created_at"];
const CACHE_SECONDS = 4; // many students refreshing results share one cached read

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action === "list") return json_(listVotes_(cleanText_(p.round, 40)));
    return json_({ ok: true, message: "Snack Vote backend is running." });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === "vote") return json_(addVote_(body));
    if (body.action === "reset") return json_(resetVotes_(cleanText_(body.round, 40)));
    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ---------- actions ----------

function listVotes_(round) {
  if (!round) throw new Error("missing round");
  const cache = CacheService.getScriptCache();
  const key = "list:" + round;
  const hit = cache.get(key);
  if (hit) return JSON.parse(hit);

  const rows = readRows_();
  const votes = rows
    .filter(r => String(r[0]) === round)
    .map(r => ({
      voter_id: String(r[1]),
      fptp: r[2] ? String(r[2]) : null,
      rcv: parse_(r[3], []),
      scores: parse_(r[4], {}),
      approvals: parse_(r[5], []),
      condorcet: parse_(r[6], {})
    }));
  const out = { ok: true, votes: votes };
  try { cache.put(key, JSON.stringify(out), CACHE_SECONDS); } catch (e) { /* too big to cache: fine */ }
  return out;
}

function addVote_(b) {
  const round = cleanText_(b.round, 40);
  const voterId = cleanText_(b.voter_id, 64);
  if (!round || !voterId) throw new Error("missing round or voter_id");

  const fptp = b.fptp == null ? "" : cleanText_(b.fptp, 40);
  const rcv = cleanArray_(b.rcv);
  const approvals = cleanArray_(b.approvals);
  const scores = cleanObject_(b.scores, "number");
  const condorcet = cleanObject_(b.condorcet, "string");

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSheet_();
    const rows = readRows_();
    if (rows.some(r => String(r[0]) === round && String(r[1]) === voterId)) {
      return { ok: false, error: "duplicate" }; // one vote per voter per round
    }
    const row = sh.getLastRow() + 1;
    sh.getRange(row, 1, 1, HEADERS.length)
      .setNumberFormat("@") // keep everything as plain text
      .setValues([[round, voterId, fptp, JSON.stringify(rcv), JSON.stringify(scores),
                   JSON.stringify(approvals), JSON.stringify(condorcet), new Date().toISOString()]]);
    CacheService.getScriptCache().remove("list:" + round);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function resetVotes_(round) {
  if (!round) throw new Error("missing round");
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSheet_();
    const all = sh.getDataRange().getValues();
    const keep = [all[0]].concat(all.slice(1).filter(r => String(r[0]) !== round));
    const removed = all.length - keep.length;
    if (removed > 0) {
      sh.clearContents();
      sh.getRange(1, 1, keep.length, HEADERS.length).setNumberFormat("@").setValues(keep);
    }
    CacheService.getScriptCache().remove("list:" + round);
    return { ok: true, removed: removed };
  } finally {
    lock.releaseLock();
  }
}

// ---------- helpers ----------

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, sh.getMaxRows(), HEADERS.length).setNumberFormat("@");
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function readRows_() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function parse_(s, fallback) {
  try { const v = JSON.parse(s); return v == null ? fallback : v; } catch (e) { return fallback; }
}

function cleanText_(v, max) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function cleanArray_(v) {
  if (!Array.isArray(v) || v.length > 12) return [];
  return v.filter(x => typeof x === "string").map(x => x.slice(0, 40));
}

function cleanObject_(v, type) {
  const out = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) return out;
  const keys = Object.keys(v);
  if (keys.length > 100) return out;
  keys.forEach(k => {
    if (typeof v[k] === type) out[k.slice(0, 40)] = type === "string" ? v[k].slice(0, 40) : v[k];
  });
  return out;
}
