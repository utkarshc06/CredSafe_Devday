"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Shield,
  Wallet,
  Menu,
  X,
  Fingerprint,
  FileCheck,
  Eye,
  Import,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from "@/components/motion"
import { useWallet } from "@txnlab/use-wallet-react"
import { toast } from "sonner"

const navItems = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/create-did", label: "Create DID", icon: Fingerprint },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/issue", label: "Get Credentials", icon: FileCheck },
  { href: "/disclose", label: "Inbox", icon: Eye },
  { href: "/verify", label: "Verifier", icon: Building2 },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { activeAccount, wallets } = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock state for non-Algorand wallets just for visual demo
  const [nonAlgoWallet, setNonAlgoWallet] = useState<{ name: string, address: string } | null>(null)

  const connectWallet = async (walletId?: string) => {
    const targetWallet = walletId ? wallets?.find(w => w.id === walletId) : wallets?.find(w => w.id === 'pera')
    if (targetWallet) {
      try {
        if (targetWallet.isConnected && targetWallet.accounts.length > 0) {
          targetWallet.setActive()
          return
        }

        if (targetWallet.isConnected) {
          await targetWallet.disconnect()
        }

        const accounts = await targetWallet.connect()
        if (accounts.length === 0) {
          toast.error(`No accounts found. Enable TestNet mode in ${targetWallet.metadata.name}.`)
        } else {
          toast.success(`Connected to ${targetWallet.metadata.name}`)
        }
      } catch (e: any) {
        console.error(e)
        await targetWallet.disconnect().catch(() => { })
        toast.error("Connection failed. Please try again.")
      }
    }
  }

  const connectEVM = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts[0]) {
          setNonAlgoWallet({ name: "MetaMask", address: accounts[0] })
          toast.success("MetaMask Connected!")
          setShowWalletModal(false)
        }
      } else {
        toast.error("MetaMask extension not found.")
      }
    } catch (e) {
      toast.error("Failed to connect MetaMask")
    }
  }

  const connectSolana = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).solana) {
        const response = await (window as any).solana.connect()
        if (response && response.publicKey) {
          setNonAlgoWallet({ name: "Phantom", address: response.publicKey.toString() })
          toast.success("Phantom Connected!")
          setShowWalletModal(false)
        }
      } else {
        toast.error("Phantom extension not found.")
      }
    } catch (e) {
      toast.error("Failed to connect Phantom")
    }
  }

  const disconnectWallet = () => {
    if (activeAccount) {
      wallets?.forEach(w => {
        if (w.isConnected) w.disconnect()
      })
    }
    if (nonAlgoWallet) {
      setNonAlgoWallet(null)
      toast.info("Disconnected")
      return;
    }
    // Deep clear for Pera / use-wallet state caching bugs
    if (typeof window !== "undefined") {
      window.localStorage.removeItem('@txnlab/use-wallet-react')
      for (let key of Object.keys(window.localStorage)) {
        if (key.toLowerCase().includes('pera') || key.toLowerCase().includes('wallet')) {
          window.localStorage.removeItem(key)
        }
      }
      window.location.reload()
    }
  }

  const shortAddress = activeAccount?.address
    ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}`
    : nonAlgoWallet?.address ? `${nonAlgoWallet.address.slice(0, 6)}...${nonAlgoWallet.address.slice(-4)}` : null

  const isConnected = !!activeAccount || !!nonAlgoWallet

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex size-9 items-center justify-center rounded-lg bg-[#32E875] shadow-md shadow-[#32E875]/20"
          >
            <Shield className="size-5 text-[#0F172A]" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            CredSafe
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-[#0F172A]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-[#32E875]/10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Wallet button */}
          {mounted && isConnected ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="hidden gap-2 border-[#32E875]/30 bg-[#32E875]/5 text-foreground sm:flex"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="size-2 rounded-full bg-[#32E875]"
                />
                {shortAddress}
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                onClick={() => setShowWalletModal(true)}
                className="hidden bg-[#1E3A8A] text-white shadow-md shadow-[#1E3A8A]/15 hover:bg-[#1E3A8A]/90 sm:flex"
              >
                <Wallet className="size-4" />
                Connect Wallet
              </Button>
            </motion.div>
          )}

          {/* Mobile menu toggle */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#32E875]/10 text-[#0F172A]"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="mt-2 border-t border-border pt-3">
                {mounted && isConnected ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-[#32E875]/30 bg-[#32E875]/5 text-foreground"
                    onClick={() => {
                      disconnectWallet()
                      setMobileOpen(false)
                    }}
                  >
                    {shortAddress}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[#1E3A8A] text-white"
                    onClick={() => {
                      setShowWalletModal(true)
                      setMobileOpen(false)
                    }}
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border">
          <DialogHeader>
            <DialogTitle className="text-xl px-1">Connect Wallet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4 max-h-[60vh] overflow-y-auto">
            {wallets?.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                className="flex h-auto items-center justify-between px-4 py-4 hover:bg-[#32E875]/10 hover:border-[#32E875]/50 border-border transition-all"
                onClick={() => {
                  setShowWalletModal(false)
                  connectWallet(wallet.id)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-secondary border border-border flex items-center justify-center shadow-sm overflow-hidden p-1">
                    <img src={wallet.metadata.icon} alt={wallet.metadata.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-semibold text-foreground text-sm">{wallet.metadata.name}</span>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Algorand Network</span>
                  </div>
                </div>
                {wallet.id === 'pera' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#32E875]/20 text-[#32E875] px-2.5 py-1 rounded-full shadow-sm">Recommended</span>
                )}
              </Button>
            ))}

            <Button
              variant="outline"
              className="flex h-auto items-center justify-between px-4 py-4 hover:bg-secondary border-border transition-all"
              onClick={connectEVM}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#F6851B] flex items-center justify-center">
                  <span className="font-bold text-white text-xs">Meta</span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-foreground text-sm">MetaMask</span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">EVM Chains</span>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex h-auto items-center justify-between px-4 py-4 hover:bg-secondary border-border transition-all"
              onClick={connectSolana}
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#AB9FF2] flex items-center justify-center">
                  <span className="font-bold text-white text-[10px]">Phantom</span>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-foreground text-sm">Phantom</span>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Solana Network</span>
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  )
}
