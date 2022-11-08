#include <SPI.h>
#include <RH_RF95.h>

// Singleton instance of the radio driver
RH_RF95 rf95;

void setup() 
{
  Serial.begin(9600);
  while (!Serial) ; // Wait for serial port to be available
  if (!rf95.init(903.5))
    Serial.println("init failed");  
}

void loop()
{
  if (rf95.available())
  {
    // Should be a message for us now   
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
    if (rf95.recv(buf, &len))
    {
      Serial.print("air:");
      Serial.println((char*)buf);
    }
    else
    {
      Serial.println("recv failed");
    }
  }
}
