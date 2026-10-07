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
