import { ethers } from "hardhat";
import { MinTempAgency, WeatherIdAgency } from "../typechain-types";

async function main() {
  console.log("🌦️ Seeding Weather Insurance Policies...\n");

  // Get signers - handle case where only deployer is available
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  if (!deployer) {
    console.error("❌ No deployer account found. Please check your network configuration.");
    process.exit(1);
  }

  // Use deployer for all operations if not enough signers available
  const user1 = signers[1] || deployer;
  const user2 = signers[2] || deployer;
  const user3 = signers[3] || deployer;
  const insurer1 = signers[4] || deployer;
  const insurer2 = signers[5] || deployer;

  console.log("Using accounts:");
  console.log("- Deployer:", deployer.address);
  console.log("- User1:", user1.address);
  console.log("- User2:", user2.address);
  console.log("- User3:", user3.address);
  console.log("- Insurer1:", insurer1.address);
  console.log("- Insurer2:", insurer2.address);

  if (signers.length < 6) {
    console.log(`⚠️  Only ${signers.length} signer(s) available. Using deployer account for missing roles.`);
  }
  console.log();

  // Get deployed contract addresses from deployments
  let minTempAgency: MinTempAgency;
  let weatherIdAgency: WeatherIdAgency;

  try {
    minTempAgency = await ethers.getContract("MinTempAgency");
    weatherIdAgency = await ethers.getContract("WeatherIdAgency");

    console.log("📍 Using deployed contracts:");
    console.log("- MinTempAgency:", await minTempAgency.getAddress());
    console.log("- WeatherIdAgency:", await weatherIdAgency.getAddress());
    console.log();
  } catch {
    console.error("❌ Contracts not found. Please deploy them first with: yarn deploy");
    process.exit(1);
  }

  // Helper function to create timestamps
  const now = Math.floor(Date.now() / 1000);
  const oneDay = 24 * 60 * 60;

  // Sample locations (coordinates * 10^6 as required by contracts)
  const locations = [
    { name: "New York, NY", lat: 40774000, lng: -73962000 },
    { name: "Chicago, IL", lat: 41878100, lng: -87629800 },
    { name: "Miami, FL", lat: 25761700, lng: -80191800 },
    { name: "Seattle, WA", lat: 47606200, lng: -122332100 },
    { name: "Denver, CO", lat: 39739200, lng: -104990200 },
    { name: "Los Angeles, CA", lat: 34052200, lng: -118243700 },
  ];

  console.log("🌡️ Creating Temperature Insurance Policies...\n");

  // Create Temperature Insurance Policies
  const tempPolicies = [
    {
      user: user1,
      location: locations[0], // New York
      startTime: now + oneDay,
      endTime: now + oneDay * 7,
      minTemp: 0, // 0°C threshold
      premium: ethers.parseEther("0.5"),
      coverage: ethers.parseEther("2.0"),
    },
    {
      user: user2,
      location: locations[1], // Chicago
      startTime: now + oneDay * 2,
      endTime: now + oneDay * 10,
      minTemp: -10000000, // -10°C threshold (temperature * 10^6)
      premium: ethers.parseEther("0.8"),
      coverage: ethers.parseEther("4.0"),
    },
    {
      user: user3,
      location: locations[3], // Seattle
      startTime: now + oneDay * 3,
      endTime: now + oneDay * 14,
      minTemp: 2000000, // 2°C threshold
      premium: ethers.parseEther("0.3"),
      coverage: ethers.parseEther("1.8"),
    },
    {
      user: user1,
      location: locations[4], // Denver
      startTime: now - oneDay * 2, // Already started
      endTime: now + oneDay * 5,
      minTemp: -5000000, // -5°C threshold
      premium: ethers.parseEther("0.6"),
      coverage: ethers.parseEther("3.0"),
    },
  ];

  for (let i = 0; i < tempPolicies.length; i++) {
    const policy = tempPolicies[i];
    try {
      console.log(`Creating temperature policy ${i + 1} for ${policy.location.name}...`);

      const tx = await minTempAgency
        .connect(policy.user)
        .createPolicy(
          policy.location.lat,
          policy.location.lng,
          policy.startTime,
          policy.endTime,
          policy.minTemp,
          policy.coverage,
          { value: policy.premium },
        );

      await tx.wait();
      console.log(`✅ Policy ${i} created (Premium: ${ethers.formatEther(policy.premium)} ETH)`);
    } catch (error) {
      console.error(`❌ Failed to create temperature policy ${i + 1}:`, error);
    }
  }

  console.log("\n⛈️ Creating Weather Event Insurance Policies...\n");

  // Create Weather Event Insurance Policies
  const weatherPolicies = [
    {
      user: user2,
      location: locations[2], // Miami
      startTime: now + oneDay,
      endTime: now + oneDay * 7,
      weatherId: 200, // Thunderstorms
      premium: ethers.parseEther("1.2"),
      coverage: ethers.parseEther("6.0"),
    },
    {
      user: user3,
      location: locations[5], // Los Angeles
      startTime: now + oneDay,
      endTime: now + oneDay * 5,
      weatherId: 500, // Rain
      premium: ethers.parseEther("0.4"),
      coverage: ethers.parseEther("2.2"),
    },
    {
      user: user1,
      location: locations[1], // Chicago
      startTime: now + oneDay * 2,
      endTime: now + oneDay * 8,
      weatherId: 600, // Snow
      premium: ethers.parseEther("0.7"),
      coverage: ethers.parseEther("3.5"),
    },
    {
      user: user2,
      location: locations[0], // New York
      startTime: now - oneDay, // Already started
      endTime: now + oneDay * 3,
      weatherId: 701, // Fog/Mist
      premium: ethers.parseEther("0.2"),
      coverage: ethers.parseEther("1.0"),
    },
  ];

  for (let i = 0; i < weatherPolicies.length; i++) {
    const policy = weatherPolicies[i];
    try {
      console.log(`Creating weather event policy ${i + 1} for ${policy.location.name}...`);

      const tx = await weatherIdAgency
        .connect(policy.user)
        .createPolicy(
          policy.location.lat,
          policy.location.lng,
          policy.startTime,
          policy.endTime,
          policy.weatherId,
          policy.coverage,
          { value: policy.premium },
        );

      await tx.wait();
      console.log(`✅ Policy ${i} created (Premium: ${ethers.formatEther(policy.premium)} ETH)`);
    } catch (error) {
      console.error(`❌ Failed to create weather event policy ${i + 1}:`, error);
    }
  }

  console.log("\n🏦 Claiming some policies as insurer...\n");

  // Claim some policies to create variety in policy states
  try {
    // Get total number of policies from each contract
    const tempPolicies = await minTempAgency.getAllPolicies();
    const weatherPolicies = await weatherIdAgency.getAllPolicies();

    // Only try to claim if we have policies and sufficient balance
    if (tempPolicies.length > 0) {
      const policy = tempPolicies[0];
      console.log(`Claiming temperature policy #${policy.id}...`);

      try {
        const tx = await minTempAgency.connect(insurer1).claimPolicy(policy.id, { value: policy.coverage });
        await tx.wait();
        console.log(`✅ Temperature policy #${policy.id} claimed by insurer1`);
      } catch {
        console.log(`⚠️  Could not claim temperature policy #${policy.id} - possibly insufficient funds`);
      }
    }

    // Claim first weather event policy
    if (weatherPolicies.length > 0) {
      const policy = weatherPolicies[0];
      console.log(`Claiming weather event policy #${policy.id}...`);

      try {
        const tx = await weatherIdAgency.connect(insurer2).claimPolicy(policy.id, { value: policy.coverage });
        await tx.wait();
        console.log(`✅ Weather event policy #${policy.id} claimed by insurer2`);
      } catch {
        console.log(`⚠️  Could not claim weather event policy #${policy.id} - possibly insufficient funds`);
      }
    }

    // Claim one more policy if available
    if (tempPolicies.length > 3) {
      const policy = tempPolicies[3]; // The Denver policy that already started
      console.log(`Claiming temperature policy #${policy.id}...`);

      try {
        const tx = await minTempAgency.connect(insurer1).claimPolicy(policy.id, { value: policy.coverage });
        await tx.wait();
        console.log(`✅ Temperature policy #${policy.id} claimed by insurer1`);
      } catch {
        console.log(`⚠️  Could not claim temperature policy #${policy.id} - possibly insufficient funds`);
      }
    }
  } catch (error) {
    console.error("❌ Error claiming policies:", error);
  }

  console.log("\n📊 Seeding Summary:");
  console.log("==================");

  // Get final counts
  const finalTempPolicies = await minTempAgency.getAllPolicies();
  const finalWeatherPolicies = await weatherIdAgency.getAllPolicies();

  console.log(`📋 Temperature Policies: ${finalTempPolicies.length}`);
  console.log(`⛈️ Weather Event Policies: ${finalWeatherPolicies.length}`);
  console.log(`📍 Total Policies Created: ${finalTempPolicies.length + finalWeatherPolicies.length}`);

  // Display policy statuses
  console.log("\n📋 Policy Status Breakdown:");
  let unclaimedCount = 0;
  let openCount = 0;
  let settledCount = 0;

  [...finalTempPolicies, ...finalWeatherPolicies].forEach(policy => {
    switch (Number(policy.status)) {
      case 0:
        unclaimedCount++;
        break; // Unclaimed
      case 1:
        openCount++;
        break; // Open
      case 2:
        settledCount++;
        break; // Settled
    }
  });

  console.log(`- Unclaimed: ${unclaimedCount}`);
  console.log(`- Open (Claimed): ${openCount}`);
  console.log(`- Settled: ${settledCount}`);

  console.log("\n✅ Seeding completed! Your dApp now has real blockchain data.");
  console.log("\n🚀 Next steps:");
  console.log("1. Start the frontend: yarn start");
  console.log("2. Visit http://localhost:3000 to see the seeded data");
  console.log("3. Use the Debug page to interact with the contracts");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
