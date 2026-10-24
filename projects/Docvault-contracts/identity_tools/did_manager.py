import json
import base64
from algosdk import encoding
from algokit_utils.beta.algorand_client import (
    AlgorandClient,
    PayParams,
    AssetCreateParams,
)
from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient

# Mocking the client import for the script to be portable
# In a real environment, you'd import IdentityRegistryClient from artifacts
# from smart_contracts.artifacts.identity.identity_registry_client import IdentityRegistryClient

class DIDAlgoManager:
    """
    Manages DID operations for the did:algo method on Algorand.
    Strictly follows W3C DID Core 1.0 specifications.
    """

    def __init__(self, algorand_client: AlgorandClient, app_id: int = 0):
        self.client = algorand_client
        self.app_id = app_id

    def create_did_document(self, address: str, metadata: dict = None) -> dict:
        """
        Generates a W3C-compliant DID Document for an Algorand address.
        This represents the 'Universal Passport' data model.
        """
        did = f"did:algo:{address}"
        
        # W3C Compliant DID Document Structure
        did_doc = {
            "@context": [
                "https://www.w3.org/ns/did/v1",
                "https://w3id.org/security/suites/ed25519-2020/v1"
            ],
            "id": did,
            "verificationMethod": [{
                "id": f"{did}#key-1",
                "type": "Ed25519VerificationKey2020",
                "controller": did,
                "publicKeyBase58": self._address_to_public_key_b58(address)
            }],
            "authentication": [f"{did}#key-1"],
            "assertionMethod": [f"{did}#key-1"],
            "capabilityInvocation": [f"{did}#key-1"],
            "capabilityDelegation": [f"{did}#key-1"],
            "service": metadata.get("services", []) if metadata else []
        }
        return did_doc

    def _address_to_public_key_b58(self, address: str) -> str:
        # Helper to convert Algorand address to a format often used in DIDs
        # In actual did:algo, the address itself is the identifier.
        return base64.b58encode(encoding.decode_address(address)).decode('utf-8')

    def anchor_did(self, sender_address: str, did_doc_uri: str):
        """
        Anchors the DID Document URI to the Algorand blockchain.
        This ensures permissionless, user-owned identity anchoring.
        """
        print(f"Anchoring DID for {sender_address} with URI: {did_doc_uri}")
        # Implementation would call the Smart Contract's 'anchor_did' method
        # Using AlgoKit client:
        # identity_client = IdentityRegistryClient(self.client.algod, app_id=self.app_id)
        # identity_client.anchor_did(did_doc_uri=did_doc_uri, sender=sender_address)
        return {"status": "success", "tx_id": "MOCK_TX_ID", "did": f"did:algo:{sender_address}"}

    def resolve_did(self, did: str) -> dict:
        """
        Resolves a did:algo identifier into a DID Document.
        """
        if not did.startswith("did:algo:"):
            raise ValueError("Unsupported DID method")
        
        address = did.split(":")[-1]
        print(f"Resolving {did}...")
        
        # 1. Fetch from Smart Contract Box (the anchor)
        # uri = self.identity_client.get_did_uri(address=address)
        
        # 2. Return the Document (Mocking for foundation)
        # In production, this would fetch the content from the URI (IPFS/Arweave)
        return self.create_did_document(address)

class DIDResolver:
    """
    Bonus: Resolves third-party W3C compatible DIDs.
    """
    @staticmethod
    def resolve_external(did: str) -> dict:
        """
        Demonstrates resolution strategy for external DIDs (e.g. did:peer, did:key).
        Uses a strategy pattern or external resolution API (like walt.id's resolver).
        """
        print(f"Resolving external DID: {did}")
        # Mocking an external resolution (e.g. for did:key)
        if did.startswith("did:key:"):
            return {
                "id": did,
                "@context": "https://www.w3.org/ns/did/v1",
                "verificationMethod": [...]
            }
        return {"error": "Resolution strategy not found for this method"}

# Example Usage Block
if __name__ == "__main__":
    # This would be initialized with AlgorandClient for TestNet
    # client = AlgorandClient.testnet()
    # manager = DIDAlgoManager(client)
    
    # Mock Example for Team
    address = "VD7C4J...EXAMPLE"
    manager = DIDAlgoManager(None) # Passing None for mock demo
    did_doc = manager.create_did_document(address)
    print("Resolved DID Document (Mock JSON for Frontend/Backend):")
    print(json.dumps(did_doc, indent=2))
