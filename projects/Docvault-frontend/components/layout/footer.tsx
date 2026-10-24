"use client"

import Link from "next/link"
import { Shield, Lock, Globe, FileCheck, ArrowRight } from "lucide-react"
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  ParticleField,
  motion,
} from "@/components/motion"

const features = [
  { icon: Lock, label: "No centralized storage" },
  { icon: Shield, label: "Fully user-controlled DID" },
  { icon: FileCheck, label: "Selective attribute disclosure" },
  { icon: Globe, label: "W3C Verifiable Credentials compatible" },
]

const links = [
  { label: "Create DID", href: "/create-did" },
  { label: "Wallet", href: "/wallet" },
  { label: "Issue Credentials", href: "/issue" },
  { label: "Selective Disclosure", href: "/disclose" },
  { label: "Import Credential", href: "/import" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-[#0F172A] text-white">
      <ParticleField className="opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <ScrollFadeIn direction="right">
            <div className="flex flex-col gap-4">
              <Link href="/" className="group flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 12 }}
                  className="flex size-8 items-center justify-center rounded-lg bg-[#32E875]"
                >
                  <Shield className="size-4 text-[#0F172A]" />
                </motion.div>
                <span className="text-lg font-bold">CredSafe</span>
              </Link>
              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                A self-sovereign identity wallet. Your keys, your identity, your control. Built on open W3C standards.
              </p>
            </div>
          </ScrollFadeIn>

          {/* Links */}
          <ScrollFadeIn delay={0.1}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </h3>
              <nav className="mt-4 flex flex-col gap-2">
                {links.map((link) => (
                  <motion.div key={link.href} whileHover={{ x: 4 }}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-[#32E875]"
                    >
                      <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </ScrollFadeIn>

          {/* Trust features */}
          <ScrollFadeIn delay={0.2}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Trust & Security
              </h3>
              <StaggerContainer className="mt-4 flex flex-col gap-2" staggerDelay={0.08}>
                {features.map((f) => {
                  const Icon = f.icon
                  return (
                    <StaggerItem key={f.label}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <Icon className="size-4 shrink-0 text-[#32E875]" />
                        {f.label}
                      </motion.div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </div>
          </ScrollFadeIn>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-8 h-px origin-left bg-gradient-to-r from-[#32E875]/30 via-slate-800 to-transparent"
        />

        <ScrollFadeIn delay={0.3}>
          <div className="text-center text-xs text-slate-500">
            Built for the decentralized future. Powered by DID standards and Algorand.
          </div>
        </ScrollFadeIn>
      </div>
    </footer>
  )
}
