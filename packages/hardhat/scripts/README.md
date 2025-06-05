# 🌦️ Weather Insurance Scripts

This directory contains utility scripts for the Weather Insurance dApp.

## 📋 Available Scripts

### `seed-policies.ts`
Seeds the deployed smart contracts with sample weather insurance policies for development and testing.

**What it does:**
- Creates sample temperature and weather event insurance policies
- Uses realistic coordinates for major US cities
- Claims some policies to create variety in policy states
- Provides comprehensive logging of the seeding process

**Usage:**
```bash
# From the root directory:
yarn seed

# Or from the hardhat package:
cd packages/hardhat
yarn seed
```

**Prerequisites:**
1. Make sure contracts are deployed: `yarn deploy`
2. Ensure you have sufficient ETH in your account for creating policies
3. Connected to the correct network (Flare Coston2 testnet by default)

**Sample Data Created:**
- 4 Temperature insurance policies (NYC, Chicago, Seattle, Denver)
- 4 Weather event insurance policies (Miami, LA, Chicago, NYC)
- Some policies will be claimed by insurers to show different states
- Policies will have different start/end times to simulate real scenarios

**Output:**
The script provides detailed logs showing:
- Accounts being used
- Contract addresses
- Individual policy creation status
- Final summary with policy counts and statuses

**Note:** This script is for development purposes only. Do not run on mainnet with real funds!

## 🚀 Quick Start

1. Deploy contracts: `yarn deploy`
2. Seed with sample data: `yarn seed`
3. Start frontend: `yarn start`
4. Visit `http://localhost:3000` to see your dApp with real blockchain data! 