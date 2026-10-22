import { useEffect, useRef, useState } from 'react'
import { KEY_SM } from './ui'

interface Props {
  /** The id from the video's URL (youtube.com/watch?v=<id>). */
  videoId: string
  /** Describes the video; used for the play button's label and the iframe's title. */
  title: string
  /** Image shown on the placeholder before the video loads (16:9). */
  poster?: string
}

/**
 * A YouTube video behind a click-to-load placeholder. Nothing is fetched from YouTube until Play is
 * pressed, so opening the page makes no third-party requests. Uses the privacy-enhanced domain.
 */
export function YouTubeEmbed({ videoId, title, poster }: Props) {
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // The Play button disappears when the iframe replaces it, so hand focus to the player.
  useEffect(() => {
    if (loaded) iframeRef.current?.focus()
  }, [loaded])

  return (
    <div className="aspect-video w-full border border-line bg-lcd">
      {loaded ? (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full"
        />
      ) : (
        // The whole placeholder is the button; the key inside is just its visible label.
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={`Play video: ${title}`}
          className={`group relative flex h-full w-full items-end p-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-focus ${poster ? '' : 'dither bg-panel'}`}
        >
          {poster && <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
          <span className={`${KEY_SM} relative group-hover:bg-ink group-hover:text-panel`}>▶ Play</span>
        </button>
      )}
    </div>
  )
}
