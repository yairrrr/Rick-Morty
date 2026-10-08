# Prompts Log

A record of what I asked the AI agent at each step, what it did, and how I checked it.

## Planning 1 — write the PRD
Prompt: Act as a product manager. Interview me one question at a time (at most 8 questions) about who the app is for, what they want to do, which free no-key API to use, and which fields to show in the list and details panel. Then write a one-page PRD.md in English with: pitch, audience, screens, must-have features, acceptance criteria, "not now", and data.
Agent did: Interviewed me in Hebrew (8 questions) and created `PRD.md`. It checked the APIs live and found that the Rick and Morty API has no episode summaries, and that a search with no results returns an error instead of an empty list.
I checked: Read `PRD.md`. My own decisions during the interview: I started with an episode guide with summaries, then switched to a character encyclopedia using the Rick and Morty API. I chose picture + name for the list, and picture, name, species and episode count for the details. I chose both search and "Load more", a message in the empty details panel, and "episode names per character" for later.

## Planning 2 — write the task list
Prompt: Read the PRD. Write tasks.md: at most 8 tasks, in build order. Each task small enough for one commit and ending with a "Done when:" line. Task 1: show the list from a few sample items in a local JSON file (no API yet). Task 2: click an item to show its details. No code.
Agent did: Created `tasks.md` with 8 tasks: sample list, details on click, API data, "Load more", search, no-results message, "Load more" on search results, and a final check against the PRD.
I checked: Read `tasks.md` and made sure every must-have feature from `PRD.md` is covered by a task.

## Setup — connect the project to GitHub
Prompt: I opened a repo on GitHub. How do I connect it to the project, and what commands do I run?
Agent did: No files changed. Explained the commands to run in the terminal: `git init`, `git add`, `git commit`, `git branch -M main`, `git remote add origin <repo URL>`, `git push -u origin main`, plus a `git pull` fix for repos created with a README.
I checked: (fill in after running the commands, e.g. "Ran the commands and saw the files on GitHub.")

## Task 1 — show the list
Prompt: Task 1 from `tasks.md`: create the React project, save 5 sample characters in a local JSON file with the real API's fields (`id`, `name`, `image`, `species`, `episode`), and show them as a list on the left. Each card shows a small picture and the name.
Agent did: Used the existing Vite + React + TypeScript project in `class-homework/`. Created `src/data/characters.json` (the first 5 real characters from the API), `src/types.ts` (the `Character` type), and `src/components/CharacterList.tsx`. Replaced `src/App.tsx` and `src/index.css` with the app layout and styles, and changed the page title in `index.html`. Removed the unused Vite template files (`App.css`, `src/assets/`, `public/icons.svg`). Checked that `npm run build` and `npm run lint` pass.
I checked: Ran `npm run dev`, opened localhost:5173 and saw 5 cards, each with a picture and a name.

## Task 2 — click a character to show its details
Prompt: Task 2 from `tasks.md`: add the details panel on the right. Clicking a card shows the character's large picture, name, species, and number of episodes. Before any click, the panel shows "Pick a character to see details". Mark the selected card so it stands out.
Agent did: Created `src/components/CharacterDetails.tsx`. Changed `src/components/CharacterList.tsx` so each card is a button that reports clicks and highlights the selected card. Changed `src/App.tsx` to remember the selected character and show the details panel. Added details panel and selected-card styles to `src/index.css`. Checked that `npm run build` and `npm run lint` pass.
I checked: (fill in, e.g. "Saw the 'Pick a character' message, clicked Morty and saw his details and a highlighted card.")

## Task 3 — load the first 20 characters from the API
Prompt: Task 3 from `tasks.md`: replace the sample JSON with data from https://rickandmortyapi.com/api/character. Show "Loading..." while waiting and an error message if the request fails.
Agent did: Created `src/api.ts` with a `fetchCharacters` function. Changed `src/App.tsx` to load the characters when the app opens and show "Loading...", an error message, or the list. Added status and error styles to `src/index.css`. Kept `src/data/characters.json` for now (Task 8 removes it). Checked that `npm run build` and `npm run lint` pass, and that the API returns 20 characters starting with Rick Sanchez.
I checked: (fill in, e.g. "Saw 'Loading...', then 20 characters starting with Rick Sanchez. Turned off Wi-Fi, reloaded and saw the error message.")

