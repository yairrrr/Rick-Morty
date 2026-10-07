# Rick and Morty Character Encyclopedia

A small React app for Rick and Morty fans: browse and search every character in the show, and click one to see its details.

Built as a first-year web development project, using a master-detail layout: a list of characters on the left and a details panel on the right.

## Features

- Shows the first 20 characters when the app opens, with a small picture and a name
- Click a character to see a large picture, the name, the species and the number of episodes
- Search characters by name
- "Load more" adds the next 20 characters, also on search results
- Shows how many characters were found
- Clear messages while loading, when nothing is selected, when a search finds nothing, and when the API fails

## Data

Data comes from the free [Rick and Morty API](https://rickandmortyapi.com) (no key needed):
`https://rickandmortyapi.com/api/character`

The API blocks requests for about 10 seconds after roughly 30 requests (pictures count too). When that happens, the app waits and tries once more.

## Getting started

You need [Node.js](https://nodejs.org) installed. The app lives in the `class-homework` folder:

```bash
cd class-homework
npm install
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the app locally |
| `npm test` | Runs the tests (the PRD acceptance criteria) |
| `npm run build` | Builds the app for publishing |
| `npm run lint` | Checks the code for common mistakes |

## Project structure

```
class-homework/src/
  App.tsx                      Keeps the app's state: characters, search, selected character
  api.ts                       Fetches characters from the API
  types.ts                     The Character type
  components/
    CharacterList.tsx          The list of character cards
    CharacterDetails.tsx       The details panel
  App.test.tsx                 Tests for the acceptance criteria
```

## Project documents

- [PRD.md](PRD.md): what the app does and for whom
- [tasks.md](tasks.md): the build plan, one task per commit
- [prompts.md](prompts.md): what I asked the AI agent at each step and how I checked it
- [LAB.md](LAB.md): the bug-hunt lab and the test-first feature

## Built with

React, TypeScript, Vite, Vitest and Testing Library.

## איך נבחרת דמות ומגיעה לפאנל הפרטים

<div dir="rtl">

הדמות שנבחרה נשמרת ב־state בשם <code>selectedCharacter</code> בתוך הרכיב <code>App</code>, שהוא ההורה המשותף של הרשימה ושל פאנל הפרטים.
<code>App</code> מעביר לרכיב <code>CharacterList</code> את הפונקציה <code>handleSelect</code> דרך ה־prop בשם <code>onSelect</code>.
כשלוחצים על כרטיס, <code>CharacterList</code> קורא ל־<code>onSelect</code> עם ה־id של הדמות, ו־<code>handleSelect</code> מעדכן את ה־state ב־<code>App</code>.
העדכון גורם ל־<code>App</code> להתרנדר מחדש ולהעביר את הדמות שנבחרה לרכיב <code>CharacterDetails</code> דרך ה־prop בשם <code>character</code>.
<code>CharacterDetails</code> מציג את התמונה, השם, הזן ומספר הפרקים של הדמות, וכל עוד לא נבחרה דמות הוא מציג "Pick a character to see details".

</div>
