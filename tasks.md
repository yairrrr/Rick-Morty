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
