#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"
#include "Adafruit_TSL2591.h"
#include <Adafruit_SSD1306.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

/********* ID du device dans la base de donnée *********/
unsigned short int ID = 1;
String destination = "PUT YOUR NGROK LINK HERE";

/********* Données connexion wifi *********/
const char* WIFI_SSID = "PUT YOUR SSID HERE";
const char* WIFI_PASS = "PUT YOU PASSWORD HERE";

/********* Récupération du timestamp  *********/
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

/********* Telemetre *********/
#define VITESSE 340
const int Trig = 13; 
const int Echo = 12;
const int distanceRef = 15; // Distance de référence pour le télémètre (0% d'eau) + Penser à ajouter 5 cm de sécurité

/********* Pompe *********/
const int pompe = 14;

/********* Soil Moisture Sensor *********/
const int soilSensor = 36;
const int AirValue = 2913;
const int WaterValue = 1325;

/********* DHT22: Température et humidité extérieur *********/
const int dhtPin = 15; // remettre 15 
DHT dht(dhtPin, DHT22);

/********* DS18B20 : Capteur de température du sol *********/
#define DSB_BUS 19
OneWire dsbWire(DSB_BUS);
DallasTemperature dsb(&dsbWire);

/********* Capteur de luminosité *********/
Adafruit_TSL2591 tsl = Adafruit_TSL2591(2591);

/********* Ecran LED *********/
Adafruit_SSD1306 ecranOLED(128, 32, &Wire, -1);

/********* Batterie *********/
const int batterie = 32; // Pour lire l'état de la batterie

/********* Bouton + Filtre anti-rebond (debouncer) *********/
/*struct Button {
  const uint8_t PIN;
  uint32_t numberKeyPresses;
  bool pressed;
};

Button button1 = {18, 0, false};*/

/********* Fonction utiles *********/

void lcd_print_init() {
  ecranOLED.clearDisplay();
  ecranOLED.setTextSize(2); // Draw 2X-scale text
  ecranOLED.setTextColor(SSD1306_WHITE);
  ecranOLED.setCursor(28, 8);
  ecranOLED.write("iGarden");
  ecranOLED.display();      // Show initial text
}

void lcd_print_msg(int code, int value){
  ecranOLED.clearDisplay();
  ecranOLED.setTextSize(1.75); // Draw 2X-scale text
  ecranOLED.setTextColor(SSD1306_WHITE);
  ecranOLED.setCursor(0, 12);

  switch(code){
    case 0:
      ecranOLED.setCursor(8, 8);
      ecranOLED.write("Acquisition mesures");
      ecranOLED.setCursor(30, 16);
      for(int i = 0; i < 5; i++){
        ecranOLED.write(". ");
        delay(500);
        ecranOLED.display();
      }
      break;
      
    case 1:
      ecranOLED.write("Bac d'eau : ");
      ecranOLED.print(value);
      ecranOLED.write(" %");
      ecranOLED.display();
      ecranOLED.startscrollleft(0x00, 0x0F);
      delay(4000);
      ecranOLED.stopscroll();
      break;
      
     case 2:
      ecranOLED.write("Batterie : ");
      ecranOLED.print(value);
      ecranOLED.write(" %");
      ecranOLED.display();
      ecranOLED.startscrollleft(0x00, 0x0F);
      delay(4000);
      ecranOLED.stopscroll();
      break;
      
    case 3:
      ecranOLED.setCursor(28, 8);
      ecranOLED.write("Mise en veille");
      ecranOLED.display();
      delay(1000);
      break;
    case 4:
      ecranOLED.setCursor(28, 8);
      ecranOLED.write("Rebooting ...");
      ecranOLED.display();
      delay(1000);
      break;
      
    case 5:
      ecranOLED.setCursor(16, 8);
      ecranOLED.write("Connexion reussie");
      ecranOLED.display();
      delay(1000);
      break;
      
    case 6:
      ecranOLED.setCursor(8, 8);
      ecranOLED.write("Envoi des donnees");
      ecranOLED.setCursor(30, 16);
      for(int i = 0; i < 5; i++){
        ecranOLED.write(". ");
        delay(500);
        ecranOLED.display();
      }
      
      break;
     case 7:
      ecranOLED.setCursor(55, 12);
      ecranOLED.write("OK :)");
      ecranOLED.display();
      delay(2000);
      break;
      
     case 8:
      ecranOLED.setCursor(28, 8);
      ecranOLED.write("Erreur : ' (");
      ecranOLED.display();
      delay(2000);
      break;
     case 9:
      ecranOLED.setCursor(16, 8);
      ecranOLED.write("Getting values ...");
      ecranOLED.display();
      delay(2000);
      
    default:
      break;
  }
  
  ecranOLED.clearDisplay();
  ecranOLED.display();
}

