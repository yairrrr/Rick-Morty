# Lab: Bug Hunt (adapted to the Rick and Morty app)

The lab was written for a countries app. Here, "country" becomes "character", `CountryList` becomes `CharacterList`, and clicking Japan to see Tokyo becomes clicking Morty Smith to see "Human".

## Level 1 · Follow a click

**1. Which component stores the selected character?**
`App` (`class-homework/src/App.tsx`), in the state `selectedCharacter`, created with `useState`.

**2. Which prop passes the character to the details panel?**
The `character` prop: `<CharacterDetails character={selectedCharacter} />`.

**3. What happens, step by step, from clicking Morty Smith until "Human" appears?**
1. `App` passes `handleSelect` down to `CharacterList` as the `onSelect` prop.
2. Each card in `CharacterList` is a button with `onClick={() => onSelect(character.id)}`.
3. Clicking Morty's card calls `onSelect(2)`, which runs `handleSelect(2)` inside `App`.
4. `handleSelect` finds the character with id 2 in the list and calls `setSelectedCharacter(...)`.
5. The state changed, so React renders `App` again.
6. `App` passes the new `selectedCharacter` to `CharacterDetails` (`character` prop) and its id to `CharacterList` (`selectedId` prop).
7. `CharacterDetails` now has a character, so it shows the picture, the name, "Human" and "Appears in 51 episodes". `CharacterList` highlights Morty's card.

**4. If we move the state into `CharacterList`, what breaks, and why?**
The details panel stops working. State only flows down, from a parent to its children. `CharacterDetails` is not a child of `CharacterList`; they are siblings under `App`. If only `CharacterList` knows which character is selected, nothing can pass it to `CharacterDetails`, so the panel stays on "Pick a character to see details" forever. The state has to live in the closest common parent, which is `App`. (The "keep the details when a search hides the character" behavior would break too, since `App` would no longer hold the selected character.)

## Level 2 · Bug hunt

There is no separate lab version of our app, so each bug was planted on purpose in `class-homework/src/components/CharacterList.tsx`, the app was run with a test to see the symptom, and the file was restored. Our real code shows none of these errors (checked in the browser console in dev mode and in the tests).

| # | What you see | My guess: file and cause | What it actually was |
| --- | --- | --- | --- |
| 1 | Console error: `Cannot update a component (App) while rendering a different component (CharacterList)` | `CharacterList.tsx`. The message names the component. Something in it changes `App`'s state while it renders, most likely `onClick={onSelect(character.id)}`, which calls the function right away instead of on click. | Confirmed. `onClick={onSelect(character.id)}` runs `onSelect` for every card during render, which updates `App`'s state mid-render. The fix is to pass a function: `onClick={() => onSelect(character.id)}`. |
| 2 | Clicking a character does nothing: the details panel stays on "Pick a character to see details" | `CharacterList.tsx`. The click handler never actually calls `onSelect`, e.g. `onClick={() => onSelect}`. | Confirmed. `() => onSelect` returns the function without calling it, so no error appears and the state never changes. The fix is `() => onSelect(character.id)`. |
| 3 | Console warning: `Each child in a list should have a unique "key" prop` | `CharacterList.tsx`, in the `.map()` that builds the cards: the `<li>` has no `key`. | Confirmed. Removing `key={character.id}` from the `<li>` gives this warning. The fix is to give each item a stable, unique key: the character's `id`. |

## Level 3 · New feature, test first

The lab's acceptance line (`When I type "ja" in the search box, I see only Jamaica and Japan.`) is about search, which our app already had and which already had a passing test. To practice "red first", we used a new feature instead:

```
When I type "rick" in the search box, I see "107 characters found".
```

1. Wrote the test first in `class-homework/src/App.test.tsx`, using a fake API so the test does not need the network.
2. Ran `npm test`: **red**. 5 tests passed and the new one failed, because "107 characters found" was not on the page.
3. Made the smallest change to pass it: read `count` from the API response, keep it in `App`, and show it above the list.
4. Ran `npm test`: **green**, 6 of 6 tests pass.

The same test file also checks all 5 acceptance criteria from `PRD.md`.
