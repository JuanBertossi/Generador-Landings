import { useEffect, useRef } from 'react'
import '../styles/WelcomeScreen.css'
import { EditableText } from '@/shared/components/EditableText'
import { useEditable } from '@/shared/components/EditableContext'

function renderMultilinea(texto) {
  return texto.split('\n').map((linea, i, arr) => (
    <span key={i}>
      {linea}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export default function WelcomeScreen({
  onEnter,
  eyebrow = '86 AÑOS',
  nombre = 'MIRO',
  subtitulo = 'Hay momentos en la vida que son únicos e inolvidables.\nEste es uno de ellos.',
  youtubeVideoId = 'mQmOZX-8EZI',
  botonIngresar = 'INGRESAR',
}) {
  const iframeRef = useRef(null)
  const playerRef = useRef(null)
  const { editable } = useEditable()

  useEffect(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: youtubeVideoId,
        playerVars: { start: 0, autoplay: 0, rel: 0, playsinline: 1 },
      })
    }
    return () => { delete window.onYouTubeIframeAPIReady }
  }, [youtubeVideoId])

  const handleEnter = () => {
    if (playerRef.current?.playVideo) playerRef.current.playVideo()
    onEnter()
  }

  return (
    <div className="welcome">
      <div style={{ width: 1, height: 1, overflow: 'hidden', position: 'absolute' }}>
        <div id="yt-player" ref={iframeRef} />
      </div>
      <EditableText path="anfitrion.eyebrow" value={eyebrow} as="p" className="welcome__eyebrow fade-up" />
      <EditableText path="anfitrion.nombre" value={nombre} as="h1" className="welcome__title fade-up delay-1" />
      <EditableText
        path="bienvenida.subtitulo"
        value={subtitulo}
        as="p"
        multiline
        className="welcome__sub fade-up delay-2"
        render={renderMultilinea}
      />
      <button className="welcome__btn fade-up delay-3" onClick={handleEnter}>
        <span onClick={(e) => editable && e.stopPropagation()}>
          <EditableText path="textos.botonIngresar" value={botonIngresar} as="span" />
        </span>
      </button>
    </div>
  )
}
