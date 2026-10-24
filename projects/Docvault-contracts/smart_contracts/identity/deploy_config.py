import logging
import algokit_utils
from algokit_utils import AlgorandClient

logger = logging.getLogger(__name__)

# define deployment behaviour based on supplied app spec
def deploy() -> None:
    from smart_contracts.artifacts.identity.identity_registry_client import (
        IdentityRegistryFactory,
    )

    # Initialize AlgorandClient from environment
    # On TestNet, this will look for ALGOD_SERVER, ALGOD_PORT, ALGOD_TOKEN
    algorand = AlgorandClient.from_environment()
    
    # Try to get deployer from environment (DEPLOYER_MNEMONIC)
    try:
        deployer = algorand.account.from_environment("DEPLOYER")
    except Exception as e:
        logger.error("Could not load DEPLOYER from environment. Ensure DEPLOYER_MNEMONIC is set in .env.testnet")
        return

    logger.info(f"Deploying IdentityRegistry with deployer: {deployer.address}")

    factory = algorand.client.get_typed_app_factory(
        IdentityRegistryFactory, default_sender=deployer.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    logger.info(
        f"Deployed IdentityRegistry ({app_client.app_id}) successfully."
    )
