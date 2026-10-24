"use client"

import {
  Lock,
  Shield,
  Eye,
  Globe,
  CheckCircle2,
  FileCheck,
  Fingerprint,
  Database,
  KeyRound,
  ScanFace,
  Smartphone,
  Zap,
} from "lucide-react"
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  motion,
  ParticleField,
} from "@/components/motion"

const banners = [
  { icon: Lock, text: "No centralized storage." },
  { icon: Shield, text: "Fully user-controlled DID." },
  { icon: Eye, text: "Selective attribute disclosure." },
  { icon: Globe, text: "W3C Verifiable Credentials." },
]

const featuresList = [
  "Receive, store and present credentials",
  "Privacy-preserving features",
  "Dynamic Credentials",
  "Backup identity and Claims",
  "Selective Disclosure",
  "Client side zk proof",
  "Key rotation mechanisms",
  "On-chain verification",
  "Multi-credential queries",
  "Push Notifications",
  "Credential Display Method",
  "Private Proof of Uniqueness",
]

export function TrustBanner() {
  return (
    <>
      {/* Features list section */}
      <section className="border-t border-border px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            <ScrollFadeIn direction="right">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A complete identity toolkit built on open standards.
              </p>
            </ScrollFadeIn>

            <StaggerContainer className="grid grid-cols-1 gap-3 sm:grid-cols-2" staggerDelay={0.06}>
              {featuresList.map((feature) => (
                <StaggerItem key={feature}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-[#32E875]" />
                    </motion.div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* W3C Standards Banner */}
      <section className="relative overflow-hidden bg-[#32E875] px-4 py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

        <ScrollFadeIn>
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-balance text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl"
            >
              All Solutions Follow the W3C
              <br />
              Standards & are Open Source
            </motion.h2>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Dark trust bar */}
      <section className="relative overflow-hidden bg-[#0F172A] px-4 py-12 lg:px-8">
        <ParticleField className="opacity-30" />
        <div className="relative mx-auto max-w-7xl">
          <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
            {banners.map((b) => {
              const Icon = b.icon
              return (
                <StaggerItem key={b.text}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm"
                  >
                    <Icon className="size-5 shrink-0 text-[#32E875]" />
                    <span className="text-sm font-medium text-white">
                      {b.text}
                    </span>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}