## Task 4 — add the "Load more" button
Prompt: Task 4 from `tasks.md`: add a "Load more" button at the bottom of the list. Each click fetches the next page and adds its 20 characters below the ones already shown. Hide the button when there are no more pages.
Agent did: Changed `src/api.ts` so `fetchCharacters` takes the page URL and returns the link to the next page. Changed `src/App.tsx` to remember the next page link, add the new characters to the end of the list on each click, show "Loading..." on the button while waiting, show an error if loading more fails, and hide the button when there is no next page. Added button styles to `src/index.css`. Checked that `npm run build` and `npm run lint` pass, and that the API's page 2 starts with character 21.
I checked: (fill in, e.g. "Clicked 'Load more' and the list grew from 20 to 40; Rick Sanchez was still first.")

## Task 5 — search by name
Prompt: Task 5 from `tasks.md`: add a search box above the list. Typing a name fetches matching characters from the API and replaces the list with the results. Clearing the box brings back the full list.
Agent did: Changed `src/api.ts` to build the search URL (`?name=...`). Changed `src/App.tsx` to add the search box, wait 300 ms after the last keystroke and then fetch the matching characters, cancel an older search when a new one starts, and keep the selected character's details when a search hides it from the list. Changed `src/components/CharacterDetails.tsx` to accept "no character" as `null`. Added search box styles to `src/index.css`. Checked that `npm run build` and `npm run lint` pass, and that searching "rick" in the API returns 107 characters.
I checked: (fill in, e.g. "Typed 'Rick' and saw only Ricks; cleared the box and saw the full list again.")

## Task 6 — handle searches with no results
Prompt: Task 6 from `tasks.md`: when a search finds nothing, the API returns an error instead of an empty list. Show "No characters found" instead of the error message.
Agent did: Changed `src/api.ts` so a 404 answer from the API counts as an empty list instead of an error. Changed `src/App.tsx` to show "No characters found" when the list is empty. Checked that `npm run build` and `npm run lint` pass, and that the API answers 404 for the search "zzzz".
I checked: (fill in, e.g. "Typed 'zzzz' and saw 'No characters found'; cleared the box and the full list came back.")

## Task 7 — "Load more" works on search results
Prompt: Task 7 from `tasks.md`: make "Load more" fetch the next page of the current search, not the next page of all characters.
Agent did: Found that "Load more" already follows the search, because the API's next-page link includes the name (`?page=2&name=rick`). Fixed one bug in `src/App.tsx`: if the search changed while "Load more" was still loading, the old search's characters were added to the new list. Now a new search cancels that request. Checked that `npm run build` and `npm run lint` pass, and that page 2 of the "rick" search has 20 characters, all with "Rick" in the name.
I checked: (fill in, e.g. "Searched 'Rick', clicked 'Load more' and saw 40 Ricks and no other characters.")

## Task 8 — final check and cleanup
Prompt: Task 8 from `tasks.md`: go through every acceptance criterion in PRD.md and confirm it works. Remove the sample JSON file if nothing uses it anymore, and tidy up the layout and spacing.
Agent did: Deleted `src/data/characters.json` (nothing used it). Ran a scripted browser check of all 5 acceptance criteria and a phone-size screen. The check found two problems and the agent fixed them: (1) the API blocks the app for about 10 seconds after roughly 30 requests (pictures count too), so opening the app, searching and clicking "Load more" quickly made "Load more" fail. `src/api.ts` now waits 12 seconds and tries once more, and `src/components/CharacterList.tsx` loads list pictures lazily. (2) On a phone, the details appeared far below the list after a click. `src/App.tsx` now scrolls to the details on small screens. Checked that `npm run build` and `npm run lint` pass.
I checked: (fill in after testing the 5 acceptance criteria by hand.)

## Security check — what is on GitHub
Prompt: Check that nothing we pushed to GitHub exposes me to security problems, leaks my personal information, or should not be on GitHub.
Agent did: Scanned every file in every commit for passwords, API keys, tokens, `.env` files, local paths and personal details, and ran `npm audit`. Found no secrets, no `node_modules`, `dist` or `.DS_Store`, and 0 vulnerable packages. The one finding: the repo is public and every commit shows my personal email as the author. Added a root `.gitignore` for `.DS_Store` so macOS files can't be committed by mistake.
I checked: (fill in, e.g. "Turned on 'Keep my email address private' in GitHub settings and set the noreply email in git.")

