"use client"

import { useState } from "react"
import {
  Copy,
  Check,
  QrCode,
  Shield,
  Globe,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingCard } from "@/components/motion"
import type { DIDDocument } from "@/lib/types"

export function DIDCard({
  did,
  onShowQR,
}: {
  did: DIDDocument
  onShowQR: () => void
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(did.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <FloatingCard>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#32E875]/10">
              <Fingerprint className="size-6 text-[#32E875]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Your Decentralized Identifier
              </h3>
              <Badge
                variant="outline"
                className="mt-1 gap-1 border-[#1E3A8A]/20 bg-[#1E3A8A]/5 text-[#1E3A8A]"
              >
                <Globe className="size-3" />
                {did.method}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#32E875]">
            <Shield className="size-3.5" />
            Self-Sovereign
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3">
          <code className="break-all text-sm font-mono text-foreground">
            {did.id}
          </code>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-[#32E875]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy DID
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowQR}
            className="gap-1.5"
          >
            <QrCode className="size-3.5" />
            QR Code
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#32E875]/5 px-3 py-2 text-xs text-muted-foreground">
          <Shield className="size-3.5 shrink-0 text-[#32E875]" />
          This DID is controlled only by you. No centralized authority can
          revoke or modify it.
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Created:{" "}
            {new Date(did.created).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span>Controller: self</span>
        </div>
      </div>
    </FloatingCard>
  )
}
