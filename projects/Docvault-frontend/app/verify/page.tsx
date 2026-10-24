"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ShieldCheck,
    Building2,
    AlertCircle,
    FileCheck,
    Search,
    CheckCircle2,
    Lock,
    Send,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ScrollFadeIn,
    FadeInScale,
    PageTransition,
    TiltCard,
    motion,
} from "@/components/motion"
import { useWalletStore } from "@/store/use-wallet-store"
import { toast } from "sonner"
import type { VerificationRequest } from "@/lib/types"

export default function VerifierPage() {
    const { lastProof, credentials, addVerificationRequest, did } = useWalletStore()
    const [verifying, setVerifying] = useState(false)
    const [verifiedResult, setVerifiedResult] = useState<boolean | null>(null)
    const [customOrg, setCustomOrg] = useState("")
    const [customAttrs, setCustomAttrs] = useState("")
    const [targetDid, setTargetDid] = useState(did?.id || "")

    function handleDispatchRequest(name: string, did: string, attrs: string[], proofReq: string, type: string) {
        const req: VerificationRequest = {
            id: `req:${Math.random().toString(36).slice(2)}`,
            verifierDid: did,
            verifierName: name,
            requestedAttributes: attrs,
            credentialType: type,
            timestamp: new Date().toISOString(),
            status: "pending"
        }
        addVerificationRequest(req)
        toast.success(`Request dispatched to User's Inbox!`)
    }

    // Find the original credential to extract the Issuer DID and Cryptographic Signature
    const sourceCredential = lastProof
        ? credentials.find(c => c.id === lastProof.credentialId)
        : null;

    async function handleVerifySubmit() {
        setVerifying(true)
        // Simulate complex cryptographic verification 
        await new Promise((r) => setTimeout(r, 1500))
        setVerifiedResult(true)
        setVerifying(false)
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
                                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#1E3A8A]/10"
                            >
                                <Building2 className="size-7 text-[#1E3A8A]" />
                            </motion.div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Verifier Portal
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Simulate an external institution (e.g. CityBank) receiving and verifying data.
                            </p>
                        </div>
                    </ScrollFadeIn>

                    <ScrollFadeIn delay={0.1}>
                        <div className="mt-8 rounded-2xl border border-border bg-[#1E3A8A]/5 p-5">
                            <label className="text-[10px] text-[#1E3A8A] uppercase font-bold tracking-wider mb-2 block">Request From Target Holder (User DID)</label>
                            <input
                                value={targetDid}
                                onChange={(e) => setTargetDid(e.target.value)}
                                className="w-full text-xs text-foreground bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-[#1E3A8A]"
                                placeholder="e.g. did:algo:..."
                            />
                            <p className="mt-2 text-[10px] text-muted-foreground">The data request will be explicitly routed to this distinct user's wallet.</p>
                        </div>
                    </ScrollFadeIn>

                    <ScrollFadeIn delay={0.2}>
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <TiltCard>
                                <div className="rounded-2xl border border-border bg-background p-6 h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">CityBank Age Verification</h3>
                                        <p className="text-xs text-muted-foreground mt-1 mb-4">Requests: Age / DOB</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 border-[#1E3A8A]/20 bg-[#1E3A8A]/5 text-[#1E3A8A]"
                                        onClick={() => handleDispatchRequest("CityBank Age Verification", "did:web:citybank.com:verifier", ["name", "dateOfBirth", "ageOver18"], "Prove you are above 18 years old", "UniversityDegree")}
                                    >
                                        <Send className="size-3" /> Dispatch Request
                                    </Button>
                                </div>
                            </TiltCard>
                            <TiltCard>
                                <div className="rounded-2xl border border-border bg-background p-6 h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground">TechCorp Job Application</h3>
                                        <p className="text-xs text-muted-foreground mt-1 mb-4">Requests: Degree, GPA, Graduation</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 border-[#1E3A8A]/20 bg-[#1E3A8A]/5 text-[#1E3A8A]"
                                        onClick={() => handleDispatchRequest("TechCorp Background Check", "did:web:techcorp.app:hr", ["name", "degree", "gpa", "graduationDate"], "Verify your Computer Science Degree", "UniversityDegree")}
                                    >
                                        <Send className="size-3" /> Dispatch Request
                                    </Button>
                                </div>
                            </TiltCard>
                            <TiltCard>
                                <div className="rounded-2xl border border-[#32E875]/30 bg-background p-6 h-full flex flex-col justify-between shadow-[0_0_15px_rgba(50,232,117,0.1)]">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-foreground flex items-center gap-2"><Lock className="size-4 text-[#32E875]" /> Custom Request</h3>
                                        <div className="mt-4 space-y-3">
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Verifier Name</label>
                                                <input
                                                    className="w-full text-xs text-foreground bg-secondary/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:border-[#32E875]"
                                                    placeholder="e.g. Gov Portal"
                                                    value={customOrg}
                                                    onChange={e => setCustomOrg(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Required Data (Comma Separated)</label>
                                                <input
                                                    className="w-full text-xs text-foreground bg-secondary/50 border border-border rounded-md px-3 py-2 focus:outline-none focus:border-[#32E875]"
                                                    placeholder="e.g. name, dateOfBirth"
                                                    value={customAttrs}
                                                    onChange={e => setCustomAttrs(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2 mt-4 border-[#32E875]/20 bg-[#32E875]/10 text-[#32E875] hover:bg-[#32E875]/20 dark:text-white"
                                        onClick={() => {
                                            const attrs = customAttrs.split(',').map(a => a.trim()).filter(Boolean);
                                            handleDispatchRequest(customOrg || "Custom Verification Service", "did:web:custom:verifier", attrs.length > 0 ? attrs : ["name"], "Custom Request", "UniversityDegree");
                                            setCustomOrg("");
                                            setCustomAttrs("");
                                        }}
                                    >
                                        <Send className="size-3" /> Send Custom Request
                                    </Button>
                                </div>
                            </TiltCard>
                        </div>
                    </ScrollFadeIn>

                    {!lastProof ? (
                        <ScrollFadeIn delay={0.2}>
                            <div className="mt-12 rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
                                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary">
                                    <Search className="size-7 text-muted-foreground" />
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-foreground">No Proof Received</h2>
                                <p className="mt-2 text-muted-foreground">
                                    The Verifier inbox is currently empty. Go to your Inbox to disclose attributes as a Holder first.
                                </p>
                                <Button asChild className="mt-6 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90">
                                    <Link href="/disclose">Go to Inbox</Link>
                                </Button>
                            </div>
                        </ScrollFadeIn>
                    ) : (
                        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <ScrollFadeIn delay={0.2}>
                                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-foreground">Incoming Proof Data</h2>
                                            <p className="text-sm text-muted-foreground">Received from a User Wallet</p>
                                        </div>
                                        <Badge variant="outline" className="font-mono bg-secondary font-bold">
                                            {lastProof.proofType}
                                        </Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Revealed Attributes
                                            </h3>
                                            <div className="rounded-xl border border-border bg-secondary/50 p-4">
                                                {Object.entries(lastProof.sharedAttributes).map(([key, value]) => (
                                                    <div key={key} className="mb-3 flex justify-between last:mb-0">
                                                        <span className="text-sm text-muted-foreground capitalize">
                                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                                        </span>
                                                        <span className="font-medium text-foreground text-sm max-w-[60%] text-right truncate">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground px-1">
                                                <Lock className="size-3.5 text-yellow-500" />
                                                Remaining credential attributes are mathematically hidden (SD-JWT).
                                            </div>
                                        </div>
                                    </div>
                                    {lastProof.zkp && (
                                        <div className="mt-6 pt-4 border-t border-border">
                                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                                <span>Zero-Knowledge Proof Details</span>
                                                <Badge variant="outline" className="text-[9px] bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20">zk-SNARK Output</Badge>
                                            </h3>
                                            <div className="rounded-xl border border-border bg-[#1E3A8A]/5 p-4 space-y-3 font-mono text-[9px] text-[#1E3A8A]/80 overflow-y-auto max-h-40">
                                                <div><strong className="text-[#1E3A8A]">Proof (pi_a):</strong> [{lastProof.zkp.pi_a.map(v => v.substring(0, 15) + '...').join(', ')}]</div>
                                                <div><strong className="text-[#1E3A8A]">Proof (pi_b):</strong> [[...], [...], [...]]</div>
                                                <div><strong className="text-[#1E3A8A]">Proof (pi_c):</strong> [{lastProof.zkp.pi_c.map(v => v.substring(0, 15) + '...').join(', ')}]</div>
                                                <div><strong className="text-[#1E3A8A]">Public Signals (Hashes):</strong></div>
                                                <div className="pl-2 break-all">{lastProof.zkp.publicSignals.join(', ')}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollFadeIn>

                            <ScrollFadeIn delay={0.3}>
                                <div className="rounded-2xl border border-[#32E875]/20 bg-[#32E875]/5 p-6 h-full flex flex-col">
                                    <div className="mb-6 flex items-center gap-3">
                                        <ShieldCheck className="size-6 text-[#32E875]" />
                                        <h2 className="text-lg font-bold text-foreground">Zero-Trust Verification</h2>
                                    </div>

                                    <div className="space-y-5 flex-1">
                                        <div className="space-y-1">
                                            <span className="text-xs font-medium text-muted-foreground">Original Issuer DID</span>
                                            <div className="rounded-lg border border-border bg-background p-3 font-mono text-[10px] text-foreground break-all">
                                                {sourceCredential?.issuer?.id || "N/A"}
                                            </div>
                                        </div>

                                        <div className="space-y-1 mt-4">
                                            <span className="text-xs font-medium text-muted-foreground">Provided Cryptographic Trust Chain (JWS Payload)</span>
                                            <div className="rounded-lg border border-border bg-background p-3 font-mono text-[10px] text-foreground break-all max-h-32 overflow-y-auto">
                                                {(sourceCredential?.proof as any)?.jwt || (sourceCredential?.proof as any)?.jws || "Mock JWS Payload: EYJhb..."}
                                            </div>
                                        </div>

                                        {verifiedResult && (
                                            <FadeInScale>
                                                <div className="mt-6 rounded-xl border border-[#32E875] bg-[#32E875]/10 p-4 flex items-center gap-3">
                                                    <CheckCircle2 className="size-6 text-[#32E875] shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-sm text-[#0F172A] dark:text-[#32E875]">Cryptographic Signature Valid</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">The Issuer DID signed this selective payload. Data is authentic and un-tampered.</p>
                                                    </div>
                                                </div>
                                            </FadeInScale>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-border/50">
                                        <Button
                                            className="w-full bg-[#32E875] text-[#0F172A] hover:bg-[#32E875]/90 font-bold"
                                            onClick={handleVerifySubmit}
                                            disabled={verifying || verifiedResult === true}
                                        >
                                            {verifying ? "Executing Verification Protocol..." : verifiedResult ? "Verification Complete" : "Verify Integrity Cryptographically"}
                                        </Button>
                                    </div>
                                </div>
                            </ScrollFadeIn>
                        </div>
                    )}
                </div>
            </PageTransition>
        </AppShell>
    )
}