/********* IRQ *********/
/*void IRAM_ATTR isr() {
  delay(50);
  button1.numberKeyPresses += 1;
  if(button1.numberKeyPresses >= 5){
    button1.numberKeyPresses = 1;
  }
  lcd_print_irq(button1.numberKeyPresses, 0);
  
  //printf("Button 1 has been pressed %u times\n", button1.numberKeyPresses);
}*/

void arrosage(int seuil){ // seuil d'humidité
  // Ajouter condition humidité
  //detachInterrupt(button1.PIN); // On enlève l'interruption pour ne pas interrompre l'arrosage
  for(int i = 0; i < 4; i++){  // Mettre le nombre d'arrosage à 10 max en situation réelle
    int s = analogRead(soilSensor); // On vérifie l'humidité à chaque tour
    int hum = map(s, WaterValue, AirValue, 100, 0); 
    ecranOLED.clearDisplay();
    ecranOLED.setCursor(14, 8);
    ecranOLED.write("Arrosage en cours");
    ecranOLED.display();
    ecranOLED.setCursor(30,16);
    digitalWrite(pompe, HIGH);
    delay(2000);
    digitalWrite(pompe, LOW);
    delay(10);
    for(int k = 0; k < 5; k++){
       ecranOLED.write(". ");
       ecranOLED.display();
       delay(1000);
    }
    //printf("Humidite : %d\nSeuil : %d\n", hum, seuil);
    /*if(hum > seuil){
      attachInterrupt(button1.PIN, isr, FALLING); // On remet l'interruption avant de quitter la fonction
      break;
    }  */
  }
  //attachInterrupt(button1.PIN, isr, FALLING);
  
}

int getHumiditySoil(int code){
  switch(code){
    case 0: // Plante Grasse
      return 15;
    case 1: // Plante normale
      return 30;
    case 2: // Plante Tropical
      return 50;
    default:
      break;
  }
  return 0;
}


/********* Fonction d'initialisation *********/

void setup() {
  
  Serial.begin(115200);
    /********* Bouton Poussoir / IRQ *********/
  //pinMode(button1.PIN, INPUT_PULLDOWN);
  //attachInterrupt(button1.PIN, isr, FALLING);
  
  /********* Init LCD *********/
  ecranOLED.begin(SSD1306_SWITCHCAPVCC, 0x3C); // Ecran LED
  lcd_print_init();
  
  /********* Initialisation des capteurs et de la pompe *********/
  pinMode(soilSensor, INPUT); // Capteur D'humidité du sol
  dht.begin(); // DHT22: Température & Humidité
  dsb.begin(); // DS18B20: Température
  pinMode(Trig, OUTPUT); // Telemetre
  digitalWrite(Trig, LOW); 
  pinMode(Echo, INPUT); // Telemetre
  pinMode(pompe, OUTPUT); // Pompe
  

  
  /********* Connexion au Wifi *********/
  short int attempt = 0;
  WiFi.begin(WIFI_SSID, WIFI_PASS);  
  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    if(attempt >= 10){
      esp_sleep_enable_timer_wakeup(1 * 1000000);
      lcd_print_msg(4, -1);
      esp_deep_sleep_start();
    }
    delay(1000);
    Serial.println("Connecting to WiFi..");
    attempt++;
  }
  lcd_print_msg(5, -1);
  Serial.println("Connected to the WiFi network");
  
  /********* Démarrage du client NTP *********/
  timeClient.begin();
  
  ecranOLED.clearDisplay();
  ecranOLED.display();
}

/********* Fonction principale *********/

