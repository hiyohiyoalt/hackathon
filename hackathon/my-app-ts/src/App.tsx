// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import React from 'react';
// import Form from  "./Form";
// import {LoginForm} from "./components/LoginForm"
// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { fireAuth } from "./firebase";
// type Message={
//   id:string;
//   editorname:string;
//   content:string;
//   edited:boolean;
// }

// function App(){
//   const [messages,setMessage]=useState <Message[]>([]);

//   const fetchUsers = async () => {
 
//     try {
//       const res = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user",
//       {
//         method:"GET",
//         mode:"cors",
//         headers:{
//           "Content-Type":"application/json",
//         }
//       }
//       );
//       if (!res.ok) {
//         throw Error(`Failed to fetch users: ${res.status}`);
//       }

//       const messages:Message[] = await res.json();
//       setMessage(messages);
//       console.log(messages);
     
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const onSubmit=async(editorname:string,content:string)=>{
    
//     if (!content) {
//       alert("Please enter name");
//       return;
//     }
//     try {
//       const result = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user", {
//         method: "POST",
//         mode:"cors",
//         body: JSON.stringify({
//           editorname: editorname,
//           content: content,
//           // edited:edited
//         }),
//       });
//       if (!result.ok) {
//         throw Error(`Failed to create user: ${result.status}`);
//       }

      
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   useEffect(() => {
//     fetchUsers();
//   }
//   ,[])
//   const App = () => {
//     // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
//     const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
    
//     // ログイン状態を監視して、stateをリアルタイムで更新する
//     onAuthStateChanged(fireAuth, user => {
//       setLoginUser(user);
//     });
//   return (
//     <div className="App">
//       <LoginForm/>
//       {loginUser ? <Contents /> : null}
//       <Form onSubmit={onSubmit} />
//       {messages.map((m)=>{
//         return(<div key={m.id}>{m.content}</div>)
//       })}

//     </div>
//   )

//   }
//   export default App;

import React from 'react';
import Contents from "./components/Contents"
import {LoginForm} from "./components/LoginForm"
import { useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";

const App = () => {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  
  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  
  return (
    <>
      <LoginForm />
      {/* ログインしていないと見られないコンテンツは、loginUserがnullの場合表示しない */}
      {loginUser ? <Contents /> : null}
    </>
  );
};
export default App;
