# PRD: Rick and Morty Character Encyclopedia

## 1. One-sentence pitch
A simple web app where Rick and Morty fans can browse and search every character in the show and click one to see its details.

## 2. Who it is for
Fans of the animated series *Rick and Morty* who want a quick, clean way to look up characters, from the main family to the strangest one-time aliens.

## 3. Screens
The app has one page split into two parts:

- **List (left side):** A search box at the top, then a list of character cards. Each card shows a small picture and the character's name. A "Load more" button sits at the bottom of the list.
- **Details (right side):** Shows the character the user clicked: a large picture, the name, the species, and the number of episodes the character appears in. Before any character is clicked, it shows the message "Pick a character to see details".

## 4. Must-have features
1. Show the first 20 characters when the app opens.
2. Click a character in the list to see its details in the details panel.
3. Search characters by name.
4. A "Load more" button that adds the next 20 characters to the list (also works on search results).
5. A clear message in the details panel when no character is selected, and a clear message when a search finds nothing.

## 5. Acceptance criteria
- When I open the app, I see a list of 20 characters, each with a small picture and a name, and the message "Pick a character to see details".
- When I click a character, I see its large picture, name, species, and number of episodes in the details panel.
- When I type "Rick" in the search box, I see only characters whose name includes "Rick".
- When I click "Load more", I see 20 more characters added to the bottom of the list.
- When I search for a name that does not exist, I see a message that no characters were found.

## 6. Not now (ideas for later)
- Show the names of the episodes each character appears in, not just how many.

## 7. Data
- **API:** Rick and Morty API (free, no key needed)
- **Base URL:** https://rickandmortyapi.com/api/character
- **Next page:** https://rickandmortyapi.com/api/character?page=2 (the response also includes a ready-made link to the next page)
- **Search by name:** https://rickandmortyapi.com/api/character?name=rick (works together with page)

**Fields we use:**

| Field | Where it is shown | Meaning |
|---|---|---|
| `id` | Not shown | Tells characters apart and tracks which one is selected |
| `name` | List and details | The character's name |
| `image` | List (small) and details (large) | The character's picture |
| `species` | Details | For example Human, Alien, Robot |
| `episode` | Details | A list of episode links. We show only how many there are |
