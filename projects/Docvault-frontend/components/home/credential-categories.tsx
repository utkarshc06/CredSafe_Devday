"use client"

import Link from "next/link"
import { ArrowRight, UserCheck, Globe, Shield, Award } from "lucide-react"
import {
  ScrollFadeIn,
  StaggerContainer,
  StaggerItem,
  TiltCard,
  SectionReveal,
  motion,
} from "@/components/motion"

const categories = [
  {
    title: "KYC / KYB",
    description:
      "Know Your Customer and Know Your Business credentials for financial use cases, fraud mitigation, and compliance.",
    icon: UserCheck,
    color: "#32E875",
  },
  {
    title: "Humanity & Uniqueness",
    description:
      "Proof of humanity, personhood, liveness and uniqueness for bot prevention, unique voting, and biometric verification.",
    icon: Shield,
    color: "#1E3A8A",
  },
  {
    title: "Web3 Credentials",
    description:
      "dApp onboarding, DAO voting, gaming age verifications, and other Web3 identity use cases.",
    icon: Globe,
    color: "#32E875",
  },
  {
    title: "Reputation & Achievements",
    description:
      "Social and gaming platform achievements, attendance attestations, and professional reputation credentials.",
    icon: Award,
    color: "#1E3A8A",
  },
]

export function CredentialCategories() {
  return (
    <section className="relative overflow-hidden px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="pt-8">
          <ScrollFadeIn>
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Search Verifiable Credentials
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Explore credential categories submitted by trusted issuers for various business and personal use cases.
              </p>
            </div>
          </ScrollFadeIn>
        </SectionReveal>

        {/* Search bar mockup */}
        <ScrollFadeIn delay={0.2}>
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
              <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-muted-foreground">Search credentials by title, attributes, description, issuer...</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto rounded-lg bg-[#32E875] px-4 py-1.5 text-sm font-medium text-[#0F172A]"
              >
                Search
              </motion.div>
            </div>
          </div>
        </ScrollFadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2" staggerDelay={0.15}>
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <StaggerItem key={cat.title}>
                <TiltCard>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ rotate: 12 }}
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${cat.color}12` }}
                      >
                        <Icon className="size-5" style={{ color: cat.color }} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {cat.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {cat.description}
                        </p>
                        <Link
                          href="/wallet"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                          style={{ color: cat.color }}
                        >
                          View Category
                          <motion.span
                            className="inline-block"
                            whileHover={{ x: 4 }}
                          >
                            <ArrowRight className="size-3.5" />
                          </motion.span>
                        </Link>
                      </div>
                    </div>

                    {/* Hover accent */}
                    <div
                      className="pointer-events-none absolute -bottom-6 -right-6 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `${cat.color}10` }}
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
