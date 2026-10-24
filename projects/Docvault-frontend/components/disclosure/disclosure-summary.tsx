"use client"

import { Check, Lock, Shield } from "lucide-react"
import { FadeInScale } from "@/components/motion"

interface DisclosureSummaryProps {
  credentialSubject: Record<string, unknown>
  selectedAttributes: string[]
}

export function DisclosureSummary({
  credentialSubject,
  selectedAttributes,
}: DisclosureSummaryProps) {
  const entries = Object.entries(credentialSubject).filter(
    ([key]) => key !== "id"
  )

  const shared = entries.filter(([key]) => selectedAttributes.includes(key))
  const hidden = entries.filter(([key]) => !selectedAttributes.includes(key))

  return (
    <FadeInScale>
      <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Shield className="size-4 text-[#32E875]" />
          Disclosure Summary
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {selectedAttributes.length > 0
            ? "You are sharing:"
            : "No attributes selected yet."}
        </p>

        {shared.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {shared.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 rounded-lg bg-[#32E875]/5 px-3 py-2 text-xs"
              >
                <Check className="size-3.5 text-[#32E875]" />
                <span className="capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="ml-auto font-medium text-foreground">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {hidden.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs text-muted-foreground">
              All other attributes remain private:
            </p>
            <div className="flex flex-col gap-1">
              {hidden.map(([key]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <Lock className="size-3" />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="ml-auto font-mono blur-sm select-none">
                    ********
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </FadeInScale>
  )
}
