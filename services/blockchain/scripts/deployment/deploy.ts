import { ethers, network, run } from "hardhat";
import fs from "fs";
import path from "path";

// Contract addresses storage
interface ContractAddresses {
  [key: string]: string;
  covenantRegistry: string;
  governanceRules: string;
  auditLedger: string;
  esgCompliance: string;
}

async function main() {
  console.log("🚀 Starting LoanLife Edge contract deployment...");
  console.log(`📡 Network: ${network.name}`);
  console.log(`👤 Deployer: ${(await ethers.getSigners())[0].address}\n`);

  // Read contract addresses from .env or create new ones
  const addresses: ContractAddresses = {
    covenantRegistry: "",
    governanceRules: "",
    auditLedger: "",
    esgCompliance: "",
  };

  // Deploy CovenantRegistry
  console.log("1. Deploying CovenantRegistry...");
  const CovenantRegistry = await ethers.getContractFactory("CovenantRegistry");
  const covenantRegistry = await CovenantRegistry.deploy();
  await covenantRegistry.waitForDeployment();
  addresses.covenantRegistry = await covenantRegistry.getAddress();
  console.log(`✅ CovenantRegistry deployed to: ${addresses.covenantRegistry}`);

  // Deploy GovernanceRules
  console.log("\n2. Deploying GovernanceRules...");
  const GovernanceRules = await ethers.getContractFactory("GovernanceRules");
  const governanceRules = await GovernanceRules.deploy();
  await governanceRules.waitForDeployment();
  addresses.governanceRules = await governanceRules.getAddress();
  console.log(`✅ GovernanceRules deployed to: ${addresses.governanceRules}`);

  // Deploy AuditLedger
  console.log("\n3. Deploying AuditLedger...");
  const AuditLedger = await ethers.getContractFactory("AuditLedger");
  const auditLedger = await AuditLedger.deploy();
  await auditLedger.waitForDeployment();
  addresses.auditLedger = await auditLedger.getAddress();
  console.log(`✅ AuditLedger deployed to: ${addresses.auditLedger}`);

  // Deploy ESGCompliance
  console.log("\n4. Deploying ESGCompliance...");
  const ESGCompliance = await ethers.getContractFactory("ESGCompliance");
  const esgCompliance = await ESGCompliance.deploy();
  await esgCompliance.waitForDeployment();
  addresses.esgCompliance = await esgCompliance.getAddress();
  console.log(`✅ ESGCompliance deployed to: ${addresses.esgCompliance}`);

  // Verify contracts on Etherscan (if not local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Verifying contracts on Etherscan...");
    await verifyContract(addresses.covenantRegistry, []);
    await verifyContract(addresses.governanceRules, []);
    await verifyContract(addresses.auditLedger, []);
    await verifyContract(addresses.esgCompliance, []);
  }

  // Save addresses to file
  saveAddresses(addresses);

  // Print summary
  printDeploymentSummary(addresses);

  return addresses;
}

async function verifyContract(address: string, constructorArguments: any[]) {
  try {
    console.log(`Verifying ${address}...`);
    await run("verify:verify", {
      address,
      constructorArguments,
    });
    console.log(`✅ ${address} verified`);
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`✅ ${address} already verified`);
    } else {
      console.error(`❌ Failed to verify ${address}:`, error.message);
    }
  }
}

function saveAddresses(addresses: ContractAddresses) {
  const networkName = network.name;
  const addressesDir = path.join(__dirname, "..", "..", "deployments");
  
  // Ensure directory exists
  if (!fs.existsSync(addressesDir)) {
    fs.mkdirSync(addressesDir, { recursive: true });
  }
  
  // Save addresses to JSON file
  const addressesPath = path.join(addressesDir, `${networkName}.json`);
  fs.writeFileSync(
    addressesPath,
    JSON.stringify(addresses, null, 2)
  );
  
  // Update .env file
  updateEnvFile(addresses);
  
  console.log(`📝 Addresses saved to: ${addressesPath}`);
}

function updateEnvFile(addresses: ContractAddresses) {
  const envPath = path.join(__dirname, "..", "..", ".env");
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    
    // Update or add each contract address
    for (const [key, value] of Object.entries(addresses)) {
      const envKey = `${key.toUpperCase()}_ADDRESS`;
      const regex = new RegExp(`^${envKey}=.*$`, "m");
      
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${envKey}=${value}`);
      } else {
        envContent += `\n${envKey}=${value}`;
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env file updated with contract addresses");
  }
}

function printDeploymentSummary(addresses: ContractAddresses) {
  console.log("\n" + "=".repeat(50));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log(`📋 Network: ${network.name}`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("\n📜 Contract Addresses:");
  console.log("-".repeat(50));
  
  for (const [contractName, address] of Object.entries(addresses)) {
    console.log(`${contractName}: ${address}`);
  }
  
  console.log("\n💡 Next steps:");
  console.log("1. Update frontend with new contract addresses");
  console.log("2. Run tests: npx hardhat test");
  console.log("3. Verify on Etherscan (if applicable)");
  console.log("=".repeat(50));
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });