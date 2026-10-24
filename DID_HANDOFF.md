# 🆔 CredSafe: On-Chain DID Foundation (did:algo)

This document serves as the handoff for the **Identity Layer** of the CredSafe project. We are using the native `did:algo` method anchored on the Algorand blockchain.

## 🏗️ Architecture Overview

The system uses a **Smart Contract Registry** on Algorand to anchor Decentralized Identifiers (DIDs). Each user owns their identity by controlling the Algorand Account associated with the DID.

- **DID Method**: `did:algo:<address>`
- **Anchoring Strategy**: User's Algorand address is mapped to a DID Document URI in highly-scalable **Algorand Boxes**.
- **Compliance**: Fully compliant with **W3C DID Core 1.0** and **DIF** standards.

---

## 🚀 Core Functions (Python)

All core logic is contained in `projects/Docvault-contracts/identity_tools/did_manager.py`.

### 1. Create/Anchor DID
To register an identity on-chain, use the `anchor_did` function. This writes a pointer to the DID document into the blockchain.

```python
manager.anchor_did(sender_address, did_doc_uri="ipfs://CID...")
```

### 2. Resolve DID
To fetch an identity document for any user on the network:

```python
did_document = manager.resolve_did("did:algo:ACCOUNT_ADDRESS")
```

---

## 📡 API Handoff: Mock JSON Response

Frontend and Backend teammates can use this JSON structure for REST API development. This is what a successfully resolved `did:algo` document looks like:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:algo:VD7C4J...EXAMPLE",
  "verificationMethod": [
    {
      "id": "did:algo:VD7C4J...EXAMPLE#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:algo:VD7C4J...EXAMPLE",
      "publicKeyBase58": "6vY...BASE58_KEY"
    }
  ],
  "authentication": ["did:algo:VD7C4J...EXAMPLE#key-1"],
  "assertionMethod": ["did:algo:VD7C4J...EXAMPLE#key-1"],
  "capabilityInvocation": ["did:algo:VD7C4J...EXAMPLE#key-1"],
  "capabilityDelegation": ["did:algo:VD7C4J...EXAMPLE#key-1"],
  "service": [
    {
      "id": "did:algo:VD7C4J...EXAMPLE#passport",
      "type": "UniversalPassport",
      "serviceEndpoint": "https://vault.credsafe.app/data/user_id"
    }
  ]
}
```

---

## 🌍 Universal Passport Data Model

The `UniversalPassport` service type allows the DID to act as a portable vault. Users carry this identity across platforms, and it inherently points to their encrypted storage (Docvault).

---

## 🔄 Interoperability (Walt.id Integration)

To resolve third-party DIDs (like `did:key` or `did:web`), we recommend using the `walt.id` resolver pattern.

**Python Resolution Strategy:**
```python
def resolve_external_did(did: str):
    # Strategy: If not 'algo', delegate to universal resolver (e.g. walt.id API)
    if not did.startswith("did:algo:"):
        response = requests.get(f"https://resolver.walt.id/resolve/{did}")
        return response.json()
    return local_algo_resolver(did)
```

---

## 🛠️ Dev Notes
- **Smart Contract**: Located at `smart_contracts/identity/contract.py`.
- **Boxes**: We use Boxes for $O(1)$ resolution time and massive scalability (ideal for millions of users).
- **TestNet**: Currently configured for Algorand TestNet.
