"use client"

import { AppShell } from "@/components/layout/app-shell"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { CredentialCategories } from "@/components/home/credential-categories"
import { TrustBanner } from "@/components/home/trust-banner"
import { GlowCursor, PageTransition } from "@/components/motion"

export default function HomePage() {
  return (
    <AppShell>
      <GlowCursor />
      <PageTransition>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CredentialCategories />
        <TrustBanner />
      </PageTransition>
    </AppShell>
  )
}
