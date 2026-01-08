import { run, network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log(`🔍 Verifying contracts on ${network.name}...`);

  const networkName = network.name;
  const addressesPath = path.join(
    __dirname,
    "..",
    "..",
    "deployments",
    `${networkName}.json`
  );

  if (!fs.existsSync(addressesPath)) {
    console.error(`❌ No deployment found for network: ${networkName}`);
    process.exit(1);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));

  // Verify each contract
  for (const [contractName, address] of Object.entries(addresses)) {
    console.log(`\nVerifying ${contractName} at ${address}...`);
    
    try {
      await run("verify:verify", {
        address: address as string,
        constructorArguments: [],
      });
      console.log(`✅ ${contractName} verified successfully`);
    } catch (error: any) {
      if (error.message.toLowerCase().includes("already verified")) {
        console.log(`✅ ${contractName} already verified`);
      } else {
        console.error(`❌ Failed to verify ${contractName}:`, error.message);
      }
    }
  }

  console.log("\n🎉 Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });