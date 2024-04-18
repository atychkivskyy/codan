/**
 * Redes Avanzadas
 * Modelo para peticiones GET y POST
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>



const char* ssid     = "";
const char* password = "";



void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);

   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) 
   { 
     delay(100);  
     Serial.print('.'); 
   }

   Serial.println("");
   Serial.print("Iniciado STA:\t");
   Serial.println(ssid);
   Serial.print("IP address:\t");
   Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:

   WiFiClient client;
   HTTPClient http;
   StaticJsonDocument<200> doc;
   
   float currentTemperature = 20.0f;
   float currentHumidity = 50.0f;
   float currentCO2 = 50.0f;
   float currentVolatile = 2.5f;

   currentTemperature += (random() - 0.5f) * 4.0f;
   currentHumidity += (random() - 0.5f) * 10.0f;
   currentCO2 += (random() - 0.5f) * 10.0f;
   currentVolatile += (random() - 0.5f);

   currentTemperature = min(max(currentTemperature, 10.0f), 50.0f);
   currentHumidity = min(max(currentHumidity, 0.0f), 100.0f);
   currentCO2 = min(max(currentCO2, 0.0f), 100.0f);
   currentVolatile = min(max(currentVolatile, 0.0f), 10.0f);
   
   doc["sensor_id"] = 1;
   doc["temperature"] = currentTemperature;   
   doc["humidity"] = currentHumidity;
   doc["co2"] = currentCO2;
   doc["volatile"] = currentVolatile;

   
   String jsonString;
   serializeJson(doc, jsonString);

   String serverPath = "http://localhost:80/data";
  
   http.begin(client, serverPath.c_str());
   http.addHeader("Content-Type", "application/json");
   
   int httpResponseCode = http.POST(jsonString);

  // Verificar el código de respuesta
  if (httpResponseCode > 0) {
    Serial.print("Solicitud POST exitosa, código de respuesta: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.print("Error en la solicitud POST, código de error: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
}
