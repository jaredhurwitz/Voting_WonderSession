# Snack Vote: Beginner Setup Guide

No experience needed. Follow the steps in order and don't skip the "Check" lines. They tell you whether you're on track.

**What you'll end up with:** a web address you can give your students. They open it on their phones or laptops, vote, and see live results.

**What you need:** a computer, about 30 minutes, and an email address. Everything is free and nothing asks for a credit card.

**What you'll set up:**
- **GitHub**: a free site that will host your web page (the thing students open).
- **Google Sheets**: a free spreadsheet that will store the votes.

You'll switch between two browser tabs, so keep this guide open in a third tab or print it.

---

## Before you start: save the three files

You have three files: `index.html`, `Code.gs`, and `README.md` (this guide).

Save all three to a folder you can find, like your Desktop. Don't open or change them yet.

---

## PART 1: Put the web page on GitHub

### Step 1. Make a GitHub account
1. Go to **https://github.com** and click **Sign up**.
2. Enter your email, a password, and a username. **Your username becomes part of your web address**, so pick one you're happy to share (example: `mrsmith`).
3. GitHub emails you a code. Type it in to verify.
4. If GitHub asks survey questions, skip them or pick anything.

**Check:** you see your GitHub home page and you're logged in.

### Step 2. Create a repository (a folder for your project)
1. Click the **+** at the top right of the page, then **New repository**.
2. Next to "Repository name," type: `snack-vote`
3. Choose **Public**. This matters: the free website feature only works on Public repositories. (Public means people can see the files. There's nothing private in them.)
4. Leave everything else alone. Click the green **Create repository** button.

**Check:** you see a page titled with your username and `snack-vote`, with some setup instructions.

### Step 3. Upload your three files
1. On that page, find the link that says **uploading an existing file** and click it.
2. Drag your three files (`index.html`, `Code.gs`, `README.md`) from your folder into the box on the page.
3. Wait until all three files are listed.
4. Scroll down and click the green **Commit changes** button.

**Check:** you see your three files listed in the repository.

### Step 4. Turn on your website
1. Near the top of the repository page, click **Settings** (it has a gear icon).
2. In the left menu, click **Pages**.
3. Under "Build and deployment," find the box labeled **Source** and make sure it says **Deploy from a branch**.
4. Under **Branch**, click the dropdown that says **None** and choose **main**. Leave the folder box next to it on **/ (root)**. Click **Save**.
5. Wait 1 to 2 minutes, then refresh the page (press F5, or Cmd+R on Mac).

**Check:** a box appears at the top saying "Your site is live at ..." with an address like `https://mrsmith.github.io/snack-vote/`. **Write this address down.** This is the link you'll give your students.

If you click it now, you'll see the page with a message saying "Setup needed." That's normal. Part 2 fixes it.

---

## PART 2: Make the Google Sheet that stores the votes

> **Use a regular Gmail account** (an address ending in @gmail.com). School or work Google accounts often block a setting you need in step 7. If you don't have one, create a free one at https://accounts.google.com.

### Step 5. Create a blank spreadsheet
1. Open a **new browser tab** and go to **https://sheets.google.com**. Sign in if asked.
2. Click **Blank spreadsheet** (the big plus sign).
3. At the top left, click **Untitled spreadsheet**, type `Snack Vote Votes`, and press Enter.

**Check:** you see an empty spreadsheet named "Snack Vote Votes."

### Step 6. Open the script editor and paste the code
1. In the spreadsheet's top menu, click **Extensions**, then **Apps Script**.
2. A new tab opens with a code editor. It has some starter text like `function myFunction() { }`.
3. Click inside the code area. Press **Ctrl+A** (Cmd+A on Mac) to select everything, then press **Delete**. The editor should be empty.
4. Open the `Code.gs` file from your folder in Notepad (Windows) or TextEdit (Mac). Press Ctrl+A, then Ctrl+C to copy everything.
5. Go back to the Apps Script tab, click in the empty editor, and press **Ctrl+V** (Cmd+V) to paste.
6. Press **Ctrl+S** (Cmd+S) to save.

**Check:** the editor is full of code starting with `/** Snack Vote backend`. There are no red error marks. **Don't click Run.** You don't need to.

### Step 7. Publish the script
1. At the top right, click the blue **Deploy** button, then **New deployment**.
2. Next to "Select type," click the **gear icon** and choose **Web app**.
3. Fill in the form:
   - **Description:** type `Snack Vote`
   - **Execute as:** choose **Me**
   - **Who has access:** choose **Anyone**. This must be exactly "Anyone," not "Anyone with Google account," or your students won't be able to vote.
4. Click **Deploy**.

### Step 8. Give Google permission (the scary-looking part)
Google will ask you to approve the script. This is normal because you wrote it yourself, and it can only touch this one spreadsheet.

1. Click **Authorize access**.
2. Pick your Google account.
3. You'll see **"Google hasn't verified this app."** Click the small **Advanced** link at the bottom left.
4. Click **Go to Untitled project (unsafe)**.
5. Click **Allow**.

**Check:** you see a box titled "New deployment" with a **Web app URL** that starts with `https://script.google.com/macros/s/` and ends with `/exec`.

### Step 9. Copy the web app URL
1. Click the **Copy** button next to the Web app URL.
2. Paste it into a Notepad file or text note so you don't lose it.
3. Click **Done**.

### Step 10. Test that it works
1. Open a new browser tab.
2. Paste your URL in the address bar, then type this at the very end: `?action=list&round=fruit1`
   The whole thing looks like: `https://script.google.com/macros/s/LONGCODE/exec?action=list&round=fruit1`
3. Press Enter.

**Check:** you see this text on the page: `{"ok":true,"votes":[]}`

If you see something else, go to Troubleshooting at the bottom. If you see it, Part 2 is done.

---

## PART 3: Connect the web page to the spreadsheet

### Step 11. Paste your URL into the page
1. Go back to your GitHub tab and open your `snack-vote` repository.
2. Click the file **index.html**.
3. Click the **pencil icon** at the top right of the file (it says "Edit this file" when you hover over it).
4. Press **Ctrl+F** (Cmd+F on Mac) and type `PASTE_YOUR_WEB_APP_URL`. This jumps you to line 203, which looks like this:
   `const APPS_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL";`
5. Select only the words `PASTE_YOUR_WEB_APP_URL` (double-click them), and replace them with your URL.
6. The line should now look like this. **Keep the quotation marks and the semicolon:**
   `const APPS_SCRIPT_URL = "https://script.google.com/macros/s/LONGCODE/exec";`
7. Click the green **Commit changes...** button at the top right. A box pops up. Click **Commit changes** again.

### Step 12. Wait, then open your site
1. Wait 1 to 2 minutes. GitHub is updating your website.
2. Open your site address from Step 4 (like `https://mrsmith.github.io/snack-vote/`).
3. If you still see "Setup needed," do a hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on Mac) and wait another minute.

