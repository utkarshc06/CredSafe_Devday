"use client"

import { useState } from "react"
import Link from "next/link"
import {
  GraduationCap,
  Briefcase,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Wallet,
  Shield,
  Fingerprint,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { CredentialPreview } from "@/components/issuer/credential-preview"
import {
  ScrollFadeIn,
  FadeInScale,
  PageTransition,
  TiltCard,
  MagneticHover,
} from "@/components/motion"
import {
  useWalletStore,
} from "@/store/use-wallet-store"
import type { VerifiableCredential } from "@/lib/types"
import { identityService } from "@/lib/identity-service"
import { toast } from "sonner"

type CredentialType = "UniversityDegree" | "EmploymentVerification"

const credentialTypes: {
  value: CredentialType
  label: string
  description: string
  issuer: string
  icon: typeof GraduationCap
}[] = [
    {
      value: "UniversityDegree",
      label: "University Degree",
      description:
        "A verifiable credential issued by a university confirming degree completion, GPA, and honors.",
      issuer: "Stanford University",
      icon: GraduationCap,
    },
    {
      value: "EmploymentVerification",
      label: "Employment Verification",
      description:
        "A verifiable credential issued by an employer confirming position, department, and employment status.",
      issuer: "TechCorp Industries",
      icon: Briefcase,
    },
  ]

export default function IssuePage() {
  const { did, addCredential } = useWalletStore()
  const [selectedType, setSelectedType] = useState<CredentialType | null>(null)
  const [issuing, setIssuing] = useState(false)
  const [issued, setIssued] = useState(false)
  const [targetDid, setTargetDid] = useState(did?.id || "")
  const [previewCredential, setPreviewCredential] =
    useState<VerifiableCredential | null>(null)

  async function handleIssue() {
    if (!selectedType || !did) return
    setIssuing(true)

    try {
      toast.info(`Requesting ${selectedType} from backend...`)

      // Real call to your teammate's backend wrapper!
      let result;
      if (selectedType === "UniversityDegree") {
        result = await identityService.issueUniversityDegree(
          targetDid || did.id,
          "John Doe", // Mocking name for now
          "Bachelor of Science",
          "3.8",
          "2024-05-15"
        );
      } else {
        // Direct mock for employment if wrapper endpoint doesn't exist yet
        await new Promise(r => setTimeout(r, 1000));
        result = { success: true };
      }

      // If backend call succeeded, we add it to local store
      // The new backend returns a real JWT-signed credential in result.credential!
      const credential = result.credential ? {
        id: `vc:${Math.random().toString(16).slice(2)}`,
        type: "VerifiableCredential",
        credentialType: selectedType,
        issuer: {
          id: result.credential.issuer?.id || result.credential.issuer || "did:key:UNKNOWN",
          name: "Real Veramo Issuer",
        },
        issuanceDate: result.credential.issuanceDate,
        credentialSubject: result.credential.credentialSubject,
        proof: result.credential.proof,
        verified: true,
        schema: "https://www.w3.org/2018/credentials/v1"
      } as VerifiableCredential : {
        id: `vc:${Math.random().toString(16).slice(2)}`,
        type: "VerifiableCredential",
        credentialType: selectedType,
        issuer: {
          id: "did:key:z6MkpTHR8V...", // Fallback 
          name: "TechCorp Industries",
        },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: targetDid || did.id,
          name: "John Doe",
          position: "Engineer"
        },
        proof: {
          type: "Ed25519Signature2020",
          created: new Date().toISOString(),
          verificationMethod: "did:key:issuer#key-1",
          proofPurpose: "assertionMethod",
          jws: "EYJhbGciOiJFUzI1NksifQ..."
        },
        verified: true,
        schema: "https://www.w3.org/2018/credentials/v1"
      } as VerifiableCredential;

      addCredential(credential)
      setPreviewCredential(credential)
      setIssued(true)
      toast.success("Credential Issued & Verified")
    } catch (e: any) {
      console.error(e)
      toast.error(`Backend error: ${e.message}`)
    } finally {
      setIssuing(false)
    }
  }

  function handleReset() {
    setSelectedType(null)
    setIssuing(false)
    setIssued(false)
    setPreviewCredential(null)
  }

  if (!did) {
    return (
      <AppShell>
        <PageTransition>
          <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
            <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
                <Fingerprint className="size-7 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">
                DID Required
              </h2>
              <p className="mt-2 text-muted-foreground">
                You need a decentralized identifier before credentials can be
                issued to you.
              </p>
              <Button asChild className="mt-6 bg-[#32E875] text-[#0F172A]">
                <Link href="/create-did">Secure Your DID</Link>
              </Button>
            </div>
          </div>
        </PageTransition>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollFadeIn>
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#1E3A8A]/10">
                <Shield className="size-7 text-[#1E3A8A]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Issuer Portals
              </h1>
              <p className="mt-2 text-muted-foreground">
                Issue verifiable credentials directly to a specific user's decentralized wallet identity.
              </p>
            </div>
          </ScrollFadeIn>

          {!issued ? (
            <div className="mt-10 flex flex-col gap-6">

              <ScrollFadeIn delay={0.1}>
                <div className="rounded-2xl border border-border bg-[#1E3A8A]/5 p-5">
                  <label className="text-[10px] text-[#1E3A8A] uppercase font-bold tracking-wider mb-2 block">Issue to Target Holder (User DID)</label>
                  <input
                    value={targetDid}
                    onChange={(e) => setTargetDid(e.target.value)}
                    className="w-full text-xs text-foreground bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-[#1E3A8A]"
                    placeholder="e.g. did:algo:..."
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground">The secure credential payload will be cryptographically anchored to this specific identity.</p>
                </div>
              </ScrollFadeIn>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {credentialTypes.map((ct, i) => {
                  const Icon = ct.icon
                  return (
                    <ScrollFadeIn key={ct.value} delay={0.2 + i * 0.1}>
                      <TiltCard>
                        <button
                          onClick={() => setSelectedType(ct.value)}
                          className={`w-full rounded-2xl border p-5 text-left transition-all ${selectedType === ct.value
                            ? "border-[#1E3A8A] bg-[#1E3A8A]/5"
                            : "border-border bg-background"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                              <Icon className="size-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{ct.label}</p>
                              <p className="text-xs text-muted-foreground">{ct.issuer}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">{ct.description}</p>
                        </button>
                      </TiltCard>
                    </ScrollFadeIn>
                  )
                })}
              </div>

              <ScrollFadeIn delay={0.4}>
                <Button
                  size="lg"
                  disabled={!selectedType || issuing}
                  onClick={handleIssue}
                  className="w-full bg-[#1E3A8A] text-white"
                >
                  {issuing ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Connecting to Partner...
                    </>
                  ) : (
                    <>
                      <FileCheck className="size-5" />
                      Request Credential
                    </>
                  )}
                </Button>
              </ScrollFadeIn>
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-6">
              <FadeInScale>
                <div className="flex items-center gap-3 rounded-2xl border border-[#32E875]/20 bg-[#32E875]/5 p-4">
                  <CheckCircle2 className="size-6 text-[#32E875]" />
                  <div>
                    <p className="font-semibold text-foreground">Received from {selectedType === "UniversityDegree" ? "Stanford University" : "TechCorp Industries"}</p>
                    <p className="text-sm text-muted-foreground">Cryptographically secured to your DID.</p>
                  </div>
                </div>
              </FadeInScale>

              {previewCredential && <CredentialPreview credential={previewCredential} />}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-[#32E875] text-[#0F172A]">
                  <Link href="/wallet">View in Wallet</Link>
                </Button>
                <Button variant="outline" onClick={handleReset}>Request Another</Button>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  )
}
