"use client"

import {
  Fingerprint,
  ShieldCheck,
  Eye,
  Database,
  Globe,
  Lock,
} from "lucide-react"
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  TiltCard,
  SectionReveal,
  motion,
} from "@/components/motion"

const features = [
  {
    icon: Fingerprint,
    title: "DID Creation",
    description:
      "Generate a decentralized identifier using did:web or did:ethr methods. Your DID is controlled only by you.",
    accent: "#32E875",
  },
  {
    icon: ShieldCheck,
    title: "Credential Issuance",
    description:
      "Receive verifiable credentials from trusted issuers. Each credential is cryptographically signed and verified.",
    accent: "#1E3A8A",
  },
  {
    icon: Eye,
    title: "Selective Disclosure",
    description:
      "Share only the attributes you choose. Prove you're over 18 without revealing your full date of birth.",
    accent: "#32E875",
  },
  {
    icon: Database,
    title: "Local Storage",
    description:
      "All credentials are stored locally on your device. No centralized server ever holds your identity data.",
    accent: "#1E3A8A",
  },
  {
    icon: Globe,
    title: "Interoperable DIDs",
    description:
      "Import and verify credentials across DID methods. Compatible with W3C Verifiable Credentials standard.",
    accent: "#32E875",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Proofs",
    description:
      "Generate ZK proofs and SD-JWTs for privacy-preserving verification. No full credential is ever shared.",
    accent: "#1E3A8A",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 lg:px-8">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(50,232,117,0.04)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(30,58,138,0.04)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        <SectionReveal className="pt-8">
          <div className="text-center">
            <ScrollFadeIn>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Self-Sovereign Identity, Simplified
              </h2>
            </ScrollFadeIn>
            <ScrollFadeIn delay={0.1}>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Everything you need to own, manage, and selectively share your
                digital identity without relying on centralized intermediaries.
              </p>
            </ScrollFadeIn>
          </div>
        </SectionReveal>

        <StaggerContainer className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.12}>
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={feature.title}>
                <TiltCard>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    {/* Hover glow */}
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(circle, ${feature.accent}15 0%, transparent 70%)` }}
                    />

                    <div className="relative">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="flex size-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${feature.accent}15` }}
                      >
                        <Icon className="size-6" style={{ color: feature.accent }} />
                      </motion.div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>

                    {/* Bottom accent line on hover */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full"
                      style={{ background: feature.accent }}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
