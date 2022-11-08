# Intro2IoT_HW3
Introduction to IoT, HW3
Author: B08901097 徐有齊，B08901132 任瑨洋

## Hardware Setup
### Edge
使用 Arduino Uno 、 Dragino LoRa shield 和 SHARP GP2Y1014AU PM2.5 Sensor 架設遠端 sensor 偵測空氣品質。此處的 Arduino Uno 將會是 LoRa 傳輸中的 client 。
以下是 PM2.5 sensor 連接到 Arduino Uno 上的腳位圖：
![PM2.5 Circuit](https://i.imgur.com/jdgksA9.png?1)

以下是實作圖片：
![PM2.5 Circuit Implement](https://i.imgur.com/Xep1t5T.jpg)

### MQTT Broker Server
我們使用一個 Arduino Uno 作為 LoRa server ，接收來自 Dragino LoRa shield 的訊號，並將訊息以 UART 方式透過 USB 傳給 RPi 。

### Front-end
我們假定使用者使用PC打開我們設計的前端網頁。此前端網頁會 subscribe 到 RPi 的 MQTT broker ，這方面會在下一部分詳細說明。

## Software/Firmware Setup
此作業所有的 code 皆可以在 https://github.com/MartianSheep/Intro2IoT_HW3 存取。
### Arduino
#### 以下為操作步驟：
1. 於燒錄用的電腦上安裝 Arduino IDE 。
2. 從 http://www.airspayce.com/mikem/arduino/RadioHead/RadioHead-1.121.zip 下載 RadioHead 程式庫，並放在 C:\Users\%USERNAME%\Documents\Arduino\libraries\ 。
3. 改動 RadioHead 程式庫中的 RH_RF95.cpp 與 RH_RF95.h ，將這兩個檔案替換成我們於 github 上提供的 Arduino\Modified rf95 files\ 中的 RH_RF95.cpp 與 RH_RF95.h 。 (備註：我們更改過其中的 `rf95.init()` ，使其可以更輕鬆地更改 LoRa 頻率。)
4. 關於 LoRa client 端，燒錄 Arduino\PM2.5_client 中的 Arduino code 至 LoRa client 端的 Uno 開發版上，使其可以讀取 PM2.5 sensor 並傳至 LoRa server 。
5. 關於 LoRa server 端，燒錄 Arduino\PM2.5_server 中的 Arduion code 至 LoRa server 端的 Uno 開發版上，使其可以接收來自 client 的訊息並傳送至 RPi。
#### 關於各項係數：
- LoRa 方面，我們使用 903.5 MHz 作為我們的通訊頻段。
- Arduino Uno 的 UART 溝通方面，我們使用 9600 baudrate 溝通。
- 更改過的 RH_RF95 方面，原本的 `rf95.init()` 並沒有參數傳入，我們將其改為 `rf95.init(float initFrequency = 434.0)` 後稍微更改其內容 ，使其在兼容原本程式碼的 434 MHz 的情況下允許我們輕鬆地更改傳輸頻率。

### Raspberry Pi
#### 以下為操作步驟：
1. 於燒錄用的電腦上安裝 Raspberry Pi Imager 。
2. 將 RPi 的 SD Card 插到電腦上，開啟 Imager ，選擇「擦除」，將 SD Card 格式化。
3. 於 Imager 上選擇 Raspberry Pi OS (32-bit) ，燒錄至 SD Card 。
4. 將 SD Card 插入 RPi ，上電，按螢幕指示完成基本設定。
5. 於 RPi 上開啟 terminal ，執行以下指令：
	- `sudo apt-get update`
	- `sudo apt-get upgrade`
	- `sudo apt-get install mosquitto`
	- `sudo apt-get install mosquitto-clients`
	- `pip3 install paho-mqtt`
	- `git clone https://github.com/MartianSheep/Intro2IoT_HW3`
	- `cd Intro2IoT_HW3/RPi/`
6. 確定 LoRa server 端的 Arduino Uno 已經插上 RPi 。使用 `ls -l \dev` 來確定此 Arduino Uno 使用哪一個 port 。我們在實作時 RPi 皆給 `/dev/ttyACM0` ，因此程式中預設使用此 port 。若有不同，請在 RPi/PM25.py 中第 34 行更改。
7. 使用 `python3 PM25.py` 執行程式碼。

### Front-end Client (PC)
