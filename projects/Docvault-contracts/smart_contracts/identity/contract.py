from algopy import ARC4Contract, String, BoxMap, Txn, Bytes
from algopy.arc4 import abimethod


class IdentityRegistry(ARC4Contract):
    def __init__(self) -> None:
        # BoxMap to store DID document URIs
        # Key: Account Address (Bytes)
        # Value: DID Document URI or Content (String)
        self.did_registry = BoxMap(Bytes, String)

    @abimethod()
    def anchor_did(self, did_doc_uri: String) -> None:
        """
        Anchors a DID document URI to the sender's address.
        This ensures the identity is user-owned and permissionless.
        """
        # Store the URI in a box associated with the sender
        self.did_registry[Txn.sender.bytes] = did_doc_uri

    @abimethod(readonly=True)
    def get_did_uri(self, address: Bytes) -> String:
        """
        Retrieves the anchored URI for a specific address.
        """
        return self.did_registry[address]
