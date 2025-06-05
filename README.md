# 🌦️ Scaffold-Flare: Weather Insurance dApp

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH Docs</a> |
  <a href="https://docs.flare.network/">Flare Network Docs</a> |
  <a href="https://scaffoldeth.io">Scaffold-ETH Website</a>
</h4>

🌦️ A decentralized weather insurance platform built on the Flare network using Scaffold-ETH 2. This dApp enables users to create and trade weather-based insurance policies that automatically settle using real-world weather data through Flare's Web2Json oracle functionality.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, Typescript, and Flare Network's Web2Json oracles.

## 🎯 Features

- 🌡️ **Temperature Insurance**: Create policies that pay out when minimum temperatures drop below specified thresholds
- ⛈️ **Weather Event Insurance**: Create policies that pay out based on specific weather conditions (storms, heavy rain, etc.)
- 🔗 **Real-World Data Integration**: Uses Flare Network's Web2Json to fetch verified weather data from external APIs
- 🏪 **Insurance Marketplace**: Decentralized marketplace where users can create policies and insurers can provide coverage
- 🔄 **Automated Settlement**: Smart contracts automatically settle policies based on verified weather data
- 🕒 **Time-Based Policies**: Flexible policy duration with start and expiration timestamps
- 📍 **Location-Specific**: Policies are tied to specific geographic coordinates

## 🏗️ Architecture

### Smart Contracts

1. **WeatherIdAgency.sol** (`packages/hardhat/contracts/WeatherIdAgency.sol`)
   - Handles weather event-based insurance policies
   - Uses weather ID thresholds to determine payouts
   - Supports various weather conditions (rain, storms, snow, etc.)

2. **MinTempAgency.sol** (`packages/hardhat/contracts/MinTempAgency.sol`)
   - Handles temperature-based insurance policies
   - Triggers payouts when minimum temperature drops below threshold
   - Ideal for crop insurance, heating cost coverage, etc.

### Policy Lifecycle

1. **Creation**: Users create policies by specifying location, time period, weather conditions, and paying a premium
2. **Claiming**: Insurers provide coverage by depositing the payout amount and receive the premium
3. **Resolution**: Policies are settled automatically using verified weather data from Flare's Web2Json oracles
4. **Settlement**: Payouts are distributed based on whether weather conditions were met

### Integration with Flare Network

- Uses **Web2Json** functionality to fetch real-world weather data
- Leverages **Flare Data Connector (FDC)** for secure off-chain data verification
- Deployed on **Flare Testnet (Coston2)** and **Flare Mainnet**

## 🚀 Quick Start

### Prerequisites

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

### Installation & Setup

1. Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd scaffold-flare
yarn install
```

2. Set up environment variables:

```bash
# Copy the example environment file
cp packages/hardhat/.env.example packages/hardhat/.env

# Add your private key for deployment (optional - uses default for local development)
# __RUNTIME_DEPLOYER_PRIVATE_KEY=your_private_key_here
```

### Local Development

1. Start a local Flare testnet node (optional - can deploy directly to Coston2):

```bash
yarn chain
```

2. Deploy the smart contracts:

```bash
yarn deploy
```

This will deploy to Flare Coston2 testnet by default. The contracts will be automatically verified on FlareScan.

3. Start the frontend:

```bash
yarn start
```

Visit your app at: `http://localhost:3000`

### Network Configuration

The project is configured to work with:

- **Flare Coston2 Testnet** (default): For testing and development
- **Flare Mainnet**: For production deployment

Network settings are configured in `packages/hardhat/hardhat.config.ts`.

## 🧪 Usage

### Creating a Weather Insurance Policy

1. Connect your wallet to the dApp
2. Navigate to the policy creation interface
3. Specify:
   - **Location**: Latitude and longitude coordinates
   - **Time Period**: Start and expiration timestamps
   - **Weather Condition**: Temperature threshold or weather ID
   - **Coverage Amount**: Maximum payout amount
   - **Premium**: Amount you're willing to pay for coverage

### Providing Insurance Coverage

1. Browse available unclaimed policies
2. Evaluate the risk and potential returns
3. Claim a policy by depositing the coverage amount
4. Receive the premium payment immediately

### Policy Settlement

Policies are automatically settled when:
- Weather conditions are met (payout to policy holder)
- Weather conditions are not met and policy expires (coverage returned to insurer)
- Policy expires unclaimed (premium returned to policy holder)

## 🛠️ Development

### Testing

Run the smart contract tests:

```bash
cd packages/hardhat
yarn test
```

### Contract Interaction

Use the Debug Contracts page at `http://localhost:3000/debug` to interact with your deployed contracts directly from the UI.

### Frontend Customization

The frontend is built with Next.js and uses Scaffold-ETH 2's components and hooks:

- **Contract Hooks**: Use `useScaffoldReadContract` and `useScaffoldWriteContract` for contract interactions
- **Components**: Leverage pre-built components like `Address`, `Balance`, and `EtherInput`
- **Configuration**: Modify `packages/nextjs/scaffold.config.ts` for app-specific settings

## 🌐 Deployment

### Testnet Deployment

Contracts are deployed to Flare Coston2 testnet by default:

```bash
yarn deploy
```

### Mainnet Deployment

To deploy to Flare mainnet:

1. Update your environment variables with mainnet private key
2. Deploy with mainnet network flag:

```bash
yarn deploy --network flare-mainnet
```

### Frontend Deployment

Deploy your frontend to Vercel:

```bash
yarn vercel
```

## 📚 Learn More

- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Flare Network Documentation](https://docs.flare.network/)
- [Web2Json Documentation](https://docs.flare.network/dev/reference/flare-data-connector/)
- [Flare Block Explorer (Coston2)](https://coston2.testnet.flarescan.com)
- [Flare Block Explorer (Mainnet)](https://flarescan.com)

## 🤝 Contributing

We welcome contributions to improve the weather insurance platform! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Scaffold-ETH 2](https://scaffoldeth.io) and [Flare Network](https://flare.network)
