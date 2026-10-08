import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

export type DimensionOption = {
  name: string
  count: number
  // The world inside the dimension's bubble, and its edge colour
  world: string
  edgeHue: number
}

type Props = {
  value: string | null
  options: DimensionOption[]
  onChange: (name: string | null) => void
}

// The dimension filter as a ship's screen instead of the browser's plain
// list. Works with the keyboard like a normal list: arrows, Home, End,
// Enter to choose and Escape to close
function DimensionPicker({ value, options, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const id = useId()

  // Row 0 is "All dimensions"
  const rows: (DimensionOption | null)[] = [null, ...options]
  const selectedRow = Math.max(
    0,
    rows.findIndex((row) => (row?.name ?? null) === value),
  )
  const selected = rows[selectedRow]

  function open() {
    setActive(selectedRow)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function choose(row: number) {
    onChange(rows[row]?.name ?? null)
    close()
  }

  // Keyboard goes to the list when it opens
  useEffect(() => {
    if (isOpen) listRef.current?.focus()
  }, [isOpen])

  // Keep the active row in view while moving with the arrows
  useEffect(() => {
    if (!isOpen) return
    const row = listRef.current?.children[active] as HTMLElement | undefined
    row?.scrollIntoView?.({ block: 'nearest' })
  }, [isOpen, active])

  // A click anywhere else closes the list
  useEffect(() => {
    if (!isOpen) return
    function handlePointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    return () => document.removeEventListener('pointerdown', handlePointer)
  }, [isOpen])

  function handleListKey(e: KeyboardEvent) {
    const last = rows.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
      PageDown: Math.min(active + 8, last),
      PageUp: Math.max(active - 8, 0),
    }
    if (e.key in moves) {
      e.preventDefault()
      setActive(moves[e.key])
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div className="picker" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="console-input picker-button"
        role="combobox"
        aria-label="Dimension"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            open()
          }
        }}
      >
        <PickerRow row={selected} />
        <span className="picker-arrow" aria-hidden="true" />
      </button>
      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          className="picker-list"
          role="listbox"
          aria-label="Dimensions"
          tabIndex={-1}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={handleListKey}
        >
          {rows.map((row, i) => (
            <li
              key={row?.name ?? 'all'}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === selectedRow}
              className={
                i === active ? 'picker-option is-active' : 'picker-option'
              }
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <PickerRow row={row} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// One line of the list: a little bubble, the name and the count
function PickerRow({ row }: { row: DimensionOption | null }) {
  if (!row) {
    return (
      <>
        <span className="picker-portal" aria-hidden="true" />
        <span className="picker-name">All dimensions</span>
      </>
    )
  }
  return (
    <>
      <span
        className="picker-bubble"
        style={{ '--edge-hue': row.edgeHue } as CSSProperties}
        aria-hidden="true"
      >
        <img src={row.world} alt="" />
      </span>
      <span className="picker-name">{row.name}</span>
      <span className="picker-count">{row.count}</span>
    </>
  )
}

export default DimensionPicker
