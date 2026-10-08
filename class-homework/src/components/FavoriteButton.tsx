type Props = {
  name: string
  isFavorite: boolean
  onToggle: () => void
  className?: string
}

function FavoriteButton({ name, isFavorite, onToggle, className = '' }: Props) {
  return (
    <button
      type="button"
      className={`favorite-button ${className}`}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${name} from favorites`
          : `Add ${name} to favorites`
      }
      onClick={onToggle}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.1 4 7 4c2.1 0 3.6 1.1 5 2.9C13.4 5.1 14.9 4 17 4c3.9 0 6.1 4.2 4.6 7.7C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
