import React from 'react';
import Form from  "../Form";
import { useEffect, useState } from "react";

type Message={
  id:string;
  editorname:string;
  content:string;
  edited:boolean;
}

function Contents(){
  const [messages,setMessage]=useState <Message[]>([]);

  const fetchUsers = async () => {
 
    try {
      const res = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user",
      {
        method:"GET",
        mode:"cors",
        headers:{
          "Content-Type":"application/json",
        }
      }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      const messages:Message[] = await res.json();
      setMessage(messages);
      console.log(messages);
     
    } catch (err) {
      console.error(err);
    }
  };
  const onSubmit=async(editorname:string,content:string)=>{
    
    if (!content) {
      alert("Please enter message");
      return;
    }
    try {
      const result = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user", {
        method: "POST",
        mode:"cors",
        body: JSON.stringify({
          editorname: editorname,
          content: content,
          // edited:edited
        }),
      });
      if (!result.ok) {
        throw Error(`Failed to create user: ${result.status}`);
      }

      
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };
  const onDelete=async()=>{
    
    try {
      const del = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user", {
        method: "DELETE",
        mode:"cors"
        // body: JSON.stringify({
        //   editorname: editorname,
        //   content: content,
          // edited:edited
        // }),
      });
      if (!del.ok) {
        throw Error(`Failed to create user: ${del.status}`);
      }

      
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }
  ,[])
  
  return (
    <div className="Contents">
      
      
      <Form onSubmit={onSubmit} />
      
      {messages.map((m)=>{
        return(<div key={m.id}>
                 <div>
                    <span>{m.editorname}</span><span>{m.content}</span>
                    <button onClick={onDelete}>削除</button>
                 </div>
               </div>
              )
      })}

    </div>
  )

  }
  export default Contents;

