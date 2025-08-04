#include <Wire.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

// ========== DHT11 Setup ==========
#define DHTPIN 7         // DHT11 connected to digital pin 7 (D7 on Mega)
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// ========== LCD Setup ==========
LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C address 0x27

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Initialize LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(2000);  // Show initializing message for 2 seconds

  lcd.clear();
}

void loop() {
  // ====== DHT11 Temperature and Humidity ======
  float temp = dht.readTemperature(); // Celsius
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT11 sensor!");
    
    // Show error on LCD
    lcd.setCursor(0, 0);
    lcd.print("DHT Error!    ");
    lcd.setCursor(0, 1);
    lcd.print("Check Wiring.  ");
  } else {
    Serial.print("Temp: "); Serial.print(temp); Serial.print(" °C | ");
    Serial.print("Humidity: "); Serial.print(hum); Serial.println(" %");

    // Display data on LCD
    lcd.setCursor(0, 0);
    lcd.print("T: "); lcd.print(temp); lcd.print("C");

    lcd.setCursor(0, 1);
    lcd.print("H: "); lcd.print(hum); lcd.print("%");
  }

  delay(2000); // Wait 2 seconds before reading again
}