**Check:** the page loads with the question and the voting choices, and no "Setup needed" message.

---

## PART 4: Test before class

1. On your site, make a few choices and click **Submit my votes**. The page should jump to the results, and the first tab should say **Voted ✓**.
2. Go back to your Google Sheet tab. You should see a new tab at the bottom called **votes** with one row of data. That's your vote.
3. On your phone, open your site address (or click **Show QR code to join** on the page and scan it with your phone camera). Vote from the phone. Watch the laptop results update within about 5 seconds.
4. Try voting again on the same device. It should stay locked. This is correct.
5. Before the real class, click **Reset all votes** (top right of the page) to delete your test votes.

**Give your students the site address from Step 4.** That's all they need.

---

## Using it later

- **Delete all votes and start over:** click **Reset all votes** on the page. Anyone with the link can press it, so only share the link with your class.
- **Change the question or the choices:** on GitHub, open `index.html`, click the pencil, and edit the `QUESTION` and `OPTIONS` near line 224. Also change `ROUND` (line 220) to something new like `"round2"` so everyone can vote again.
- **See the raw votes:** open your Google Sheet and click the **votes** tab at the bottom.
- **If you ever edit `Code.gs`:** saving is not enough. In Apps Script click **Deploy**, then **Manage deployments**, click the pencil, set **Version** to **New version**, then click **Deploy**. Your URL stays the same.

---

## Troubleshooting

**Step 10 shows a Google login page or an error instead of `{"ok":true,"votes":[]}`.**
"Who has access" is not set to **Anyone**. In Apps Script, click **Deploy**, then **Manage deployments**, click the pencil, change "Who has access" to **Anyone**, set Version to **New version**, and click **Deploy**. If "Anyone" isn't available, you're probably using a school or work account. Use a regular Gmail account.

**The site says "Setup needed."**
Your URL isn't in `index.html` yet, or GitHub hasn't finished updating. Redo Step 11, wait two minutes, and hard refresh.

**The site says "Couldn't load live results."**
The URL has a typo (a missing letter, extra space, or deleted quotation mark), or you changed the settings in step 7. Compare it carefully with the one in your notes.

**The Submit button is greyed out.**
You need to answer at least one question. No question is required, but a completely empty ballot can't be submitted.

**It says "Couldn't save your vote."**
Either the URL is wrong (see above), or you've already voted from this device. If you're testing, clear the votes with **Reset all votes**.

**I can't find "uploading an existing file" in Step 3.**
Click **Add file** (near the top right of the repository), then **Upload files**.

**My school network blocks it.**
Ask your IT team to allow `github.io`, `script.google.com`, and `script.googleusercontent.com`.

---

## Good to know

- Each browser gets a random voter ID, and a browser can only vote once. A student who clears their browser data or uses a private window could vote twice. That's fine for a classroom, but not for anything that needs real security.
- Votes are anonymous. No names or emails are collected.
- Google can change its free limits without notice. One class is far below the published limits, but check https://developers.google.com/apps-script/guides/services/quotas before running a very large vote.
