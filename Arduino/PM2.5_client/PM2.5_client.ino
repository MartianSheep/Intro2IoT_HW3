#define DUST_PIN A0
#define LED_PIN 2
#define DELAY_TIME 280
#define DELAY_TIME2 40
#define OFF_TIME 9680
float dustVal = 0;
int AirQ = 0;

#include <SPI.h>
#include <RH_RF95.h>

RH_RF95 rf95;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(DUST_PIN, INPUT);

  if (!rf95.init(903.5))
    Serial.println("init failed");

  // You can change the modulation parameters with eg
  // rf95.setModemConfig(RH_RF95::Bw500Cr45Sf128);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(LED_PIN, LOW);
  delayMicroseconds(DELAY_TIME);
  dustVal = analogRead(DUST_PIN);
  delayMicroseconds(DELAY_TIME2);
  digitalWrite(LED_PIN, HIGH);
  delayMicroseconds(OFF_TIME);

  delay(3000);
  AirQ = int((dustVal - 36) * 4);
//  AirQ = int(dustVal * 850 / 1024 - 0.1);

  uint8_t buf[6];
  String mystr = String(AirQ);
  mystr.toCharArray(buf, 5);
  rf95.send(buf, sizeof(buf));
  
//  Serial.println(dustVal);
  Serial.print(AirQ);
  Serial.print(" ");
  if (AirQ < 300)
    Serial.println("Good");
  else if (AirQ < 1050)
    Serial.println("Moderate");
  else if (AirQ < 3000)
    Serial.println("Unhealthy");
  else
    Serial.println("Hazardous");  
}
