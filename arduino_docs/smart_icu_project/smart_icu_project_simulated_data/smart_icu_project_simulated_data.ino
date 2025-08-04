#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// Your MongoDB API Endpoint
const char* serverName = "http://localhost:5000/api/ecgdata";  

// Simulated ECG data (can be replaced with real sensor readings)
float ecgData[] = {0.0, 0.5, 1.0, 0.7, 0.3, -0.2, -0.8, -1.0, -0.5, 0.0};  
int ecgIndex = 0;  // Index for cycling through the simulated ECG data

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    // Connecting to WiFi
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;

        // Get simulated ECG data
        float simulatedECG = ecgData[ecgIndex];
        ecgIndex = (ecgIndex + 1) % 10;  // Loop through the simulated ECG data

        // Create JSON payload
        String jsonPayload = "{\"ecg_value\":" + String(simulatedECG) + "}";
        
        // Send POST request to MongoDB
        http.begin(serverName);
        http.addHeader("Content-Type", "application/json");

        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            Serial.print("ECG Data Sent! Response: ");
            Serial.println(http.getString());
        } else {
            Serial.print("Error Sending Data: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    } else {
        Serial.println("WiFi Disconnected!");
    }

    delay(5000);  // Send data every 5 seconds
}
