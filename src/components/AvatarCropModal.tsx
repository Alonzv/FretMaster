import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  imageSrc: string        // original image data URL
  onConfirm: (croppedDataUrl: string) => void
  onCancel: () => void
  isHe: boolean
}

const OUTPUT_SIZE = 200   // final output square in pixels
const VIEWPORT = 280      // canvas display size in px

export default function AvatarCropModal({ imageSrc, onConfirm, onCancel, isHe }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)

  // pan offset (canvas pixels) and zoom
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [zoom, setZoom]       = useState(1)

  // drag state
  const dragging    = useRef(false)
  const lastPos     = useRef({ x: 0, y: 0 })
  const stateRef    = useRef({ offsetX: 0, offsetY: 0, zoom: 1 })

  // keep stateRef in sync so pointer handlers always have current values
  useEffect(() => { stateRef.current = { offsetX, offsetY, zoom } }, [offsetX, offsetY, zoom])

  // Load image once and center it
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      // initial zoom to fill the circular viewport
      const minFit = VIEWPORT / Math.min(img.width, img.height)
      const initZoom = Math.max(minFit, 1)
      const initX = (VIEWPORT - img.width  * initZoom) / 2
      const initY = (VIEWPORT - img.height * initZoom) / 2
      stateRef.current = { offsetX: initX, offsetY: initY, zoom: initZoom }
      setOffsetX(initX)
      setOffsetY(initY)
      setZoom(initZoom)
    }
    img.src = imageSrc
  }, [imageSrc])

  // Redraw whenever position or zoom changes
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, VIEWPORT, VIEWPORT)
    ctx.drawImage(img, offsetX, offsetY, img.width * zoom, img.height * zoom)

    // Dark overlay outside circle
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, VIEWPORT, VIEWPORT)
    ctx.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2 - 1, 0, Math.PI * 2, true)
    ctx.clip()
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, VIEWPORT, VIEWPORT)
    ctx.restore()

    // Crisp circle border
    ctx.save()
    ctx.beginPath()
    ctx.arc(VIEWPORT / 2, VIEWPORT / 2, VIEWPORT / 2 - 1, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()
  }, [offsetX, offsetY, zoom])

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffsetX(x => x + dx)
    setOffsetY(y => y + dy)
  }, [])

  const onPointerUp = useCallback(() => { dragging.current = false }, [])

  // Pinch-zoom on touch
  const prevDist = useRef<number | null>(null)
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      if (prevDist.current !== null) {
        const delta = dist / prevDist.current
        setZoom(z => Math.max(0.5, Math.min(5, z * delta)))
      }
      prevDist.current = dist
    }
  }, [])
  const onTouchEnd = useCallback(() => { prevDist.current = null }, [])

  // Scroll-wheel zoom (desktop)
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.08 : 0.92
    setZoom(z => Math.max(0.5, Math.min(5, z * factor)))
  }, [])

  // ── Confirm: render visible circle to OUTPUT_SIZE canvas ─────────────────
  const handleConfirm = () => {
    const img = imgRef.current
    if (!img) return

    const out = document.createElement('canvas')
    out.width  = OUTPUT_SIZE
    out.height = OUTPUT_SIZE
    const ctx = out.getContext('2d')!

    // Scale factor from display canvas to output
    const scale = OUTPUT_SIZE / VIEWPORT

    // Circle clip
    ctx.beginPath()
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()

    // Draw image with same transform as display
    ctx.drawImage(
      img,
      offsetX * scale,
      offsetY * scale,
      img.width  * zoom * scale,
      img.height * zoom * scale,
    )

    onConfirm(out.toDataURL('image/jpeg', 0.88))
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        background: 'var(--fm-bg-deep)',
        borderRadius: 20,
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        width: 'min(360px, 100%)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--fm-text)' }}>
          {isHe ? 'מיקום תמונה' : 'Crop & Position'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--fm-text-muted)', textAlign: 'center' }}>
          {isHe ? 'גרור כדי להזיז • גלגל/פינצ׳ לזום' : 'Drag to move • Scroll / pinch to zoom'}
        </div>

        {/* Canvas */}
        <div style={{
          borderRadius: '50%',
          overflow: 'hidden',
          width: VIEWPORT,
          height: VIEWPORT,
          cursor: 'grab',
          flexShrink: 0,
          touchAction: 'none',
          boxShadow: '0 0 0 3px var(--fm-primary)',
        }}>
          <canvas
            ref={canvasRef}
            width={VIEWPORT}
            height={VIEWPORT}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
            style={{ display: 'block', touchAction: 'none' }}
          />
        </div>

        {/* Zoom slider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--fm-text-muted)">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="range" min={0.5} max={5} step={0.01}
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--fm-primary)' }}
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--fm-text-muted)">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
          </svg>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12,
              background: 'var(--fm-bg-card)', border: '1px solid var(--fm-border)',
              color: 'var(--fm-text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {isHe ? 'ביטול' : 'Cancel'}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '12px 0', borderRadius: 12,
              background: 'var(--fm-primary)', color: 'white',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {isHe ? 'שמור' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
