const knownMACs = ["AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66"]; // Simulated registry

async function searchMAC() {
  const mac = document.getElementById("macInput").value.trim();
  if (!knownMACs.includes(mac)) {
    document.getElementById("status").innerText = "❌ MAC not found.";
    return;
  }

  const pingSuccess = Math.random() > 0.2; // Simulated ping
  if (!pingSuccess) {
    document.getElementById("status").innerText = "📡 Ping failed. User offline.";
    return;
  }

  document.getElementById("status").innerText = "✅ Ping successful. Connecting...";
  document.getElementById("chatSection").classList.remove("hidden");
  document.getElementById("callSection").classList.remove("hidden");

  await generateKey(); // AES key
}

async function sendEncryptedMessage() {
  const input = document.getElementById("chatInput").value;
  const encrypted = await encryptMessage(input);
  sessionStorage.setItem("lastMessage", encrypted);

  const decrypted = await decryptMessage(encrypted);
  const log = document.getElementById("chatLog");
  log.value += `You: ${decrypted}\n`;
  document.getElementById("chatInput").value = "";
}