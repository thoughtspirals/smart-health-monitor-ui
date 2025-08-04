const axios = require("axios");
const io = require("socket.io-client");

const socket = io("http://localhost:5000", { reconnection: true });

socket.on("connect", () => console.log("✅ Connected:", socket.id));
socket.on("disconnect", () =>
  console.log("❌ Disconnected, attempting reconnect...")
);
socket.on("ecg_data", (data) => console.log("📡 Received ECG Data:", data));

const sendECGData = async () => {
  console.log("🚀 Starting ECG Data Sender...");

  for (let i = 0; i < 120; i++) {
    const ecg_value = Math.floor(Math.random() * 401) + 500; // Random 500-900
    console.log(`📤 Sending ECG value: ${ecg_value}`);

    try {
      const response = await axios.post("http://localhost:5000/api/ecgdata", {
        ecg_value,
      });
      console.log("✅ Response:", response.data);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5s delay
  }
};

sendECGData();
