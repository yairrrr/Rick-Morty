# Tasks: Rick and Morty Character Encyclopedia

Build in this order. Each task is one commit.

## Task 1: Show the list from sample data
Create the React project. Save 5 sample characters in a local JSON file, copying the real API's fields: `id`, `name`, `image`, `species`, `episode`. Show them as a list on the left side of the page. Each card shows a small picture and the name.

Done when: I open the app and see 5 cards, each with a small picture and a name.

## Task 2: Click a character to show its details
Add the details panel on the right side. Clicking a card shows that character's large picture, name, species, and number of episodes. Before any click, the panel shows "Pick a character to see details". Mark the selected card so it stands out in the list.

Done when: I see the "Pick a character" message at first, and clicking any card shows its details on the right.

## Task 3: Load the first 20 characters from the API
Replace the sample JSON with data from https://rickandmortyapi.com/api/character. Show "Loading..." while waiting and an error message if the request fails.

Done when: I open the app and see the real first 20 characters, starting with Rick Sanchez, and clicking one still shows its details.

## Task 4: Add the "Load more" button
Add a "Load more" button at the bottom of the list. Each click fetches the next page and adds its 20 characters below the ones already shown. Hide the button when there are no more pages.

Done when: Clicking "Load more" grows the list from 20 to 40 characters, and the first 20 are still there.

## Task 5: Search by name
Add a search box above the list. Typing a name fetches matching characters from the API and replaces the list with the results. Clearing the box brings back the full list.

Done when: Typing "Rick" shows only characters whose name includes "Rick", and clearing the box shows the full list again.

## Task 6: Handle searches with no results
When a search finds nothing, the API returns an error instead of an empty list. Show "No characters found" instead of the error message.

Done when: Typing a name that does not exist, like "zzzz", shows "No characters found" and the app does not look broken.

## Task 7: "Load more" works on search results
Make "Load more" fetch the next page of the current search, not the next page of all characters.

Done when: Searching "Rick" and clicking "Load more" adds more Ricks to the list, and only Ricks.

## Task 8: Final check and cleanup
Go through every acceptance criterion in PRD.md and confirm it works. Remove the sample JSON file if nothing uses it anymore, and tidy up the layout and spacing.

Done when: All 5 acceptance criteria in PRD.md pass when I test them by hand.

## Task 9: Rick and Morty look, mobile first
Replace the "Rick and Morty Characters" title with the logo picture (`logo/logo.png`), and use the space landscape picture as the page background. Restyle every character card, the search box, the "Load more" button and the details panel in the show's style: dark space glass, portal green and Rick blue, and cartoon fonts that match the show. Center everything and build it mobile first: phones, tablets and laptops.

Done when: I open the app and see the logo instead of the title, the space background behind everything, and styled character cards in a grid that fits a phone (2 per row), a tablet (3 per row) and a laptop (list next to the details panel), and all tests still pass.

## Task 10: YouTube video about the character
When I click a character, find a short YouTube video about it with the YouTube Data API and play it in a small window under the character's details. Keep the API key out of git. Without a key, or if YouTube fails, show a link that searches YouTube for the character instead.

Done when: Clicking a character shows a small video about it under its details that starts playing by itself (muted), clicking another character changes the video, and all tests pass.

## Task 11: Pages with React Router
Add React Router. Move the characters into their own page at `/`, and put the logo and a menu (Characters, Episodes, About) in a layout shared by every page. Any address that doesn't exist shows a "Wrong dimension!" page.

Done when: Clicking the menu items changes the address and the page, the current page is marked in the menu, the browser's back button works, and `/no-such-page` shows "Wrong dimension!".

## Task 12: Episodes page
Add `/episodes`: every episode of the show, season by season, each with a picture, its code (S01E01), air date, length and a short summary. The Rick and Morty API has no pictures or summaries, so use the free TVMaze API. Keep the chosen season in the address (`/episodes?season=2`).

Done when: I open Episodes and see the season 1 episodes with pictures and summaries, clicking "Season 2" shows only season 2 and the address changes to `?season=2`, and refreshing keeps season 2.

## Task 13: About page
Add `/about`: what the app is, what you can do in it, where the data comes from (with links), and what it is built with.

Done when: Clicking About in the menu shows the About page, and it looks good on a phone and a laptop.

## Task 14: Favorites, character facts and a new logo
Add a heart to every character card and to the details, and a "Favorites" tab that shows only the hearted characters, saved in the browser. Show every fact the API has about a character in the details: status, species, type, gender, origin, last known location, number of episodes and first episode. Use the new logo picture.

Done when: I heart a character, refresh, open Favorites and it is still there, the details show all the facts, the new logo shows at the top, and all tests pass.

## Task 15: Multiverse page
Add `/multiverse`, built from the Rick and Morty location API (all pages, loaded once): first the dimensions, then the locations of the chosen dimension drawn as planets. Search locations by name and filter by dimension. Clicking a planet opens a window with its type, dimension, number of residents and their pictures; clicking a resident shows their details. Space look with CSS animations, works on phones.

Done when: I open Multiverse from the menu, pick a dimension and see its planets, search and filter work, a planet shows its residents and a resident its details, Back works, the locations are requested only once per visit, and all tests pass.

## Task 16: Remove the YouTube feature
Remove the YouTube video and everything that belongs to it: code, styles, tests, the API key setup and the mentions in the About page and the README. (Task 10 is no longer in the app.)

Done when: Clicking a character shows no video, nothing in the code mentions YouTube, and all tests pass.

## Task 17: Multiverse like in the show
Make the Multiverse look like the show: every dimension is a glowing bubble with a world inside and every location a planet in the show's style, all packed inside one big slowly turning sphere. The ball under the mouse grows a little, its neighbours make room, and it all moves smoothly. Use the icon in the logo folder for the browser tab.

Done when: I see one round sphere with bubbles of different sizes and colours, the one under the mouse grows a little and smoothly, the planets look like the show, the tab shows the new icon, and all tests pass.
