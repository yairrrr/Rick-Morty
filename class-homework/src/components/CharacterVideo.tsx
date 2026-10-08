import { useEffect, useState } from 'react'
import {
  embedUrl,
  findCharacterVideo,
  hasYoutubeKey,
  youtubeSearchPageUrl,
} from '../youtube'

type Props = {
  name: string
}

type VideoState =
  | { status: 'loading' }
  | { status: 'found'; videoId: string }
  | { status: 'none' }

// App gives this component a new `key` for each character,
// so the state starts over at "loading" on every click
function CharacterVideo({ name }: Props) {
  const [video, setVideo] = useState<VideoState>(
    hasYoutubeKey() ? { status: 'loading' } : { status: 'none' },
  )

  useEffect(() => {
    if (!hasYoutubeKey()) return
    const controller = new AbortController()
    findCharacterVideo(name, controller.signal)
      .then((videoId) =>
        setVideo(videoId ? { status: 'found', videoId } : { status: 'none' }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setVideo({ status: 'none' })
      })
    return () => controller.abort()
  }, [name])

  return (
    <section className="character-video" aria-label={`Video about ${name}`}>
      <h3>On YouTube</h3>
      {video.status === 'loading' && (
        <div className="video-frame video-loading">Opening a portal...</div>
      )}
      {video.status === 'found' && (
        <div className="video-frame">
          <iframe
            src={embedUrl(video.videoId)}
            title={`YouTube video about ${name}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {video.status === 'none' && (
        <a
          className="video-link"
          href={youtubeSearchPageUrl(name)}
          target="_blank"
          rel="noreferrer"
        >
          Search YouTube for {name}
        </a>
      )}
    </section>
  )
}

export default CharacterVideo
