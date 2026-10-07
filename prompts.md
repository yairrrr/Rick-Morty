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
