# Rick and Morty Character Encyclopedia

A small React app for Rick and Morty fans: browse and search every character in the show, and click one to see its details.

Built as a first-year web development project, using a master-detail layout: a list of characters on the left and a details panel on the right.

## Features

- Shows the first 20 characters when the app opens, with a small picture and a name
- Click a character to see a large picture, the name and its facts from the API: status (alive or dead), species, type, gender, origin, last known location, number of episodes and the first episode it appears in
- Tap the heart to add a character to your **favorites**. The Favorites tab shows only them, and they are saved in the browser
- Search characters by name
- "Load more" adds the next 20 characters, also on search results
- Shows how many characters were found
- An **Episodes** page: every episode, season by season, with a picture and a short summary
- A **Multiverse** page: every dimension is a bubble inside one big turning sphere (the one under the mouse grows; on phones the first tap grows it and the second opens it). Pick a dimension to see its locations as planets in the same kind of sphere, search them by name or filter by dimension, and click a planet to see its type, dimension and residents (click a resident for its details). The API has no pictures or coordinates for locations, so the map is our own drawing, not a real map of the show
- An **About** page, and a "Wrong dimension!" page for addresses that don't exist
- Clear messages while loading, when nothing is selected, when a search finds nothing, and when the API fails

## Data

Data comes from the free [Rick and Morty API](https://rickandmortyapi.com) (no key needed):
`https://rickandmortyapi.com/api/character` and `https://rickandmortyapi.com/api/location`

The API blocks requests for about 10 seconds after roughly 30 requests (pictures count too). When that happens, the app waits and tries once more.

The API has no pictures of locations, so the planets and the dimension bubbles on the Multiverse page are cut out of two pictures in the `logo` folder (`stars.png` and `multiverse.png`) and saved in `src/assets/planets` and `src/assets/bubbles`. The browser tab icon comes from `logo/title.png`.

Episode pictures and summaries come from the free [TVMaze API](https://www.tvmaze.com/api) (no key needed): `https://api.tvmaze.com/shows/216/episodes`

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
  main.tsx                     Starts the app inside React Router (BrowserRouter)
  App.tsx                      The routes: which page shows at which address
  api.ts                       Fetches characters from the Rick and Morty API
  tvmaze.ts                    Fetches episodes from TVMaze
  locations.ts                 Fetches every location (all pages, once) and their residents
  multiverse.css               The space look of the Multiverse page
  sphereLayout.ts              Packs the bubbles or planets into the sphere
  favorites.ts                 Saves the favorite characters in the browser
  types.ts                     The Character type
  pages/
    CharactersPage.tsx         /          The characters, search and details
    EpisodesPage.tsx           /episodes  Episodes by season (?season=2)
    MultiversePage.tsx         /multiverse  Dimensions and their planets (?dimension=...&location=1)
    AboutPage.tsx              /about     About the app
    NotFoundPage.tsx           any other address
  components/
    Layout.tsx                 The logo and the menu, shared by every page
    CharacterList.tsx          The list of character cards
    CharacterDetails.tsx       The details panel
    FavoriteButton.tsx         The heart button
    Planet.tsx                 A drawn planet for a location
    LocationDialog.tsx         The window with a location's details and residents
    SpaceBackdrop.tsx          Stars, nebulas and portals behind the Multiverse page
    Sphere.tsx                 The turning sphere with the bubbles or planets inside
  App.test.tsx                 Tests for the acceptance criteria
```

When you publish the app, the host must answer every address with `index.html` (on Vercel and Netlify this is the usual setting for single-page apps). Otherwise refreshing `/about` gives the host's own 404 page.

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