## Lab — bug hunt and test-first feature
Prompt: Do the lecturer's bug-hunt lab, adapted to our app: Level 1 (follow a click and answer in writing), Level 2 (the three bugs: setState during render, click does nothing, missing key), Level 3 (write a failing test for an acceptance line first, then make it pass with the smallest change).
Agent did: Wrote `LAB.md` with the Level 1 answers and the Level 2 table. For Level 2 it planted each bug in `src/components/CharacterList.tsx`, recorded the exact console message, and restored the file. Set up tests (Vitest + Testing Library: `vite.config.ts`, `src/test/setup.ts`, `npm test` script) and wrote `src/App.test.tsx` with the 5 PRD acceptance criteria plus a new line: "When I type "rick" in the search box, I see "107 characters found"". Ran it: 5 passed, the new one failed (red). Then made the smallest change in `src/api.ts`, `src/App.tsx` and `src/index.css` to show the result count. Ran it again: 6 of 6 passed (green). Build and lint pass.
I checked: (fill in, e.g. "Read LAB.md, ran `npm test` and saw 6 green tests, saw '826 characters found' in the app.")

## README — describe the app
Prompt: Rewrite the README to match the app, and add a short explanation in Hebrew (5 sentences) at the end: which component stores the selected item and how it reaches the details panel.
Agent did: Moved the Vite template `class-homework/README.md` to the repo root as `README.md` so GitHub shows it on the repo page, and rewrote it: what the app does, features, the API, how to run it, commands, project structure and links to the project documents. Added a 5-sentence Hebrew section at the end on how the selected character goes from `App` to `CharacterDetails`.
I checked: (fill in, e.g. "Read the README on GitHub and practiced the Hebrew explanation out loud.")

## Task 9 — Rick and Morty look, mobile first
Prompt: I want to improve how the app looks. Replace the app title with the image named logo in the project's logo folder. Replace the site background with the image in the folder named background. Make every character card look better in the Rick and Morty style, including fonts that match the show. Center everything so it looks high-end, and make it mobile first: phones, tablets and laptops. Add the task to tasks.md and the prompt to prompts.md.
Agent did: There is no `background` folder, so it used the space landscape `logo/image.png` as the background. Saved smaller copies of both pictures as `src/assets/logo.jpg` and `src/assets/background.jpg` (2 MB PNGs → about 150 KB and 380 KB). `src/App.tsx`: the `<h1>` now holds the logo picture, with the old title as its `alt` text so screen readers and search engines still read it. Rewrote `src/index.css` mobile first: fixed space background with a dark overlay, glass panels, character cards as a grid (2 per row on phones, 3 on tablets, list beside a sticky details panel from 900px wide), portal-green glow on hover and on the selected card. Fonts from Google Fonts in `index.html`: Bangers (comic titles and names) and Fredoka (body text). The details panel shows species and episodes as two badges. The phone "scroll to details" now uses the same 900px breakpoint as the CSS. Checked that `npm test`, `npm run build` and `npm run lint` pass.
I checked: (fill in, e.g. "Opened the app on my phone, a tablet size and my laptop and saw the logo, the background and the new cards.")

## Task 9 (follow-up) — round logo without its frame
Prompt: Cut the logo's background so it is rounded.
Agent did: Cropped `src/assets/logo.jpg` to the logo's own rounded square, removing the dark frame around it (the original `logo/logo.png` is unchanged). In `src/index.css` the logo corners are now 22% round, the same shape as the logo, with a portal-green outline and glow.
I checked: (fill in, e.g. "Saw the logo with round corners and no dark square around it.")

