import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys WeatherIdAgency contract for weather event-based insurance
 * This contract allows users to create policies that pay out based on specific weather conditions
 * (storms, heavy rain, snow, etc.), using Flare's Web2Json for weather data verification.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployWeatherIdAgency: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const chainId = await hre.getChainId();

  console.log("\n⛈️ Deploying WeatherIdAgency contract...\n");
  console.log(`Network: ${hre.network.name} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${deployer}\n`);

  // Deploy WeatherIdAgency contract
  const weatherIdAgency = await deploy("WeatherIdAgency", {
    from: deployer,
    args: [], // No constructor arguments needed
    log: true,
  });

  console.log(`✅ WeatherIdAgency deployed at: ${weatherIdAgency.address}`);
  console.log(`   Transaction hash: ${weatherIdAgency.transactionHash}`);
  console.log(`   Gas used: ${weatherIdAgency.receipt?.gasUsed?.toString() || "N/A"}`);

  // Verify contract on block explorer (only for live networks)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      await hre.run("verify:verify", {
        address: weatherIdAgency.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error);
      console.log("   You can verify manually later using:");
      console.log(`   npx hardhat verify --network ${hre.network.name} ${weatherIdAgency.address}`);
    }
  }

  // Display deployment summary
  console.log("\n📋 WeatherIdAgency Deployment Summary:");
  console.log("======================================");
  console.log(`Contract Address: ${weatherIdAgency.address}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer}`);
  console.log(`Block Explorer: ${getBlockExplorerUrl(chainId, weatherIdAgency.address)}`);

  console.log("\n📚 Contract Features:");
  console.log("• Weather event-based insurance policies");
  console.log("• Support for various weather conditions (storms, rain, snow, etc.)");
  console.log("• Weather ID threshold-based payouts");
  console.log("• Automatic settlement using Flare Web2Json oracles");
  console.log("• Location-specific coverage (lat/lng coordinates)");
  console.log("• Flexible policy duration and conditions");
  console.log("• Decentralized insurer marketplace");

  console.log("\n🌦️ Supported Weather Conditions:");
  console.log("• 200-299: Thunderstorms (severe weather)");
  console.log("• 300-399: Drizzle");
  console.log("• 500-599: Rain (light to heavy)");
  console.log("• 600-699: Snow");
  console.log("• 700-799: Atmosphere (fog, dust, etc.)");
  console.log("• 800: Clear sky");
  console.log("• 801-804: Clouds (few to overcast)");

  console.log("\n🎯 Next Steps:");
  console.log("1. Interact with the contract via the Debug page: http://localhost:3000/debug");
  console.log("2. Create weather event-based insurance policies");
  console.log("3. Claim policies as an insurer");
  console.log("4. Test policy resolution with real weather data");
  console.log("5. Experiment with different weather ID thresholds\n");
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

export default deployWeatherIdAgency;

// Tags are useful for selective deployment
// e.g. yarn deploy --tags WeatherIdAgency
deployWeatherIdAgency.tags = ["WeatherIdAgency", "WeatherInsurance", "Insurance"];
