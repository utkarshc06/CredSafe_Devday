"use client"

import Link from "next/link"
import { Fingerprint, FileCheck, Eye, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ScrollFadeIn,
  SectionReveal,
  ParallaxLayer,
  TiltCard,
  motion,
} from "@/components/motion"

const steps = [
  {
    number: "01",
    title: "Create Your DID",
    description:
      "Generate a decentralized identifier using did:web or did:ethr. Your DID is cryptographically linked to your keys and fully self-sovereign.",
    icon: Fingerprint,
    link: "/create-did",
    linkText: "Create DID",
    accent: "#32E875",
  },
  {
    number: "02",
    title: "Collect & Store Credentials",
    description:
      "Receive verifiable credentials from trusted issuers like universities and employers. Credentials are signed, timestamped, and stored locally.",
    icon: FileCheck,
    link: "/issue",
    linkText: "Issue Credentials",
    accent: "#1E3A8A",
  },
  {
    number: "03",
    title: "Selective Disclosure",
    description:
      "When a verifier requests proof, choose exactly which attributes to share. Prove you're over 18 without revealing your birth date.",
    icon: Eye,
    link: "/disclose",
    linkText: "Try Disclosure",
    accent: "#32E875",
  },
  {
    number: "04",
    title: "Verify & Present",
    description:
      "Generate SD-JWT or ZK proofs that verifiers can check without accessing your full credentials. Privacy-preserving verification at scale.",
    icon: ShieldCheck,
    link: "/wallet",
    linkText: "Open Wallet",
    accent: "#1E3A8A",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary/30 px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="pt-8">
          <ScrollFadeIn>
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Four steps to full self-sovereign identity. No intermediaries, no centralized databases.
              </p>
            </div>
          </ScrollFadeIn>
        </SectionReveal>

        <div className="relative mt-16">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-[#32E875]/50 via-[#1E3A8A]/30 to-transparent lg:left-1/2 lg:block" />

          <div className="flex flex-col gap-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 0

              return (
                <ScrollFadeIn
                  key={step.number}
                  direction={isEven ? "left" : "right"}
                  delay={0.1}
                >
                  <div className={`relative flex flex-col items-start gap-8 lg:flex-row lg:items-center ${isEven ? "" : "lg:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                      <ParallaxLayer speed={0.15}>
                        <TiltCard>
                          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                            <div className={`flex items-center gap-4 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${step.accent}15` }}
                              >
                                <Icon className="size-6" style={{ color: step.accent }} />
                              </motion.div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground">
                                  {step.title}
                                </h3>
                              </div>
                            </div>
                            <p className={`mt-3 text-sm leading-relaxed text-muted-foreground ${isEven ? "lg:text-right" : ""}`}>
                              {step.description}
                            </p>
                            <div className={`mt-4 ${isEven ? "lg:text-right" : ""}`}>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-sm font-medium"
                                style={{ color: step.accent }}
                              >
                                <Link href={step.link}>
                                  {step.linkText}
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </TiltCard>
                      </ParallaxLayer>
                    </div>

                    {/* Center number node */}
                    <div className="relative z-10 hidden lg:flex">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2,
                        }}
                        className="flex size-16 items-center justify-center rounded-full border-2 bg-background font-mono text-lg font-bold shadow-lg"
                        style={{ borderColor: step.accent, color: step.accent }}
                      >
                        {step.number}
                      </motion.div>
                    </div>

                    {/* Empty spacer for layout */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                </ScrollFadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
