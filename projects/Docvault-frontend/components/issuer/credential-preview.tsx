"use client"

import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FadeInScale } from "@/components/motion"
import type { VerifiableCredential } from "@/lib/types"

const typeConfig = {
  UniversityDegree: {
    icon: GraduationCap,
    accent: "#32E875",
    label: "University Degree Credential",
  },
  EmploymentVerification: {
    icon: Briefcase,
    accent: "#1E3A8A",
    label: "Employment Verification Credential",
  },
}

export function CredentialPreview({
  credential,
}: {
  credential: VerifiableCredential
}) {
  const config = typeConfig[credential.credentialType]
  const Icon = config.icon
  const subjectEntries = Object.entries(credential.credentialSubject).filter(
    ([key]) => key !== "id"
  )

  return (
    <FadeInScale>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{ backgroundColor: `${config.accent}08` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${config.accent}15` }}
              >
                <Icon className="size-6" style={{ color: config.accent }} />
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
            <Badge className="gap-1 border-none bg-[#32E875]/10 text-[#0F172A]">
              <ShieldCheck className="size-3" />
              Verified
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3" />
              Issuer: {credential.issuer.id}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              {new Date(credential.issuanceDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Attributes */}
          <div className="mt-4 rounded-xl bg-secondary/50 p-4">
            <p className="mb-2 text-xs font-semibold text-foreground">
              Credential Subject
            </p>
            <div className="flex flex-col gap-1.5">
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
            </div>
          </div>

          {/* Proof info */}
          <div className="mt-3 rounded-xl bg-secondary/30 p-3">
            <div className="flex items-center gap-2 text-xs">
              <FileText className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                Schema: <code className="font-mono">{credential.schema}</code>
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <Lock className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                Proof: <code className="font-mono">{credential.proof.type}</code>
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#32E875]">
            <div className="size-1.5 rounded-full bg-[#32E875]" />
            Cryptographically Verified
          </div>
        </div>
      </div>
    </FadeInScale>
  )
}
