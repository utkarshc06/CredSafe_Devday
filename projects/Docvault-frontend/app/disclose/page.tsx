"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Eye,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Briefcase,
  Fingerprint,
  FileCheck,
  Inbox,
  Send,
  Building2,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AttributeSelector } from "@/components/disclosure/attribute-selector"
import { DisclosureSummary } from "@/components/disclosure/disclosure-summary"
import {
  ScrollFadeIn,
  FadeInScale,
  PageTransition,
  TiltCard,
  MagneticHover,
  motion,
} from "@/components/motion"
import { useWalletStore } from "@/store/use-wallet-store"
import type { VerifiableCredential, VerificationRequest } from "@/lib/types"

function generateRandomHex(length: number): string {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function generateFakeZKP() {
  const genBN254 = () => "21" + Math.floor(Math.random() * 1e14).toString() + Math.floor(Math.random() * 1e14).toString() + Math.floor(Math.random() * 1e13).toString();
  return {
    pi_a: [genBN254(), genBN254(), "1"] as [string, string, string],
    pi_b: [
      [genBN254(), genBN254()],
      [genBN254(), genBN254()],
      ["1", "0"]
    ] as [[string, string], [string, string], [string, string]],
    pi_c: [genBN254(), genBN254(), "1"] as [string, string, string],
    publicSignals: [genBN254(), genBN254()]
  }
}

const typeIcons = {
  UniversityDegree: GraduationCap,
  EmploymentVerification: Briefcase,
}

export default function DisclosePage() {
  const {
    did,
    credentials,
    selectedCredential,
    selectCredential,
    selectedAttributes,
    toggleAttribute,
    setLastProof,
    verificationRequests,
    removeVerificationRequest,
    setSelectedAttributes,
  } = useWalletStore()

  const [step, setStep] = useState<"requests" | "select" | "attributes" | "success">("requests")
  const [sharing, setSharing] = useState(false)
  const [activeRequest, setActiveRequest] = useState<VerificationRequest | null>(null)

  async function handleShare() {
    if (!selectedCredential || selectedAttributes.length === 0 || !activeRequest) return
    setSharing(true)

    await new Promise((r) => setTimeout(r, 2000))

    const proof = {
      id: `proof:${generateRandomHex(16)}`,
      credentialId: selectedCredential.id,
      sharedAttributes: Object.fromEntries(
        Object.entries(selectedCredential.credentialSubject).filter(([key]) =>
          selectedAttributes.includes(key)
        )
      ),
      verifierDid: activeRequest.verifierDid,
      timestamp: new Date().toISOString(),
      proofType: "ZK-SNARK" as const,
      zkp: generateFakeZKP(),
    }

    setLastProof(proof)
    setSharing(false)
    removeVerificationRequest(activeRequest.id)
    setStep("success")
  }

  function handleSelectRequest(req: VerificationRequest) {
    setActiveRequest(req)
    // Preset the requested attributes
    setSelectedAttributes(req.requestedAttributes)
    setStep("select")
  }

  function handleSelectCredential(cred: VerifiableCredential) {
    selectCredential(cred)
    setStep("attributes")
  }

  if (!did) {
    return (
      <AppShell>
        <PageTransition>
          <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary"
              >
                <Fingerprint className="size-7 text-muted-foreground" />
              </motion.div>
              <h2 className="mt-4 text-xl font-bold text-foreground">DID Required</h2>
              <p className="mt-2 text-muted-foreground">
                Create a DID and issue credentials before interacting with your inbox.
              </p>
              <Button asChild className="mt-6 bg-[#32E875] text-[#0F172A] hover:bg-[#32E875]/90">
                <Link href="/create-did">Create Your DID</Link>
              </Button>
            </motion.div>
          </div>
        </PageTransition>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollFadeIn>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#32E875]/10"
              >
                <Inbox className="size-7 text-[#32E875]" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Pending Requests
              </h1>
              <p className="mt-2 text-muted-foreground">
                Review and approve data requests from external applications and services.
              </p>
            </div>
          </ScrollFadeIn>

          {step === "requests" && (
            <div className="mt-12">
              {verificationRequests.length === 0 ? (
                <ScrollFadeIn delay={0.2}>
                  <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
                      <Inbox className="size-7 text-muted-foreground" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-foreground">Inbox is Empty</h2>
                    <p className="mt-2 text-muted-foreground">
                      No external services have requested your data yet.
                    </p>
                    <Button asChild className="mt-6 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90">
                      <Link href="/verify">Simulate Request</Link>
                    </Button>
                  </div>
                </ScrollFadeIn>
              ) : (
                <div className="flex flex-col gap-4">
                  {verificationRequests.map((req, i) => (
                    <ScrollFadeIn key={req.id} delay={0.2 + i * 0.1}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="rounded-2xl border border-[#1E3A8A]/20 bg-[#1E3A8A]/5 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex size-10 items-center justify-center rounded-xl bg-[#1E3A8A]/10 shrink-0">
                            <Shield className="size-5 text-[#1E3A8A]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{req.verifierName}</h3>
                              <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] text-[10px] border-[#1E3A8A]/20 uppercase">Pending</Badge>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">
                              Requests proof of: <span className="font-medium text-foreground">{req.requestedAttributes.join(", ")}</span>
                            </p>
                            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                              Verifier ID: {req.verifierDid}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectRequest(req)}
                          className="w-full sm:w-auto bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                        >
                          Review Request <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </motion.div>
                    </ScrollFadeIn>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "select" && activeRequest && (
            <div className="mt-8">
              <ScrollFadeIn delay={0.1}>
                <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Fulfilling Request from {activeRequest.verifierName}
                    </h2>
                    <p className="text-xs text-muted-foreground">Select a Credential to disclose data from</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("requests")}
                    className="text-xs text-muted-foreground"
                  >
                    Back to Inbox
                  </Button>
                </div>
              </ScrollFadeIn>

              {credentials.length === 0 ? (
                <ScrollFadeIn delay={0.2}>
                  <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-8 text-center">
                    <h2 className="text-lg font-bold text-foreground">No Credentials</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any credentials to fulfill this request.
                    </p>
                    <Button asChild className="mt-4 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90">
                      <Link href="/issue">Get Credentials</Link>
                    </Button>
                  </div>
                </ScrollFadeIn>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {credentials.map((cred, i) => {
                    const Icon = typeIcons[cred.credentialType as keyof typeof typeIcons] || FileCheck
                    // Visually dim if it doesn't match the requested type, but still allow selection for demo
                    const matchesType = cred.credentialType === activeRequest.credentialType
                    return (
                      <ScrollFadeIn key={cred.id} delay={0.25 + i * 0.1}>
                        <TiltCard>
                          <motion.button
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectCredential(cred)}
                            className={`relative w-full rounded-2xl border p-5 text-left transition-all hover:border-[#32E875]/30 hover:shadow-lg ${matchesType ? 'border-border bg-background' : 'border-border/50 bg-secondary/10 opacity-70'}`}
                          >
                            {!matchesType && (
                              <Badge variant="secondary" className="absolute top-2 right-2 text-[8px] uppercase">Mismatch Type</Badge>
                            )}
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="flex size-10 items-center justify-center rounded-lg bg-[#32E875]/10"
                              >
                                <Icon className="size-5 text-[#32E875]" />
                              </motion.div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {cred.credentialType === "UniversityDegree"
                                    ? "University Degree"
                                    : "Employment Verification"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {cred.issuer.name}
                                </p>
                              </div>
                              <Badge className="ml-auto gap-1 border-none bg-[#32E875]/10 text-[#0F172A] hidden sm:flex">
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            </div>
                          </motion.button>
                        </TiltCard>
                      </ScrollFadeIn>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {step === "attributes" && selectedCredential && activeRequest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
            >
              <div>
                <ScrollFadeIn delay={0.1}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">
                      Confirm Attributes to Share
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectCredential(null)
                        setStep("select")
                      }}
                      className="text-xs text-muted-foreground"
                    >
                      Change Credential
                    </Button>
                  </div>
                </ScrollFadeIn>

                <AttributeSelector
                  attributes={Object.entries(selectedCredential.credentialSubject).filter(
                    ([key]) => key !== "id"
                  )}
                  selectedAttributes={selectedAttributes}
                  onToggle={toggleAttribute}
                />

                <ScrollFadeIn delay={0.2}>
                  <div className="mt-4 flex flex-col gap-2 rounded-lg bg-[#32E875]/5 px-3 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Lock className="size-3.5 shrink-0 text-[#32E875]" />
                      <span className="font-medium text-foreground text-sm">Selective Disclosure Enabled</span>
                    </div>
                    <p>Only selected attributes will be cryptographically revealed to <strong>{activeRequest.verifierName}</strong>. Everything else remains hidden.</p>
                  </div>
                </ScrollFadeIn>

                <ScrollFadeIn delay={0.25}>
                  <MagneticHover strength={0.1}>
                    <Button
                      size="lg"
                      disabled={selectedAttributes.length === 0 || sharing}
                      onClick={handleShare}
                      className="mt-4 w-full bg-[#32E875] text-[#0F172A] shadow-lg shadow-[#32E875]/20 hover:bg-[#32E875]/90"
                    >
                      {sharing ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          Generating Zero-Trust Proof...
                        </>
                      ) : (
                        <>
                          <Shield className="size-5" />
                          Share Authorized Data
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </MagneticHover>
                </ScrollFadeIn>
              </div>

              <div>
                <DisclosureSummary
                  credentialSubject={selectedCredential.credentialSubject as Record<string, unknown>}
                  selectedAttributes={selectedAttributes}
                />
              </div>
            </motion.div>
          )}

          {step === "success" && activeRequest && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <FadeInScale>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="flex size-20 items-center justify-center rounded-full bg-[#32E875]/10"
                >
                  <CheckCircle2 className="size-10 text-[#32E875]" />
                </motion.div>
              </FadeInScale>

              <ScrollFadeIn delay={0.3}>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground">
                    Data Disclosed Securely
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Your selected attributes have been sent to <strong>{activeRequest.verifierName}</strong>.
                  </p>
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn delay={0.4}>
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="w-full max-w-md rounded-2xl border border-border bg-background p-5"
                >
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proof Protocol</span>
                      <Badge variant="outline" className="font-mono bg-[#32E875]/10 text-[#32E875] border-[#32E875]/20">zk-SNARK / Groth16</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Verifier</span>
                      <span className="font-mono text-xs text-foreground">
                        {activeRequest.verifierDid.slice(0, 30)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Timestamp</span>
                      <span className="text-xs text-foreground">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Attributes Shared</span>
                      <span className="font-medium text-[#32E875]">
                        {selectedAttributes.length} selected
                      </span>
                    </div>
                  </div>
                </motion.div>
              </ScrollFadeIn>

              <ScrollFadeIn delay={0.5}>
                <div className="flex flex-col gap-3 sm:flex-row mt-4">
                  <Button asChild className="bg-[#32E875] text-[#0F172A] hover:bg-[#32E875]/90">
                    <Link href="/verify">
                      <Building2 className="mr-2 size-4" />
                      View Verifier Portal
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      selectCredential(null)
                      setActiveRequest(null)
                      setStep("requests")
                    }}
                  >
                    Back to Inbox
                  </Button>
                </div>
              </ScrollFadeIn>
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  )
}