## Task 10 — YouTube video about the character
Prompt: Add the YouTube API so that when you click a character, a short YouTube video about the character pops up automatically. The video should show under the character's card in a small window.
Agent did: Added `src/youtube.ts`, which searches the YouTube Data API v3 for "<name> Rick and Morty", only short (under 4 minutes) videos that can be embedded, and remembers each answer so a character is searched only once (each search costs 100 of the 10,000 free daily units). Added `src/components/CharacterVideo.tsx`: a small 16:9 window under the details that plays the video muted (browsers only autoplay muted videos), "Opening a portal..." while searching, and a "Search YouTube for <name>" link when there is no key or YouTube fails. `App.tsx` gives it a new `key` per character so it starts over on every click. The key is read from `VITE_YOUTUBE_API_KEY` in `.env.local`; added `.env.example` and `.env` rules to `.gitignore` so the key is never committed. On laptops the details picture is smaller and a click scrolls the details panel into view, so the video is on screen. Added 2 tests (video appears; link appears without a key): 8 of 8 pass, build and lint pass. Updated README.
I checked: (fill in, e.g. "Put my key in .env.local, clicked Morty and saw a Morty video play under his details.")

## Tasks 11–13 — routes, Episodes page and About page
Prompt: (first) Give me ideas for more pages I can add, for example About. I need to work with routes. (then) Make a page for episodes with a summary picture for each episode and a description of the episode, and an About page.
Agent did: Installed `react-router`. `main.tsx` wraps the app in `BrowserRouter`; `App.tsx` now holds only the routes: `/` (the old app, moved to `src/pages/CharactersPage.tsx`), `/episodes`, `/about` and `*` (a "Wrong dimension!" page), all inside `src/components/Layout.tsx`, which has the logo, a menu built with `NavLink` (marks the current page) and an `<Outlet />`. The Rick and Morty API has no episode pictures or summaries, so `src/tvmaze.ts` loads all episodes from the free TVMaze API (no key), loads them once per visit, and turns the HTML summaries into plain text with `DOMParser` (safe, no `dangerouslySetInnerHTML`). `src/pages/EpisodesPage.tsx` shows season tabs (the season is kept in the address with `useSearchParams`, e.g. `/episodes?season=2`) and episode cards with the picture, code (S01E01), air date, length and summary. `src/pages/AboutPage.tsx` shows what the app does, the data sources with links and the tools. Styled everything in the same Rick and Morty look, mobile first (episodes: 1 per row on phones, 2 on tablets, 3 on laptops). Tests now render the app inside `MemoryRouter`; added 4 tests (Episodes from the menu, Season 2 tab, About from the menu, unknown address): 12 of 12 pass, build and lint pass. Updated README.
I checked: (fill in, e.g. "Clicked Episodes, switched to Season 3, refreshed and was still on Season 3; opened About on my phone.")

## Setup — how to commit
Prompt: (first) What is the command to make a commit? (then) Send me what to write in the terminal, based on what we did so far.
Agent did: No files changed. Explained `git add .`, `git commit -m "..."` and `git push`, checked that `.env` is in `.gitignore` so no API key gets committed, and wrote a commit message that describes the changes.
I checked: (fill in, e.g. "Ran the three commands and saw the commit on GitHub.")

## Task 14 — favorites, character facts and a new logo
Prompt: I want to add favorites when choosing characters. In the character card I want facts like the ones in the show's database. I am replacing the logo picture, update it in the app.
Agent did: Added `src/favorites.ts` (a `useFavorites` hook that saves whole characters in `localStorage`, so they stay after a refresh) and `src/components/FavoriteButton.tsx` (a heart on every card and on the details picture). `CharactersPage.tsx` has "All" / "Favorites (n)" tabs, and the search box also filters the favorites. `CharacterDetails.tsx` now shows every field the API has: status (Alive green, Dead red), species, type, gender, origin, last known location, number of episodes and the first episode; `types.ts` has the new fields. The new `logo/logo.png` had a fake see-through background (grey squares that are part of the picture), so the agent removed them and saved `src/assets/logo.png`; the logo is now wide, with a glow that follows its shape. Added 4 tests (facts, add a favorite, favorites stay after reload, empty favorites): 16 of 16 pass, build and lint pass. Updated README.
I checked: (fill in, e.g. "Hearted Morty, refreshed, opened Favorites and he was still there; saw the new logo.")

