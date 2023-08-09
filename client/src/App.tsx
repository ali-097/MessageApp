import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
const logo = 'https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png'

const socket = io("http://localhost:5174");

interface MessageInfo {
  msg: string,
  user: string
}

const App = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageInfo[]>([]);
  const [username, setUsername] = useState("");
  const [selectedUsername, setSelectedUsername] = useState(""); 

  const sendMessage = (data: {msg: string, user: string}) => {
    if (!data.user) alert("Please Enter a valid username.");
    if (data.msg && data.user) {
      socket.emit("send-message", data);
      setMessageList(oldList => [...oldList, data]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("recieve-message", (data: any) => {
      setMessageList(oldList => [...oldList, data]);
    });
    return () => {
      socket.off("recieve-message");
    };
  }, []);

  return (
    <>
      <div className='app--header'>
        <img className='logo' src={logo}/>
        <h1 className='app--name'>CHAT APP</h1>
        <div className='chatroom--config'>
          <span className='app--name' style={{marginRight: '10px'}}>Enter Username:  </span>
          <input 
            className='username--input'
            type="text" 
            placeholder='Username'
            onChange={e => setUsername(e.target?.value)}
            onKeyDown={e => {if (e.key === 'Enter') setSelectedUsername(username)}}
            value={username}
          />
          <button 
            className='select--username--button'
            onClick={() => setSelectedUsername(username)}>
            Select Username
          </button>
        </div>
      </div>
      <div className='message-input--area'>
        <input 
          className='message--input--box'
          type="text" 
          placeholder='Write Message...' 
          onChange={e => setMessage(e.target?.value)}
          onKeyDown={e => {if (e.key === 'Enter') sendMessage({msg: message, user: selectedUsername})}}
          value={message}
        />
        <button 
          className="send--button" 
          onClick={() => sendMessage({msg: message, user: selectedUsername})} 
        >
          Send Message
        </button>
      </div>
      <div className='messages--container'>
        {messageList.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user === selectedUsername ? "sent" : "received"}`}
          >
            {message.user === selectedUsername ? "You" : message.user}: {message.msg}
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
