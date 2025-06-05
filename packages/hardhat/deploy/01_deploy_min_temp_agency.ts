import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys MinTempAgency contract for temperature-based weather insurance
 * This contract allows users to create policies that pay out when minimum temperatures
 * drop below specified thresholds, using Flare's Web2Json for weather data verification.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMinTempAgency: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const chainId = await hre.getChainId();

  console.log("\n🌡️ Deploying MinTempAgency contract...\n");
  console.log(`Network: ${hre.network.name} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${deployer}\n`);

  // Deploy MinTempAgency contract
  const minTempAgency = await deploy("MinTempAgency", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
  });

  console.log(`✅ MinTempAgency deployed at: ${minTempAgency.address}`);
  console.log(`   Transaction hash: ${minTempAgency.transactionHash}`);
  console.log(`   Gas used: ${minTempAgency.receipt?.gasUsed?.toString() || "N/A"}`);

  // Verify contract on block explorer (only for live networks)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: minTempAgency.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error);
      console.log("   You can verify manually later using:");
      console.log(`   npx hardhat verify --network ${hre.network.name} ${minTempAgency.address}`);
    }
  }

  // Display deployment summary
  console.log("\n📋 MinTempAgency Deployment Summary:");
  console.log("=====================================");
  console.log(`Contract Address: ${minTempAgency.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer}`);
  console.log(`Block Explorer: ${getBlockExplorerUrl(chainId, minTempAgency.address)}`);

  console.log("\n📚 Contract Features:");
  console.log("• Temperature-based insurance policies");
  console.log("• Automatic settlement using Flare Web2Json oracles");
  console.log("• Location-specific coverage (lat/lng coordinates)");
  console.log("• Flexible policy duration and thresholds");
  console.log("• Decentralized insurer marketplace");

  console.log("\n🎯 Next Steps:");
  console.log("1. Interact with the contract via the Debug page: http://localhost:3000/debug");
  console.log("2. Create temperature-based insurance policies");
  console.log("3. Claim policies as an insurer");
  console.log("4. Test policy resolution with real weather data\n");
};

/**
 * Get block explorer URL for the deployed contract
 */
function getBlockExplorerUrl(chainId: string, address: string): string {
  const explorers: { [key: string]: string } = {
    "114": `https://coston2.testnet.flarescan.com/address/${address}`, // Flare Coston2 Testnet
    "14": `https://flarescan.com/address/${address}`, // Flare Mainnet
  };

  return explorers[chainId] || `Unknown network (Chain ID: ${chainId})`;
}

export default deployMinTempAgency;

// Tags are useful for selective deployment
// e.g. yarn deploy --tags MinTempAgency
deployMinTempAgency.tags = ["MinTempAgency", "WeatherInsurance", "Insurance"];
