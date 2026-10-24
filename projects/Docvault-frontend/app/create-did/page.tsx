"use client"

import { useState, useMemo } from "react"
import {
  Globe,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  Shield,
  Loader2,
  Wallet,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DIDCard } from "@/components/did/did-card"
import { DIDQRModal } from "@/components/did/did-qr-modal"
import {
  ScrollFadeIn,
  FadeInScale,
  PageTransition,
  TiltCard,
  MagneticHover,
  motion,
} from "@/components/motion"
import { useWalletStore } from "@/store/use-wallet-store"
import algosdk from "algosdk"
import type { DIDMethod } from "@/lib/types"
import Link from "next/link"
import { useWallet } from "@txnlab/use-wallet-react"
import { IdentityRegistryClient } from "@/src/contracts/IdentityRegistry"
import { toast } from "sonner"
import { AlgorandClient } from "@algorandfoundation/algokit-utils"

const methods: { value: DIDMethod; label: string; description: string; requiresWallet: boolean }[] = [
  {
    value: "did:algo",
    label: "did:algo",
    description: "Anchored on Algorand. Fully decentralized, self-sovereign, and chain-native identity.",
    requiresWallet: true,
  },
  {
    value: "did:web",
    label: "did:web",
    description: "Web-based DID method. Uses domain-linked identifiers for easy discovery.",
    requiresWallet: false,
  },
]

export default function CreateDIDPage() {
  const { did, generateDID } = useWalletStore()
  const { activeAccount, transactionSigner } = useWallet()
  const activeAddress = activeAccount?.address
  const [selectedMethod, setSelectedMethod] = useState<DIDMethod | null>(null)
  const [generating, setGenerating] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const algorand = useMemo(() => {
    const client = AlgorandClient.fromConfig({
      algodConfig: {
        server: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
        port: process.env.NEXT_PUBLIC_ALGOD_PORT || '',
        token: process.env.NEXT_PUBLIC_ALGOD_TOKEN || '',
      }
    })
    if (transactionSigner) {
      client.setDefaultSigner(transactionSigner)
    }
    return client
  }, [transactionSigner])

  async function handleGenerate() {
    if (!selectedMethod) return

    if (selectedMethod === "did:algo" && !activeAddress) {
      toast.error("Please connect your Algorand wallet first")
      return
    }

    setGenerating(true)
    try {
      if (selectedMethod === "did:algo") {
        // 1. Real Anchoring on Algorand
        toast.info("Anchoring your DID on-chain...")

        // Use the generated client
        const appId = parseInt(process.env.NEXT_PUBLIC_IDENTITY_APP_ID || "0")
        if (appId === 0) {
          console.warn("NEXT_PUBLIC_IDENTITY_APP_ID not set. Mocking anchoring.")
          await new Promise(r => setTimeout(r, 1000))
        } else {
          const client = new IdentityRegistryClient({
            appId: BigInt(appId),
            algorand: algorand,
            defaultSender: activeAddress!
          })

          // For simple anchoring, we store a mock DID doc URI
          await client.send.anchorDid({
            args: { didDocUri: `ipfs://bafy...${activeAddress}` },
            sender: activeAddress!,
            validityWindow: 1000
          })
        }
      } else {
        await new Promise((r) => setTimeout(r, 1200))
      }

      generateDID(selectedMethod, activeAddress || undefined)
      toast.success("Identity Secured")
    } catch (e: any) {
      console.error(e)
      if (e?.message?.includes('below min') || e?.message?.includes('balance')) {
        const appId = parseInt(process.env.NEXT_PUBLIC_IDENTITY_APP_ID || "0")
        const appAddress = algosdk.getApplicationAddress(appId).toString()
        toast.error(`Smart Contract needs ALGO.`, {
          description: `The App Account (${appAddress.slice(0, 8)}...) needs TestNet funding to allocate your DID box! Visit bank.testnet.algorand.network, paste: ${appAddress}`,
          duration: 15000
        })
      } else {
        toast.error(`Transaction failed: ${e.message}`)
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="relative mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollFadeIn>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#32E875]/10"
              >
                <Fingerprint className="size-7 text-[#32E875]" />
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Secure Your Identity
              </h1>
              <p className="mt-2 text-muted-foreground">
                Deploy your universal passport on-chain. No intermediaries, full ownership.
              </p>
            </div>
          </ScrollFadeIn>

          {!did ? (
            <div className="mt-10 flex flex-col gap-6">
              <ScrollFadeIn delay={0.1}>
                <h2 className="text-sm font-semibold text-foreground">
                  Select Identity Anchor
                </h2>
              </ScrollFadeIn>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {methods.map((method, i) => (
                  <ScrollFadeIn key={method.value} delay={0.15 + i * 0.1}>
                    <TiltCard>
                      <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.value)}
                        className={`w-full rounded-2xl border p-5 text-left transition-all ${selectedMethod === method.value
                          ? "border-[#32E875] bg-[#32E875]/5 shadow-lg shadow-[#32E875]/10 ring-1 ring-[#32E875]/20"
                          : "border-border bg-background hover:border-[#32E875]/30 hover:shadow-md"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-10 items-center justify-center rounded-lg ${selectedMethod === method.value
                              ? "bg-[#32E875]/20"
                              : "bg-secondary"
                              }`}
                          >
                            {method.value === "did:algo" ? <Wallet className="size-5 text-[#32E875]" /> : <Globe className="size-5 text-muted-foreground" />}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`font-mono ${selectedMethod === method.value
                                ? "border-[#32E875]/30 bg-[#32E875]/10 text-[#0F172A]"
                                : ""
                                }`}
                            >
                              {method.label}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {method.description}
                        </p>
                      </motion.button>
                    </TiltCard>
                  </ScrollFadeIn>
                ))}
              </div>

              <ScrollFadeIn delay={0.4}>
                <MagneticHover strength={0.1}>
                  <Button
                    size="lg"
                    disabled={!selectedMethod || generating}
                    onClick={handleGenerate}
                    className="w-full bg-[#32E875] text-[#0F172A] shadow-lg shadow-[#32E875]/20 hover:bg-[#32E875]/90 hover:shadow-xl hover:shadow-[#32E875]/30 sm:w-auto"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Securing on Algorand...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="size-5" />
                        Anchor Identity
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </MagneticHover>
              </ScrollFadeIn>
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-6">
              <FadeInScale>
                <div className="flex items-center gap-3 rounded-2xl border border-[#32E875]/20 bg-[#32E875]/5 p-4">
                  <CheckCircle2 className="size-6 text-[#32E875]" />
                  <div>
                    <p className="font-semibold text-foreground">DID Anchored Successfully</p>
                    <p className="text-sm text-muted-foreground">Your sovereign passport is live on the network.</p>
                  </div>
                </div>
              </FadeInScale>

              <DIDCard did={did} onShowQR={() => setQrOpen(true)} />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-[#1E3A8A] text-white">
                  <Link href="/issue">
                    <Shield className="size-4" />
                    Verified Credentials
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/wallet">Go to Passport</Link>
                </Button>
              </div>

              <DIDQRModal open={qrOpen} onOpenChange={setQrOpen} did={did.id} />
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  )
}
