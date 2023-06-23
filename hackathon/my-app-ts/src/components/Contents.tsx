import React from 'react';
import Form from  "../Form";
import { useEffect, useState } from "react";

type Message={
  id:string;
  editorname:string;
  content:string;
  edited:string;
}



function Contents(){
  const [messages,setMessage]=useState <Message[]>([]);
//   const [content,setContent]=useState <string>("");
  

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
  const onDelete=async(id:string)=>{
    
    try {
      const del = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user", {
        method: "DELETE",
        mode:"cors",
        body: JSON.stringify({
          id: id
        //   content: content,
          // edited:edited
        }),
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
  const onUpdate=async(id:string,content:string,edited:string)=>{
    
    try {
      const update = await fetch("https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user", {
        method: "PUT",
        mode:"cors",
        body: JSON.stringify({
          id: id,
          content:content,
          edited:edited
        //   content: content,
          // edited:edited
        }),
      });
      if (!update.ok) {
        throw Error(`Failed to create user: ${update.status}`);
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
                    <button id={m.id} onClick={()=>onDelete(m.id)}>削除</button>
                    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                         e.preventDefault();
                         {onUpdate(m.id,m.content,m.edited)}}}>
     
                    <label>Message: </label>
                    <input
                        type={"text"}
                        style={{ marginBottom: 20 }}
                        value={m.content}
                        onChange={(e) => setMessage((prevState) =>
                              prevState.map((v) => (v=== m ? {id:m.id,editorname:m.editorname,content:e.target.value,edited:"編集済み"} : v))
                            )                        
                          }
                    
                    ></input>
                    <button type={"submit"}>編集</button>
                    <span>{m.edited}</span>
                    </form>

                 </div>
               </div>
              )
      })}

    </div>
  )

  }
  export default Contents;

