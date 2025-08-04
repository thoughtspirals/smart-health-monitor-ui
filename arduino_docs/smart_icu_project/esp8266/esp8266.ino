#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Wi-Fi credentials
const char* ssid = "Samarth's S24+";
const char* password = "1234567809";

// Backend URL to send data to
const char* serverUrl = "http://192.168.214.161:5000/api/sensor";

// Function to connect to Wi-Fi
void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retries++;
    if (retries > 20) {
      Serial.println("\n❌ Failed to connect to WiFi. Restarting...");
      ESP.restart();  // Restart if WiFi connection fails
    }
  }

  Serial.println("\n✅ WiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Function to post data to the backend server
void postDataToServer(const String& jsonPayload) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    Serial.println("📡 Sending POST to backend...");
    Serial.println("Payload: " + jsonPayload);

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(jsonPayload);
    Serial.println("🔁 HTTP Response Code: " + String(httpCode));

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("📨 Response from server: " + response);
    } else {
      Serial.println("❌ Error sending POST: " + http.errorToString(httpCode));
    }

    http.end();
  } else {
    Serial.println("❌ WiFi not connected. Skipping POST.");
  }
}

void setup() {
  Serial.begin(9600);
  delay(1000);
  connectToWiFi();
}

void loop() {
  // Optional fallback for testing (sends dummy data every 10 seconds)
  static unsigned long lastTest = 0;
  if (millis() - lastTest > 1000) {
    lastTest = millis();
    
    // Generate random temperature between 28 and 35 (reasonable afternoon temperature in India)
    float randomTemperature = random(280, 351) / 10.0; // Generates a float between 28.0 and 35.0
    
    // Generate random humidity between 40% and 60%
    float randomHumidity = random(400, 601) / 10.0; // Generates a float between 40.0 and 60.0
    
    // Simulate a normal SpO2 level for a young adult (99% is typical)
    float randomSpO2 = random(890, 920) / 10.0; // Healthy SpO2 value
    
    // Simulate heart rate between 70 and 80 bpm for a young adult
    int randomHeartRate = random(70, 81); // Generates a heart rate between 70 and 80 bpm
    
    // Generate random ECG value between 100 and 500 (for simulation purposes)
    int randomECG = random(100, 500); // Simulate ECG value

    // Create the JSON payload
    String testPayload = "{\"ecg\":" + String(randomECG) + ",\"temperature\":" + String(randomTemperature, 1) + ",\"humidity\":" + String(randomHumidity, 1) + ",\"spo2\":" + String(randomSpO2, 1) + ",\"heartrate\":" + String(randomHeartRate) + "}";

    // Debugging
    Serial.println("🧪 Sending test data (no serial input)...");
    Serial.println("✅ Test Payload: " + testPayload);
    postDataToServer(testPayload);
  }
}
