"use client"

import { Check, Lock, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "@/components/motion"

interface AttributeSelectorProps {
  attributes: [string, unknown][]
  selectedAttributes: string[]
  onToggle: (attr: string) => void
}

export function AttributeSelector({
  attributes,
  selectedAttributes,
  onToggle,
}: AttributeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {attributes.map(([key, value]) => {
        const selected = selectedAttributes.includes(key)
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(key)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
              selected
                ? "border-[#32E875] bg-[#32E875]/5 ring-1 ring-[#32E875]/20"
                : "border-border bg-background hover:border-muted-foreground/20"
            )}
          >
            {/* Checkbox */}
            <div
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                selected
                  ? "border-[#32E875] bg-[#32E875]"
                  : "border-border bg-background"
              )}
            >
              {selected && <Check className="size-3 text-[#0F172A]" />}
            </div>

            {/* Attribute */}
            <div className="flex-1">
              <span className="text-sm capitalize text-foreground">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>

            {/* Value (shown or masked) */}
            <div className="flex items-center gap-2">
              {selected ? (
                <div className="flex items-center gap-1.5">
                  <Eye className="size-3 text-[#32E875]" />
                  <span className="text-sm font-medium text-foreground">
                    {String(value)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Lock className="size-3 text-muted-foreground" />
                  <span className="font-mono text-sm text-muted-foreground blur-sm select-none">
                    {String(value).slice(0, 8)}
                  </span>
                </div>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
