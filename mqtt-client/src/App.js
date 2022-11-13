
import './App.css';
import React, { useState, useEffect } from 'react';
import {CircularProgressbarWithChildren,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import webSocket from 'socket.io-client';


function App() {
  const [ws,setWs] = useState(null)
  const [airQ, setAirQ] = useState(0)
  const [text, setText] = useState('Unconnected')
  const [color, setColor] = useState('rgb(0,0,0)')

  const connectWebSocket = () => {
    //開啟
    setWs(webSocket('http://localhost:8000'))
  } 
  useEffect(()=>{connectWebSocket()}, [])

  useEffect(()=>{
      if(ws){
          //連線成功在 console 中打印訊息
          console.log('success connect!')
          //設定監聽
          initWebSocket()
      }
  },[ws])

  const initWebSocket = () => {
      ws.on('mqtt', message => {
        console.log(message)
        let temp = parseInt(message.split(':')[1])
        setAirQ(temp)
        if(temp < 300){
          setText('Good')
          setColor('rgb(0,128,0)')
        }else if(temp < 1050){
          setText('Moderate')
          setColor('rgb(255, 162, 3)')
        }else if(temp < 3000){
          setText('Unhealthy')
          setColor('rgb(252, 40, 3)')
        }else {
          setText('Hazardous')
          setColor('rgb(74, 7, 1)')
        }

        
    })
  }

  const sendMessage = () => {
      //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
      ws.emit('getMessage', '只回傳給發送訊息的 client')
  }

  return (
    <div className="App">
      <div style={{ width: 400, height: 400}}>
        <CircularProgressbarWithChildren value={airQ/3948*100} circleRatio={0.5} styles={
          buildStyles({rotation:0.75, pathColor: color,})
        }>
          <strong style={{fontSize:80, color: color}}>{airQ}</strong>
          <div style={{fontSize:30,color: color}}>{text}</div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
}

export default App;