void loop() {

  /********* HTTP GET *********/
  short int getOK = 0;
  short int ret = -1;
  String destinationGet = destination + "/api/values?num=" + String(ID);
  HTTPClient http;
  http.begin(destinationGet);  //Specify destination for HTTP request
  http.addHeader("Content-Type", "application/json");             //Specify content-type header
  
  while(getOK == 0 && ret == -1){
    lcd_print_msg(9, -1);
    int httpCode = http.GET();
    // httpCode will be negative on error
    if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.println(httpCode);   //Print return code
      String response = http.getString();
      Serial.println(response);           //Print request answer
      ret = response.toInt();
      lcd_print_msg(7, -1);
      
    } else {
      Serial.print("Error on getting GET: ");
      Serial.println(httpCode);
      lcd_print_msg(8, -1);
    }
  }
  http.end();  //Free resources
  
  /********* Récupération du seuil d'humidité en fonction du GET *********/
  int seuilHumidite = getHumiditySoil(ret);

  /********* Acquisition des mesures *********/
  
  lcd_print_msg(0, -1);
  
  /********* Lire le DHT *********/
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  /********* Lire le DS18B20 *********/
  dsb.requestTemperatures();
  float temperature_sol = dsb.getTempCByIndex(0);

  /********* Lire le capteur d'humidité sol *********/
  int s = analogRead(soilSensor);
  //printf("soil = %d\n\r", s);
  int soilPercent = map(s, WaterValue, AirValue, 100, 0);
  if(soilPercent < 0)
    soilPercent = 0;
   if(soilPercent > 100)
    soilPercent = 100;
    
  /********* Lire le capteur de luminosité *********/
  int luminosite = tsl.getLuminosity(TSL2591_VISIBLE);
  printf("lum: %d \n\r",luminosite);
  int indiceLumiere;
  if(luminosite < 800){
    indiceLumiere = 0; // Mauvais
  } else if(luminosite > 1600){
    indiceLumiere = 3; // Excellent
  } else if(luminosite < 1400 && luminosite > 1000){
    indiceLumiere = 2; // Bon
  }
  else if(luminosite < 1000 && luminosite > 800){
    indiceLumiere = 1; // Moyen
  }
    
  /********* Lire le telemetre *********/
  digitalWrite(Trig, HIGH);
  delayMicroseconds(10); //on attend 10 µs
  digitalWrite(Trig, LOW);
  unsigned long duree = pulseIn(Echo, HIGH);
  //printf("duree: %d\n",duree);
  int distancePercent = 0;
  float distance;
  duree = duree/2;  
  float temps = duree/1000000.0; //on met en secondes
  distance = temps*VITESSE*100; //on multiplie par la vitesse, d=t*v et on convertit en cm (x100)
  distancePercent = ((distanceRef - distance) / distanceRef)*100;
  if(distancePercent > 100)
    distancePercent = 100;
  if(distancePercent < 0)
    distancePercent = 0;
  
  printf("distance : %f \n\r",distance);
  //printf("distancePercent : %d \n\r",distancePercent);
  /********* Verification niveau d'eau *********/
  if(distancePercent < 20.00)
    lcd_print_msg(1, distancePercent);
  
  /********* Récupération de l'état de la batterie *********/
  float chargeBatterie = analogRead(batterie);
  chargeBatterie = chargeBatterie / 1241; // On ramène la valeur lu à une tension entre [2.3V, 3.3V]
  chargeBatterie = chargeBatterie*4.2/3.3; // On reconvertit la tension à l'intervalle originale de la batterie [3.0, 4.2V)
  // Convertir la tension de la batterie en %
  if(chargeBatterie > 4 && chargeBatterie < 4.2)
    chargeBatterie = 65*chargeBatterie-173;
  if(chargeBatterie > 3.6 && chargeBatterie < 4)
    chargeBatterie = -304.75*chargeBatterie*chargeBatterie+2524.8*chargeBatterie-5136.3;
  if(chargeBatterie > 3 && chargeBatterie < 3.6)
    chargeBatterie = 18.75*chargeBatterie*chargeBatterie-113.75*chargeBatterie+172.5;
  int charge = (int) chargeBatterie;
  lcd_print_msg(2, charge);
  
  /********* Récupération de la date *********/
  timeClient.update();
  unsigned long date = timeClient.getEpochTime();

  /********* Vérifier si les données sont valides *********/
  if(isnan(t))
    t = 0;
  if(isnan(h))
    h = 0;
  
  /********* Envoie de données *********/
  if (WiFi.status() == WL_CONNECTED) {
    
    /********* Construction du Header HTTP *********/
    String destinationPost = destination + "/api/values";
    HTTPClient http;
    http.begin(destinationPost);  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");

    /********* Ajouter les valeurs à la payload *********/
    String payload = "{\"num\":" + String(ID) + ",";
    payload = payload + "\"hum_air\":" + String(h) + ",";
    payload = payload + "\"temp_air\":" + String(t) + ",";
    payload = payload + "\"temp_sol\":" + String(temperature_sol) + ",";
    payload = payload + "\"hum_sol\":" + String(soilPercent) + ",";
    payload = payload + "\"lum\":" + String(indiceLumiere) + ",";
    payload = payload + "\"eau\":" + String(distancePercent) + ",";
    payload = payload + "\"batterie\":" + String(charge) + ",";
    payload = payload + "\"date\":" + String(date) + "}";
    
    Serial.println(payload);
 
    /********* POST les données *********/
    lcd_print_msg(6, -1);
    int httpResponseCode = http.POST(payload);   //Send the actual POST request
    
    /********* Récupérer et vérifier la valeur de retour *********/
    if (httpResponseCode > 0) {
      String response = http.getString();                       //Get the response to the request
      Serial.println(httpResponseCode);   //Print return code
      Serial.println(response);           //Print request answer
      lcd_print_msg(7, -1);
    }
    else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
      lcd_print_msg(8, -1);
    }
    
    http.end();

  }
  
  /********* Arrosage si besoin *********/
  if(soilPercent < seuilHumidite)
    arrosage(seuilHumidite);

  /********* Mise en veille *********/
  lcd_print_msg(3, -1);
  esp_sleep_enable_timer_wakeup(10 * 1000000); // Mettre en deepsleep pendant 10 sec
  //esp_sleep_enable_ext0_wakeup(GPIO_NUM_2,1); // Réveiller l'esp avec une interruption GPIO
  esp_deep_sleep_start();
}
