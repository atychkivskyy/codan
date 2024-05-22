#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

const char* ssid     = "";
const char* password = "";

const unsigned long sleepTime = 5;

float currentTemperature = 20.0f;
float currentHumidity = 50.0f;
float currentCO2 = 50.0f;
float currentVolatile = 2.5f;

void setup() {
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
  medirSensores();

  enviarDatosPOST();
  // enviarDatosGET();

  Serial.println("Durmiendo...");
  ESP.deepSleep(sleepTime * 1000);
}

void medirSensores() {
  currentTemperature += (random() - 0.5f) * 4.0f;
  currentHumidity += (random() - 0.5f) * 10.0f;
  currentCO2 += (random() - 0.5f) * 10.0f;
  currentVolatile += (random() - 0.5f);

  currentTemperature = min(max(currentTemperature, 10.0f), 50.0f);
  currentHumidity = min(max(currentHumidity, 0.0f), 100.0f);
  currentCO2 = min(max(currentCO2, 0.0f), 100.0f);
  currentVolatile = min(max(currentVolatile, 0.0f), 10.0f);

  Serial.print("Temperatura: ");
  Serial.println(currentTemperature);
  Serial.print("Humedad: ");
  Serial.println(currentHumidity);
  Serial.print("CO2: ");
  Serial.println(currentCO2);
  Serial.print("Volatiles: ");
  Serial.println(currentVolatile);
}

void enviarDatosPOST() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    StaticJsonDocument<200> doc;

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

    if (httpResponseCode > 0) {
      Serial.print("Solicitud POST exitosa, código de respuesta: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error en la solicitud POST, código de error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Error de conexión WiFi");
  }
}

void enviarDatosGET() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    String serverPath = "http://localhost:80/data";
    serverPath += "?sensor_id=1";
    serverPath += "&temperature=" + String(currentTemperature);
    serverPath += "&humidity=" + String(currentHumidity);
    serverPath += "&co2=" + String(currentCO2);
    serverPath += "&volatile=" + String(currentVolatile);

    http.begin(client, serverPath.c_str());

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      Serial.print("Solicitud GET exitosa, código de respuesta: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error en la solicitud GET, código de error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("Error de conexión WiFi");
  }
}