## Task 15 — Multiverse page
Prompt: Add a new page called Multiverse where the user explores the show's locations and dimensions and sees which characters are in each place. React + TypeScript, no backend and no new API key, using https://rickandmortyapi.com/api/location (id, name, type, dimension, residents). A `locations.ts` file loads the data, including the next pages. Not a plain list: every location is a planet, you can click it, hovering shows its name, search by name and filter by dimension. Two levels: first the dimensions, then the planets of the chosen dimension. Clicking a planet opens a window with Type, Dimension, the number of residents and their pictures; clicking a resident shows their details. Spinning portal, a jump effect between dimensions, the planet grows when clicked, hover animations, works on phones. CSS animations, no heavy libraries. Check that search, filter and navigation work, that it fits phones, and that the locations don't send needless requests.
Agent did: Added `src/locations.ts`: loads page 1, then the other 6 pages together, and keeps them for the whole visit; loads all the residents of a location in one request (`/character/1,2,3`). Moved the "wait and retry once" from `api.ts` into `fetchWithRetry` so both use it. Added `src/pages/MultiversePage.tsx` at `/multiverse` (menu link in `Layout.tsx`): step 1 shows a portal for every dimension (the three ways the API writes "unknown" are one "Unknown dimension"), step 2 the planets of the dimension; the dimension and the open location are kept in the address, so Back works. `src/components/Planet.tsx` draws each location as a planet, and `src/components/LocationDialog.tsx` is the window (Escape and a click outside close it; residents 24 at a time because pictures count toward the API's limit). Added 6 tests (dimensions from the menu, pick a dimension, search, filter, open a planet and a resident, locations load only once): 22 of 22 pass, build and lint pass. Updated README and About.
I checked: (fill in, e.g. "Opened Multiverse, picked Dimension C-137, clicked Earth and Rick; searched 'citadel'; tried it on my phone.")

## Task 16 — remove the YouTube feature
Prompt: Before the commit I want to remove the YouTube feature. Go over the code and make sure nothing of it is left, I am giving it up completely.
Agent did: Deleted `src/youtube.ts`, `src/components/CharacterVideo.tsx`, `.env.example` and `src/vite-env.d.ts`. Removed the video from `CharactersPage.tsx`, its styles from `index.css`, its 2 tests, the video card and the YouTube source from the About page, and the YouTube parts of the README. Kept the `.env` rules in `.gitignore` for any future key. Searched the whole project for "youtube", "video", "iframe" and `VITE_`: only this log and `tasks.md` still mention it, as history. 20 of 20 tests pass, build and lint pass.
I checked: (fill in, e.g. "Clicked a character and saw no video under the details.")

## Task 15 (follow-up) — deep space look
Prompt: In the Multiverse I want to feel like I am in outer space, not in the cards style. Change the design so it feels like exploring between stars and multiverses.
Agent did: Moved all the Multiverse styles to `src/multiverse.css`. Added `src/components/SpaceBackdrop.tsx`: deep space over the cartoon background, 160 twinkling stars, coloured nebulas, two far portals and shooting stars, plus a "hyperspace" rush on every jump. No more cards: portals float on a star map, planets float over radar rings, and the search and filter sit in a "navigation console". The location window is a ship's scanner (scan lines, corner brackets, a radar around the planet, facts as screen lines), and the residents are round portraits with a green (alive) or red (dead) ring. Added the Space Mono font for the screen texts.
I checked: (fill in, e.g. "Opened Multiverse and felt like in space; opened a planet and saw the scanner.")

## Task 17 — tab icon, and dimensions and planets like in the show
Prompt: The browser tab shows the Vite icon; change it to the icon saved in the logo folder. Make the multiverse circles look like the show, I added a picture of how it should look, in many colours. Same for the planets you see after clicking a multiverse, I added a picture for that too.
Agent did: Made the tab icon from `logo/title.png` with round corners (`public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`), linked it in `index.html` and deleted Vite's `favicon.svg`. Cut 14 worlds out of `logo/multiverse.png` (painting over the "C-404"-style tags) into `src/assets/bubbles/`: every dimension is a glass bubble with a world inside, a glowing edge in its own colour and its name on a black tag; Dimension C-137 always gets the Smiths' house. Cut 23 planets out of `logo/stars.png` into `src/assets/planets/` with the black sky removed; `Planet.tsx` picks one by the kind of place (Earth, space station, strange place, planet) and gives repeats other colours. Added a slowly turning spiral galaxy behind everything.
I checked: (fill in, e.g. "Saw the new icon in the tab; saw the bubbles and the show's planets.")

## Task 17 (follow-up) — one turning sphere
Prompt: To make it really feel like space I don't want it so neat and square. I want one dynamic round sphere with all the balls inside, and when I move the mouse over a ball it grows.
Agent did: Added `src/sphereLayout.ts`, which packs circles of different sizes into one big circle (the biggest in the middle, each next one in the free spot closest to the middle), and `src/components/Sphere.tsx`: a glass sphere that turns slowly while the items inside stay upright; it stops turning while the mouse is on it. The ball under the mouse grows and shows its name, and the others fade. On phones the first tap grows a ball and the second opens it. Both the dimensions and the planets use it.
I checked: (fill in, e.g. "Moved the mouse over the sphere and watched the bubbles grow.")

## Task 17 (follow-up) — gentler and smoother
Prompt: Don't make the balls grow so much, keep it looking fine, but don't make everything the same size either. Make it feel a bit more alive and smooth when I move the mouse. Also keep adding the prompts to prompts.md, and add any you skipped.
Agent did: The ball under the mouse now grows 1.32 times instead of 1.9. Every ball gets a size change between 0.8 and 1.25 that comes from its name (`sizeVariety` in `sphereLayout.ts`), so balls with the same number of locations are not all the same size. `Sphere.tsx` follows the mouse once per screen frame: the sphere leans a few degrees towards it, the shine on the glass moves with it, and the balls near it grow a little and move aside to make room. All movement uses one soft easing curve without bouncing. Added the missing entries to this log (Setup — how to commit, Tasks 14–17) and Tasks 14–17 to `tasks.md`.
I checked: (fill in, e.g. "Moved the mouse slowly across the sphere and watched the bubbles make room.")

## Task 17 (follow-up) — no huge planets, and a styled dimension list
Prompt: The planets are still big, and so are some of the universes. Don't make them huge just because they have more planets inside, and inside a universe with only a few planets don't make them huge either; I want something that looks good. Also, when I click the dimension filter it opens the browser's default list, which I don't like; style it in the Rick and Morty look of the site.
Agent did: Sizes now change only a little: a dimension with 57 locations is about 1.7 times a dimension with 1 (was 3.6), a planet with 230 residents about 1.6 times an empty one (was 2.7), and the size change from the name is 0.85–1.18. `sphereLayout.ts`: the sphere itself is smaller when there are only a few items (`sphereWidth`, 450px for 1 item up to 860px), and the smallest items are at most 100px wide, so a dimension with 1 or 5 planets no longer shows them huge. Replaced the `<select>` with `src/components/DimensionPicker.tsx`: a button that opens a ship's-screen list (scan lines, portal-green glow) where every dimension has its own small bubble, its name and its count, and "All dimensions" a spinning portal; it opens with a soft animation and works with the keyboard (arrows, Home, End, Enter, Escape) and screen readers (`combobox` and `listbox` roles). The console sits above the sphere so the list covers it. Changed the filter test to click the list, and added a keyboard test: 21 of 21 pass, build and lint pass.
I checked: (fill in, e.g. "Opened Dimension C-137 and Chair Dimension and the planets were a normal size; opened the dimension list and chose one.")

## Check — tests, security and personal information
Prompt: Run tests on the app, and check that there are no security holes, code problems or exposed sensitive personal information.
Agent did: Ran the tests, `tsc`, `oxlint`, the build and `npm audit` (0 vulnerable packages). Searched the files and the whole git history for API keys, tokens, passwords, `.env` files, local paths, phone numbers and the personal email: nothing secret, and the only `.env` file ever committed was the empty `.env.example`. Checked the pictures for hidden data (EXIF, GPS): none. Checked the code for unsafe HTML (`dangerouslySetInnerHTML`, `innerHTML`, `eval`): none; the TVMaze summaries are read as plain text and the one outside link has `rel="noreferrer"`. Opened every page in a real browser and read the console. Fixed two problems: (1) `favorites.ts` trusted whatever was saved in `localStorage`, so `null` or a half character there would crash the page; it now keeps only real characters with an `https://` picture. (2) The Multiverse page gave two of its parts the same React `key`, which showed an error in the console. Added a test for broken saved favorites: 22 of 22 pass, build and lint pass. Still public: the first commits show my personal Gmail address as the author (newer commits use the GitHub noreply address).
I checked: (fill in, e.g. "Read the report and ran `npm test` myself.")
