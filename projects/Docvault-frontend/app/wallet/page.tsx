"use client"

import Link from "next/link"
import {
  Wallet,
  Plus,
  FileCheck,
  Eye,
  Shield,
  Lock,
  Fingerprint,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { CredentialCard } from "@/components/wallet/credential-card"
import { DIDCard } from "@/components/did/did-card"
import { DIDQRModal } from "@/components/did/did-qr-modal"
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  PageTransition,
  MagneticHover,
  motion,
} from "@/components/motion"
import { useWalletStore } from "@/store/use-wallet-store"
import { useState } from "react"

export default function WalletPage() {
  const { did, credentials } = useWalletStore()
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollFadeIn>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
                  <motion.div
                    initial={{ rotate: -20, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Wallet className="size-8 text-[#32E875]" />
                  </motion.div>
                  Identity Wallet
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Your credentials, stored locally and fully under your control.
                </p>
              </div>
              <MagneticHover strength={0.1}>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#32E875] text-[#0F172A] shadow-md shadow-[#32E875]/15 hover:bg-[#32E875]/90 hover:shadow-lg hover:shadow-[#32E875]/25"
                >
                  <Link href="/issue">
                    <Plus className="size-4" />
                    Issue Credential
                  </Link>
                </Button>
              </MagneticHover>
            </div>
          </ScrollFadeIn>

          {/* DID Section */}
          {did && (
            <div className="mt-8">
              <ScrollFadeIn delay={0.1}>
                <DIDCard did={did} onShowQR={() => setQrOpen(true)} />
              </ScrollFadeIn>
              <DIDQRModal
                open={qrOpen}
                onOpenChange={setQrOpen}
                did={did.id}
              />
            </div>
          )}

          {!did && (
            <ScrollFadeIn delay={0.1}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-8 rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary"
                >
                  <Fingerprint className="size-7 text-muted-foreground" />
                </motion.div>
                <h3 className="mt-4 font-semibold text-foreground">
                  No DID Created Yet
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a decentralized identifier to start receiving
                  credentials.
                </p>
                <MagneticHover strength={0.1}>
                  <Button
                    asChild
                    className="mt-4 bg-[#32E875] text-[#0F172A] hover:bg-[#32E875]/90"
                  >
                    <Link href="/create-did">Create Your DID</Link>
                  </Button>
                </MagneticHover>
              </motion.div>
            </ScrollFadeIn>
          )}

          {/* Credentials Section */}
          <div className="mt-10">
            <ScrollFadeIn delay={0.2}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Verifiable Credentials ({credentials.length})
                </h2>
                {credentials.length > 0 && (
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link href="/disclose">
                      <Eye className="size-3.5" />
                      Selective Disclosure
                    </Link>
                  </Button>
                )}
              </div>
            </ScrollFadeIn>

            {credentials.length === 0 ? (
              <ScrollFadeIn delay={0.3}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="mt-6 rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary"
                  >
                    <FileCheck className="size-7 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mt-4 font-semibold text-foreground">
                    No Credentials Yet
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Issue your first verifiable credential to see it here.
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                  >
                    <Link href="/issue">Issue Credential</Link>
                  </Button>
                </motion.div>
              </ScrollFadeIn>
            ) : (
              <StaggerContainer className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2" staggerDelay={0.15}>
                {credentials.map((cred) => (
                  <StaggerItem key={cred.id}>
                    <CredentialCard credential={cred} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          {/* Trust indicators */}
          <ScrollFadeIn delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { icon: Lock, text: "All data stored locally" },
                { icon: Shield, text: "No centralized storage" },
                { icon: Eye, text: "Selective disclosure enabled" },
              ].map((item, i) => (
                <motion.span
                  key={item.text}
                  className="flex items-center gap-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="size-3.5 text-[#32E875]" />
                  {item.text}
                </motion.span>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </PageTransition>
    </AppShell>
  )
}
