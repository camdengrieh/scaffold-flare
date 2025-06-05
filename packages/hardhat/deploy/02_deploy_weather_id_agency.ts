import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "WeatherIdAgency" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployWeatherIdAgency: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    must have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get network details
  const chainId = await hre.getChainId();

  console.log("\n📋 Weather Insurance - WeatherIdAgency Deployment");
  console.log("=".repeat(55));
  console.log(`Network: ${hre.network.name} (Chain ID: ${chainId})`);
  console.log(`Deployer: ${deployer}\n`);

  // Get the deployed USDC token contract
  const usdcToken = await hre.ethers.getContract<Contract>("USDCToken", deployer);
  const usdcTokenAddress = await usdcToken.getAddress();

  console.log("Deploying WeatherIdAgency with USDC token at:", usdcTokenAddress);

  // Deploy WeatherIdAgency contract
  const weatherIdAgency = await deploy("WeatherIdAgency", {
    from: deployer,
    args: [usdcTokenAddress],
    log: true,
    autoMine: true,
  });

  console.log(`✅ WeatherIdAgency deployed at: ${weatherIdAgency.address}`);
  console.log(`   Transaction hash: ${weatherIdAgency.transactionHash}`);
  console.log(`   Gas used: ${weatherIdAgency.receipt?.gasUsed?.toString() || "N/A"}`);
  console.log(`   Block number: ${weatherIdAgency.receipt?.blockNumber || "N/A"}`);

  // Verify contract on block explorer (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contract on block explorer...");
    try {
      // Wait a bit for the contract to be indexed
      console.log("   Waiting for contract to be indexed...");
      await new Promise(resolve => setTimeout(resolve, 5000));

      await hre.run("verify:verify", {
        address: weatherIdAgency.address,
        constructorArguments: [usdcTokenAddress],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error);
      console.log("   You can verify manually later using:");
      console.log(
        `   npx hardhat verify --network ${hre.network.name} ${weatherIdAgency.address} --constructor-args ${usdcTokenAddress}`,
      );
    }
  }

  console.log("\n🎯 What's Next?");
  console.log("━".repeat(25));
  console.log("1. Visit http://localhost:3000/debug to interact with your contract");
  console.log("2. Create weather event policies (storms, rain, etc.)");
  console.log("3. Claim policies as an insurer");
  console.log("4. Test policy resolution with real weather data");
  console.log("5. Run the seeding script: yarn seed");
  console.log("\n💡 Weather Event IDs:");
  console.log("   200-299: Thunderstorms");
  console.log("   300-399: Drizzle");
  console.log("   500-599: Rain");
  console.log("   600-699: Snow");
  console.log("   700-799: Atmospheric conditions");
  console.log("   800: Clear sky");
  console.log("   801-804: Clouds\n");
};

export default deployWeatherIdAgency;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags WeatherIdAgency
deployWeatherIdAgency.tags = ["WeatherIdAgency", "WeatherInsurance", "Insurance"];
deployWeatherIdAgency.dependencies = ["USDCToken"];
