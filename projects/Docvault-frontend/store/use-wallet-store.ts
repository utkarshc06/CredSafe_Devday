import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  DIDDocument,
  DIDMethod,
  VerifiableCredential,
  VerificationRequest,
  DisclosureProof,
} from "@/lib/types"

interface WalletState {
  // DID
  did: DIDDocument | null
  // Credentials
  credentials: VerifiableCredential[]
  selectedCredential: VerifiableCredential | null
  // Selective disclosure
  selectedAttributes: string[]
  // Verification
  verificationRequests: VerificationRequest[]
  lastProof: DisclosureProof | null
  // Loading
  isLoading: boolean

  // Actions
  setDID: (did: DIDDocument) => void
  /**
   * Generates a DID. 
   * If method is 'did:algo', it uses the provided address.
   */
  generateDID: (method: DIDMethod, address?: string) => void
  addCredential: (credential: VerifiableCredential) => void
  selectCredential: (credential: VerifiableCredential | null) => void
  toggleAttribute: (attr: string) => void
  setSelectedAttributes: (attrs: string[]) => void
  addVerificationRequest: (request: VerificationRequest) => void
  removeVerificationRequest: (id: string) => void
  setLastProof: (proof: DisclosureProof) => void
  setLoading: (loading: boolean) => void
}

function generateRandomHex(length: number): string {
  if (typeof window === 'undefined') return "";
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function generateRandomJWS(): string {
  if (typeof window === 'undefined') return "";
  const header = btoa(JSON.stringify({ alg: "ES256K", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({ iat: Math.floor(Date.now() / 1000), nonce: generateRandomHex(16) })
  )
  const sig = generateRandomHex(64)
  return `${header}.${payload}.${sig}`
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      did: null,
      credentials: [],
      selectedCredential: null,
      selectedAttributes: [],
      verificationRequests: [],
      lastProof: null,
      isLoading: false,

      setDID: (did) => set({ did }),

      generateDID: (method, address) => {
        let id = "";
        if (method === "did:algo" && address) {
          id = `did:algo:${address}`;
        } else if (method === "did:web") {
          id = `did:web:credsafe.app:${generateRandomHex(8)}`;
        } else {
          id = `did:ethr:0x${generateRandomHex(40)}`;
        }

        const didDocument: DIDDocument = {
          id,
          method,
          created: new Date().toISOString(),
          controller: id,
        };
        set({ did: didDocument });
      },

      addCredential: (credential) =>
        set((state) => ({ credentials: [...state.credentials, credential] })),

      selectCredential: (credential) => set({ selectedCredential: credential, selectedAttributes: [] }),

      toggleAttribute: (attr) =>
        set((state) => {
          const exists = state.selectedAttributes.includes(attr)
          return {
            selectedAttributes: exists
              ? state.selectedAttributes.filter((a) => a !== attr)
              : [...state.selectedAttributes, attr],
          }
        }),

      setSelectedAttributes: (attrs) => set({ selectedAttributes: attrs }),

      addVerificationRequest: (request) =>
        set((state) => ({
          verificationRequests: [...state.verificationRequests, request],
        })),

      removeVerificationRequest: (id) =>
        set((state) => ({
          verificationRequests: state.verificationRequests.filter(req => req.id !== id),
        })),

      setLastProof: (proof) => set({ lastProof: proof }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "wallet-storage",
    }
  )
)

// Sample credentials factory
export function createUniversityDegreeVC(holderDid: string): VerifiableCredential {
  return {
    id: `vc:${generateRandomHex(16)}`,
    type: "VerifiableCredential",
    credentialType: "UniversityDegree",
    issuer: {
      id: "did:web:university.edu:issuer",
      name: "Stanford University",
    },
    issuanceDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 4).toISOString(),
    credentialSubject: {
      id: holderDid,
      name: "John Doe",
      dateOfBirth: "1998-05-15",
      ageOver18: true,
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2024-06-15",
      gpa: "3.85",
      honors: "Magna Cum Laude",
    },
    proof: {
      type: "Ed25519Signature2020",
      created: new Date().toISOString(),
      verificationMethod: "did:web:university.edu:issuer#key-1",
      proofPurpose: "assertionMethod",
      jws: generateRandomJWS(),
    },
    verified: true,
    schema: "https://w3c.github.io/vc-data-model/#university-degree",
  }
}
