"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Import,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Globe,
  Shield,
  Loader2,
  Wallet,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ScrollFadeIn,
  FadeInScale,
  PageTransition,
  MagneticHover,
  motion,
} from "@/components/motion"

const sampleVC = `{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "AgeVerification"],
  "issuer": {
    "id": "did:web:gov.example:identity",
    "name": "Government ID Office"
  },
  "issuanceDate": "2025-12-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:ethr:0x1234567890abcdef",
    "ageOver18": true,
    "ageOver21": true,
    "country": "US"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2025-12-01T00:00:00Z",
    "verificationMethod": "did:web:gov.example:identity#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFZERTQSJ9..signature"
  }
}`

interface ParseResult {
  valid: boolean
  errors: string[]
  credential: Record<string, unknown> | null
  didMethod: string | null
  schema: string | null
}

function validateVC(json: string): ParseResult {
  try {
    const parsed = JSON.parse(json)
    const errors: string[] = []

    if (!parsed["@context"]) errors.push('Missing "@context" field')
    if (!parsed.type || !Array.isArray(parsed.type))
      errors.push('Missing or invalid "type" field')
    if (!parsed.issuer) errors.push('Missing "issuer" field')
    if (!parsed.credentialSubject) errors.push('Missing "credentialSubject" field')
    if (!parsed.proof) errors.push('Missing "proof" field')

    let didMethod: string | null = null
    const issuerDid =
      typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer?.id
    if (issuerDid?.startsWith("did:web:")) didMethod = "did:web"
    else if (issuerDid?.startsWith("did:ethr:")) didMethod = "did:ethr"
    else if (issuerDid?.startsWith("did:")) didMethod = issuerDid.split(":").slice(0, 2).join(":")

    const schema =
      parsed.type?.find((t: string) => t !== "VerifiableCredential") || null

    return {
      valid: errors.length === 0,
      errors,
      credential: errors.length === 0 ? parsed : null,
      didMethod,
      schema,
    }
  } catch {
    return {
      valid: false,
      errors: ["Invalid JSON format"],
      credential: null,
      didMethod: null,
      schema: null,
    }
  }
}

export default function ImportPage() {
  const [json, setJson] = useState("")
  const [result, setResult] = useState<ParseResult | null>(null)
  const [validating, setValidating] = useState(false)
  const [imported, setImported] = useState(false)

  async function handleValidate() {
    setValidating(true)
    await new Promise((r) => setTimeout(r, 1000))
    const parsed = validateVC(json)
    setResult(parsed)
    setValidating(false)
  }

  function handleLoadSample() {
    setJson(sampleVC)
    setResult(null)
    setImported(false)
  }

  function handleImport() {
    setImported(true)
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollFadeIn>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#1E3A8A]/10"
              >
                <Import className="size-7 text-[#1E3A8A]" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Import Credential
              </h1>
              <p className="mt-2 text-muted-foreground">
                Import a third-party verifiable credential by pasting its JSON representation.
              </p>
            </div>
          </ScrollFadeIn>

          <div className="mt-10 flex flex-col gap-6">
            <ScrollFadeIn delay={0.1}>
              <div className="flex items-center justify-between">
                <label htmlFor="vc-json" className="text-sm font-semibold text-foreground">
                  Paste Verifiable Credential JSON
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <FileJson className="size-3.5" />
                  Load Sample
                </motion.button>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.15}>
              <motion.textarea
                id="vc-json"
                value={json}
                onChange={(e) => {
                  setJson(e.target.value)
                  setResult(null)
                  setImported(false)
                }}
                placeholder={`{\n  "@context": [...],\n  "type": [...],\n  "issuer": {...},\n  "credentialSubject": {...},\n  "proof": {...}\n}`}
                whileFocus={{ borderColor: "#32E875", boxShadow: "0 0 0 2px rgba(50,232,117,0.1)" }}
                className="h-64 w-full resize-none rounded-xl border border-border bg-secondary/30 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-[#32E875] focus:outline-none"
              />
            </ScrollFadeIn>

            <ScrollFadeIn delay={0.2}>
              <MagneticHover strength={0.1}>
                <Button
                  size="lg"
                  disabled={!json.trim() || validating}
                  onClick={handleValidate}
                  className="w-full bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/15 hover:bg-[#1E3A8A]/90 sm:w-auto"
                >
                  {validating ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Shield className="size-5" />
                      Validate Credential
                    </>
                  )}
                </Button>
              </MagneticHover>
            </ScrollFadeIn>

            {/* Validation Results */}
            {result && (
              <FadeInScale>
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className={`rounded-2xl border p-5 ${
                    result.valid
                      ? "border-[#32E875]/20 bg-[#32E875]/5"
                      : "border-destructive/20 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.valid ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle2 className="size-6 text-[#32E875]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <AlertCircle className="size-6 text-destructive" />
                      </motion.div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {result.valid ? "Valid Verifiable Credential" : "Validation Failed"}
                      </p>
                      {!result.valid && (
                        <ul className="mt-1 flex flex-col gap-1">
                          {result.errors.map((err) => (
                            <li key={err} className="text-sm text-destructive">{err}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {result.valid && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4 flex flex-col gap-3"
                    >
                      {result.schema && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Schema:</span>
                          <Badge variant="outline" className="font-mono">{result.schema}</Badge>
                        </div>
                      )}
                      {result.didMethod && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">DID Method:</span>
                          <Badge className="gap-1 border-none bg-[#32E875]/10 text-[#0F172A]">
                            <Globe className="size-3" />
                            {result.didMethod} compatible
                          </Badge>
                        </div>
                      )}
                      {result.credential?.credentialSubject && (
                        <div className="rounded-xl bg-background p-3">
                          <p className="mb-2 text-xs font-semibold text-foreground">
                            Credential Subject
                          </p>
                          {Object.entries(
                            result.credential.credentialSubject as Record<string, unknown>
                          )
                            .filter(([key]) => key !== "id")
                            .map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between text-xs">
                                <span className="capitalize text-muted-foreground">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <span className="font-medium text-foreground">{String(value)}</span>
                              </div>
                            ))}
                        </div>
                      )}
                      {!imported ? (
                        <MagneticHover strength={0.1}>
                          <Button
                            onClick={handleImport}
                            className="mt-2 w-full bg-[#32E875] text-[#0F172A] hover:bg-[#32E875]/90 sm:w-auto"
                          >
                            <Import className="size-4" />
                            Import to Wallet
                          </Button>
                        </MagneticHover>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex flex-col gap-3"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-[#32E875]">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle2 className="size-4" />
                            </motion.div>
                            Credential imported successfully
                          </div>
                          <Button
                            asChild
                            className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 sm:w-auto"
                          >
                            <Link href="/wallet">
                              <Wallet className="size-4" />
                              View in Wallet
                            </Link>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </FadeInScale>
            )}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  )
}
