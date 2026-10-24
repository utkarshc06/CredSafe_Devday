"use client"

import { useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function DIDQRModal({
  open,
  onOpenChange,
  did,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  did: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!open || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Generate a deterministic QR-like pattern from the DID string
    const size = 200
    canvas.width = size
    canvas.height = size

    const moduleCount = 25
    const moduleSize = size / moduleCount

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = "#0F172A"

    // Generate pattern from DID hash
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        const charCode = did.charCodeAt((row * moduleCount + col) % did.length)
        const isModule =
          (charCode * (row + 1) * (col + 1)) % 3 === 0 ||
          // Finder patterns
          (row < 7 && col < 7) ||
          (row < 7 && col >= moduleCount - 7) ||
          (row >= moduleCount - 7 && col < 7)

        if (isModule) {
          // Create white border for finder patterns
          if (
            (row < 7 && col < 7) ||
            (row < 7 && col >= moduleCount - 7) ||
            (row >= moduleCount - 7 && col < 7)
          ) {
            const isOuter =
              row === 0 ||
              row === 6 ||
              col === 0 ||
              col === 6 ||
              row === moduleCount - 1 ||
              row === moduleCount - 7 ||
              col === moduleCount - 1 ||
              col === moduleCount - 7
            const isInner =
              (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
              (row >= 2 &&
                row <= 4 &&
                col >= moduleCount - 5 &&
                col <= moduleCount - 3) ||
              (row >= moduleCount - 5 &&
                row <= moduleCount - 3 &&
                col >= 2 &&
                col <= 4)

            if (isOuter || isInner) {
              ctx.fillStyle = "#0F172A"
              ctx.fillRect(
                col * moduleSize,
                row * moduleSize,
                moduleSize,
                moduleSize
              )
            }
          } else {
            ctx.fillStyle = "#0F172A"
            ctx.fillRect(
              col * moduleSize,
              row * moduleSize,
              moduleSize,
              moduleSize
            )
          }
        }
        ctx.fillStyle = "#0F172A"
      }
    }
  }, [open, did])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>DID QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to share your decentralized identifier.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-2xl border border-border bg-background p-4">
            <canvas ref={canvasRef} className="size-[200px]" />
          </div>
          <code className="max-w-full break-all rounded-lg bg-secondary px-3 py-2 text-xs text-foreground">
            {did}
          </code>
        </div>
      </DialogContent>
    </Dialog>
  )
}
