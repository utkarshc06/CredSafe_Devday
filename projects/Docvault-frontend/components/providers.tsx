"use client"

import { WalletProvider, WalletManager, WalletId } from "@txnlab/use-wallet-react"
import React, { useMemo } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
    const walletManager = useMemo(() => new WalletManager({
        wallets: [
            { id: WalletId.PERA },
            { id: WalletId.DEFLY },
            { id: WalletId.LUTE },
            { id: WalletId.EXODUS }
        ],
        defaultNetwork: (process.env.NEXT_PUBLIC_ALGOD_NETWORK as any) || 'testnet',
        networks: {
            [(process.env.NEXT_PUBLIC_ALGOD_NETWORK as any) || 'testnet']: {
                algod: {
                    baseServer: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
                    port: process.env.NEXT_PUBLIC_ALGOD_PORT || '',
                    token: process.env.NEXT_PUBLIC_ALGOD_TOKEN || '',
                },
            },
        },
    }), [])

    return (
        <WalletProvider manager={walletManager}>
            {children}
        </WalletProvider>
    )
}
