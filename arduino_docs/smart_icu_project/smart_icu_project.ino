#include <Wire.h>
#include <SPI.h>
#include <DHT.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <LiquidCrystal_I2C.h>
#include "MAX30105.h"
#include "heartRate.h" // SparkFun MAX3010x library

// ========== Pins ==========
#define ECG_PIN A0
#define LO_PLUS 2
#define LO_MINUS 3
#define DHTPIN 7
#define DHTTYPE DHT11

// ========== Objects ==========
DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(128, 64, &Wire, -1); // OLED Display
LiquidCrystal_I2C lcd(0x27, 16, 2);          // LCD Display
MAX30105 particleSensor;

// Variables to store sensor data
int irValue, redValue, beatAvg;
float spo2 = 0;
unsigned long lastCycle = 0;
int displayMode = 0;

void setup() {
  // Initialize Serial Communication for debugging
  Serial.begin(115200);   // Debug Serial Monitor
  Serial1.begin(9600);    // ESP8266 Communication

  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);

  // Initialize OLED Display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED initialization failed!");
    while (true); // Stop execution if OLED doesn't initialize
  }

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(2000); // Wait for initialization

  // Clear display and set text settings
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);

  // Initialize DHT sensor
  dht.begin();

  // Initialize MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("MAX30102 not found!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("MAX30102 Error");
    while (1); // Stop execution if sensor initialization fails
  }

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0); // Disable green LED
}

void loop() {
  display.clearDisplay();

  // === Read ECG ===
  int ecgValue = analogRead(ECG_PIN);

  // === Read DHT11 ===
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  // === Handle DHT11 sensor errors ===
  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT sensor!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("DHT Error");
    delay(2000); // Wait before retrying
    return; // Skip the rest of the loop if DHT sensor fails
  }

  // === Read MAX30102 ===
  redValue = particleSensor.getRed();
  irValue = particleSensor.getIR();
  
  // Estimate SpO2 using the IR value (simple mapping, you can refine this)
  spo2 = map(irValue, 5000, 100000, 90, 100); 
   
  // Simulate heart rate (you should implement proper algorithms here)
  beatAvg = 70 + (irValue % 10);

  // === OLED Display ===
  display.setCursor(0, 0);
  display.print("ECG: "); display.println(ecgValue);
  display.setCursor(0, 15); display.print("Temp: "); display.print(temp); display.println(" C");
  display.setCursor(0, 30); display.print("Hum: "); display.print(hum); display.println(" %");
  display.setCursor(0, 45); display.print("SpO2: "); display.print(spo2); display.println(" %");
  display.display();

  // === LCD Rotating Info ===
  if (millis() - lastCycle > 3000) {
    displayMode = (displayMode + 1) % 4; // Cycle through modes
    lcd.clear();
    switch (displayMode) {
      case 0:
        lcd.setCursor(0, 0); lcd.print("ECG: "); lcd.setCursor(0, 1); lcd.print(ecgValue);
        break;
      case 1:
        lcd.setCursor(0, 0); lcd.print("Temp: "); lcd.setCursor(0, 1); lcd.print(temp); lcd.print(" C");
        break;
      case 2:
        lcd.setCursor(0, 0); lcd.print("Humidity: "); lcd.setCursor(0, 1); lcd.print(hum); lcd.print(" %");
        break;
      case 3:
        lcd.setCursor(0, 0); lcd.print("SpO2: "); lcd.setCursor(0, 1); lcd.print(spo2); lcd.print(" %");
        break;
    }
    lastCycle = millis();
  }

  // === Create JSON Data ===
  String json = "{";
  json += "\"ecg\":" + String(ecgValue) + ","; // ECG Value
  json += "\"humidity\":" + String(hum) + ","; // Humidity Value
  json += "\"spo2\":" + String(spo2) + ",";   // SpO2 Value
  json += "\"heartrate\":" + String(beatAvg);   // Heart Rate Value
  json += "}";

  // === Debugging: Output JSON to Serial Monitor ===
  Serial.println("Sending to ESP8266:");
  Serial.println(json);  // Debugging the payload before sending

  // === Send JSON to ESP8266 via Serial1 ===
  Serial1.print(json); 
  Serial1.print('\n');  // Ensure end of message
  Serial1.flush();      // Ensure data is sent before continuing

  // === Optional: Check for corruption on Serial1 ===
  if (Serial1.available()) {
    while (Serial1.available()) {
      char ch = Serial1.read();
      Serial.print("Received from ESP8266: ");  // Log received data byte by byte for debugging
      Serial.println(ch);
    }
  }

  // === Small delay to prevent flooding data to ESP8266 ===
  delay(2500);  // Adjust delay as necessary to avoid overloading ESP8266
}
