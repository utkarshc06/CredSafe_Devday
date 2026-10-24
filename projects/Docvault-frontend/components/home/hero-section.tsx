"use client"

import Link from "next/link"
import {
  Shield,
  Fingerprint,
  ArrowRight,
  Lock,
  Globe,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ScrollFadeIn,
  FloatingElement,
  CursorParallaxWrapper,
  ParticleField,
  MagneticHover,
  GradientOrb,
  motion,
} from "@/components/motion"

const floatingCards = [
  {
    title: "University Degree",
    issuer: "Stanford University",
    icon: FileCheck,
    verified: true,
  },
  {
    title: "Employment Verified",
    issuer: "TechCorp Industries",
    icon: Shield,
    verified: true,
  },
  {
    title: "Age Proof: 18+",
    issuer: "Selective Disclosure",
    icon: Lock,
    verified: true,
  },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#0F172A]">
      {/* Animated gradient orbs for depth */}
      <GradientOrb className="-left-32 -top-32 size-96" color1="#32E875" color2="#1E3A8A" />
      <GradientOrb className="-bottom-40 -right-40 size-[500px]" color1="#1E3A8A" color2="#32E875" />

      {/* Canvas particle overlay */}
      <ParticleField className="z-[1] opacity-60" />

      {/* Gradient overlays for depth */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-[#0F172A]/40 via-transparent to-[#0F172A]/80" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#0F172A]/60 via-transparent to-[#0F172A]/60" />

      {/* Animated grid */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(50,232,117,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(50,232,117,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Content */}
      <div className="relative z-10 flex min-h-[90vh] items-center">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Text content */}
            <div className="flex flex-col">
              <ScrollFadeIn direction="right" delay={0.2}>
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#32E875]/20 bg-[#32E875]/10 px-4 py-2 text-sm font-medium text-[#32E875]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Globe className="size-4" />
                  </motion.div>
                  W3C Verifiable Credentials
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn direction="right" delay={0.4}>
                <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  Your{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-[#32E875]">Identity</span>
                    <motion.span
                      className="absolute bottom-1 left-0 h-3 w-full rounded-sm bg-[#32E875]/20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                      style={{ originX: 0 }}
                    />
                  </span>
                  ,{" "}
                  <br className="hidden sm:block" />
                  Your{" "}
                  <span className="text-[#32E875]">Control</span>
                </h1>
              </ScrollFadeIn>

              <ScrollFadeIn direction="left" delay={0.6}>
                <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-slate-300">
                  A self-sovereign identity wallet where you own your DID,
                  credentials are stored locally, and only the attributes you choose
                  are ever shared. No centralized intermediaries.
                </p>
              </ScrollFadeIn>

              <ScrollFadeIn direction="up" delay={0.8}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <MagneticHover strength={0.15}>
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#32E875] text-[#0F172A] shadow-lg shadow-[#32E875]/20 transition-shadow hover:bg-[#32E875]/90 hover:shadow-xl hover:shadow-[#32E875]/30"
                    >
                      <Link href="/create-did">
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Fingerprint className="size-5" />
                        </motion.span>
                        Create Your DID
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </MagneticHover>
                  <MagneticHover strength={0.15}>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-slate-600 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                    >
                      <Link href="/wallet">
                        <Shield className="size-5" />
                        Open Wallet
                      </Link>
                    </Button>
                  </MagneticHover>
                </div>
              </ScrollFadeIn>

              {/* Trust signals */}
              <ScrollFadeIn delay={1}>
                <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  {[
                    { icon: Lock, text: "Stored locally" },
                    { icon: FileCheck, text: "Issuer verified" },
                    { icon: Shield, text: "Selective disclosure" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                    >
                      <item.icon className="size-4 text-[#32E875]" />
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </ScrollFadeIn>
            </div>

            {/* Right: Floating credential cards */}
            <div className="relative hidden h-[500px] lg:block">
              <CursorParallaxWrapper intensity={15} className="relative h-full">
                {floatingCards.map((card, i) => {
                  const positions = [
                    { x: "10%", y: "5%", rotate: -6 },
                    { x: "40%", y: "35%", rotate: 3 },
                    { x: "5%", y: "65%", rotate: 2 },
                  ]
                  const pos = positions[i]
                  const Icon = card.icon

                  return (
                    <FloatingElement
                      key={card.title}
                      duration={5 + i * 1.5}
                      distance={10 + i * 5}
                      delay={i * 0.5}
                      className="absolute"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.8 + i * 0.2,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 25px 50px rgba(50,232,117,0.15)",
                        }}
                        style={{
                          left: pos.x,
                          top: pos.y,
                          rotate: pos.rotate,
                        }}
                        className="w-72 cursor-default rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-[#32E875]/15">
                            <Icon className="size-5 text-[#32E875]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {card.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {card.issuer}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#32E875]">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                            className="size-1.5 rounded-full bg-[#32E875]"
                          />
                          Cryptographically Verified
                        </div>
                        {/* Shimmer effect */}
                        <motion.div
                          className="pointer-events-none absolute inset-0 rounded-2xl"
                          animate={{
                            background: [
                              "linear-gradient(105deg, transparent 40%, rgba(50,232,117,0.03) 45%, transparent 50%)",
                              "linear-gradient(105deg, transparent 50%, rgba(50,232,117,0.06) 55%, transparent 60%)",
                              "linear-gradient(105deg, transparent 60%, rgba(50,232,117,0.03) 65%, transparent 70%)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            delay: i * 1,
                          }}
                        />
                      </motion.div>
                    </FloatingElement>
                  )
                })}
              </CursorParallaxWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-32 w-full bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
