# Weather Insurance dApp Deployment

This directory contains deployment scripts for the Weather Insurance dApp contracts built on Flare Network using Scaffold-ETH 2.

## 🏗️ Deployment Structure

The deployment follows the hardhat-deploy pattern with numbered deployment files:

- **`01_deploy_min_temp_agency.ts`** - Deploys MinTempAgency contract for temperature-based insurance
- **`02_deploy_weather_id_agency.ts`** - Deploys WeatherIdAgency contract for weather event-based insurance
- **`00_deploy_uniswap_v2.ts`** - Deploys Uniswap V2 infrastructure (for DEX functionality)

## 🚀 Quick Deployment

### Deploy All Contracts

```bash
# Deploy to Flare Coston2 testnet (default)
yarn deploy

# Deploy to Flare mainnet
yarn deploy --network flare-mainnet

# Deploy to local hardhat network
yarn deploy --network hardhat
```

### Selective Deployment

You can deploy specific contracts using tags:

```bash
# Deploy only weather insurance contracts
yarn deploy --tags WeatherInsurance

# Deploy only MinTempAgency
yarn deploy --tags MinTempAgency

# Deploy only WeatherIdAgency  
yarn deploy --tags WeatherIdAgency

# Deploy only Uniswap V2 infrastructure
yarn deploy --tags UniswapV2
```

## 📋 Contract Details

### MinTempAgency Contract

**Purpose**: Temperature-based weather insurance policies
**File**: `packages/hardhat/contracts/MinTempAgency.sol`

**Features**:
- Policies trigger when minimum temperature drops below threshold
- Ideal for crop insurance, heating cost coverage, winterization protection
- Uses Flare's Web2Json to fetch verified temperature data
- Automatic settlement based on real weather conditions

**Use Cases**:
- Agricultural crop protection
- Heating cost insurance
- Cold weather event coverage
- Winter sports event insurance

### WeatherIdAgency Contract

**Purpose**: Weather event-based insurance policies
**File**: `packages/hardhat/contracts/WeatherIdAgency.sol`

**Features**:
- Policies trigger based on specific weather conditions (storms, rain, snow, etc.)
- Uses weather ID thresholds for classification
- Supports various weather event types
- Automatic settlement using Flare's Web2Json oracles

**Weather ID Classifications**:
- **200-299**: Thunderstorms (severe weather)
- **300-399**: Drizzle
- **500-599**: Rain (light to heavy)
- **600-699**: Snow
- **700-799**: Atmosphere (fog, dust, haze)
- **800**: Clear sky
- **801-804**: Clouds (few to overcast)

**Use Cases**:
- Event insurance (outdoor concerts, festivals)
- Travel insurance (flight delays due to weather)
- Sports event coverage
- Construction project protection

## 🔧 Post-Deployment Setup

After successful deployment:

1. **Verify Contracts**: Contracts are automatically verified on FlareScan
2. **Update Frontend**: Contract addresses are automatically added to `deployedContracts.ts`
3. **Test Interaction**: Use the Debug page at `http://localhost:3000/debug`

## 🧪 Testing and Interaction

### Using the Debug Interface

1. Start the frontend: `yarn start`
2. Navigate to: `http://localhost:3000/debug`
3. Interact with deployed contracts directly through the UI

### Example Policy Creation

#### MinTempAgency Policy:
```typescript
// Create a policy that pays out if temperature drops below 0°C (32°F)
await createPolicy(
  40774000, // latitude (40.774°N - New York) * 10^6
  -73962000, // longitude (-73.962°W - New York) * 10^6  
  Math.floor(Date.now() / 1000) + 86400, // start in 24 hours
  Math.floor(Date.now() / 1000) + 86400 * 7, // expire in 7 days
  0, // 0°C threshold (temperature * 10^6)
  parseEther("1.0") // 1 ETH coverage
);
```

#### WeatherIdAgency Policy:
```typescript
// Create a policy that pays out for thunderstorms (weather ID 200-299)
await createPolicy(
  40774000, // latitude * 10^6
  -73962000, // longitude * 10^6
  Math.floor(Date.now() / 1000) + 86400, // start in 24 hours
  Math.floor(Date.now() / 1000) + 86400 * 3, // expire in 3 days
  200, // thunderstorm threshold (any ID 200-299 triggers payout)
  parseEther("0.5") // 0.5 ETH coverage
);
```

## 🌐 Network Configuration

### Flare Coston2 Testnet (Default)
- **Chain ID**: 114
- **RPC URL**: `https://coston2-api.flare.network/ext/C/rpc`
- **Block Explorer**: `https://coston2.testnet.flarescan.com`
- **Faucet**: Available through Flare Portal

### Flare Mainnet
- **Chain ID**: 14
- **RPC URL**: `https://flare-api.flare.network/ext/C/rpc`
- **Block Explorer**: `https://flarescan.com`

## 🔍 Verification

Contracts are automatically verified during deployment. If verification fails, you can manually verify:

```bash
# Verify MinTempAgency
npx hardhat verify --network flare-testnet <CONTRACT_ADDRESS>

# Verify WeatherIdAgency
npx hardhat verify --network flare-testnet <CONTRACT_ADDRESS>
```

## 📚 Integration with Flare Network

### Web2Json Integration
Both contracts use Flare's Web2Json functionality to:
- Fetch real-world weather data from external APIs
- Verify data authenticity through FDC (Flare Data Connector)
- Automatically settle policies based on verified conditions

### Oracle Data Flow
1. Policy resolution is triggered
2. Contract requests weather data through Web2Json
3. Flare validators verify the data
4. Contract automatically settles based on verified results

## 🛠️ Development Commands

```bash
# Compile contracts
yarn compile

# Run tests
yarn test

# Deploy contracts
yarn deploy

# Verify contracts
yarn verify

# Generate TypeScript types
yarn typechain
```

## 📖 Learn More

- [Flare Web2Json Documentation](https://docs.flare.network/dev/reference/flare-data-connector/)
- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Hardhat Deploy Documentation](https://github.com/wighawag/hardhat-deploy)
