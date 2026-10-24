"use client"

import { useState } from "react"
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FloatingCard, motion } from "@/components/motion"
import type { VerifiableCredential } from "@/lib/types"

const typeConfig = {
  UniversityDegree: {
    icon: GraduationCap,
    gradient: "from-[#32E875]/10 to-[#1E3A8A]/5",
    accent: "#32E875",
    label: "University Degree",
  },
  EmploymentVerification: {
    icon: Briefcase,
    gradient: "from-[#1E3A8A]/10 to-[#32E875]/5",
    accent: "#1E3A8A",
    label: "Employment Verification",
  },
}

export function CredentialCard({
  credential,
  delay = 0,
}: {
  credential: VerifiableCredential
  delay?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const config = typeConfig[credential.credentialType]
  const Icon = config.icon

  const subjectEntries = Object.entries(credential.credentialSubject).filter(
    ([key]) => key !== "id"
  )

  return (
    <FloatingCard delay={delay}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {/* Card header with subtle gradient */}
        <div className={`bg-gradient-to-r ${config.gradient} px-6 py-4`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${config.accent}20` }}
              >
                <Icon className="size-5" style={{ color: config.accent }} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {config.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {credential.issuer.name}
                </p>
              </div>
            </div>
            {credential.verified && (
              <Badge className="gap-1 border-none bg-[#32E875]/10 text-[#0F172A]">
                <ShieldCheck className="size-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              Issued:{" "}
              {new Date(credential.issuanceDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="size-3" />
              Issuer DID: {credential.issuer.id.slice(0, 24)}...
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3 text-[#32E875]" />
            Stored locally on your device
          </div>

          {credential.verified && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#32E875]">
              <div className="size-1.5 rounded-full bg-[#32E875]" />
              Cryptographically Verified
            </div>
          )}

          {/* Expand/Collapse details */}
          <motion.div
            initial={false}
            animate={{ height: expanded ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-2 rounded-xl bg-secondary/50 p-4">
              <p className="text-xs font-semibold text-foreground">
                Credential Details
              </p>
              {subjectEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="capitalize text-muted-foreground">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="font-medium text-foreground">
                    {String(value)}
                  </span>
                </div>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-xs text-muted-foreground">
                  Schema:{" "}
                  <code className="font-mono text-foreground">
                    {credential.schema}
                  </code>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Proof Type:{" "}
                  <code className="font-mono text-foreground">
                    {credential.proof.type}
                  </code>
                </p>
              </div>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full gap-1.5 text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="size-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                View Details
              </>
            )}
          </Button>
        </div>
      </div>
    </FloatingCard>
  )
}
