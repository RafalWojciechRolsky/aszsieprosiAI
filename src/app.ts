import { setupChain } from "./chat/chainSetup.js";
import { startChat } from "./chat/chatInterface.js";

async function main() {
  const chain = await setupChain();
  startChat(chain);
}

main();
