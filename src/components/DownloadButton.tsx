"use client"

interface Props {
  imageSrc: string | null
  crop: { x: number; y: number; width: number; height: number } | null
  fileName: string
  targetWidth: number
  targetHeight: number
}

export default function DownloadButton({ imageSrc, crop, fileName, targetWidth, targetHeight }: Props) {
  const disabled = !imageSrc || !crop || crop.width <= 0 || crop.height <= 0

  function handleDownload() {
    if (disabled) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const pixelX = (crop.x / 100) * img.naturalWidth
      const pixelY = (crop.y / 100) * img.naturalHeight
      const pixelW = (crop.width / 100) * img.naturalWidth
      const pixelH = (crop.height / 100) * img.naturalHeight

      const sourceCanvas = document.createElement("canvas")
      sourceCanvas.width = Math.round(pixelW)
      sourceCanvas.height = Math.round(pixelH)

      const sourceCtx = sourceCanvas.getContext("2d")
      if (!sourceCtx) return

      sourceCtx.drawImage(
        img,
        pixelX, pixelY, pixelW, pixelH,
        0, 0, sourceCanvas.width, sourceCanvas.height
      )

      const destCanvas = document.createElement("canvas")
      destCanvas.width = targetWidth
      destCanvas.height = targetHeight

      const destCtx = destCanvas.getContext("2d")
      if (!destCtx) return

      destCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight)

      destCanvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, "image/png")
    }
    img.src = imageSrc
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      Download Cropped
    </button>
  )
}
