import { toBeEnabled } from '@testing-library/jest-dom/matchers';
import './App.css';
import Form from  "./Form";
import { useEffect, useState } from "react";
// type user={
//   id:string;
//   name:string;
//   age:number;
// }
function App() {
const [userstable,setUserstable]=useState([]);
const [ids, setIds] = useState([]);
const [names, setNames] = useState([]);
const [ages, setAges] = useState([]);
const [name, setName] = useState("");
  const [age, setAge] = useState(0);
// const onSubmit = async (name,age) => {
//     const response = await fetch(
      
//       "https://hiyohiyoalt77-hfa7mfor4q-uc.a.run.app/user",
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const userdata = await response.json();
//     setdata(userdata);
//   };
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

      const users = await res.json();
      console.log(11111111111111111);
      console.log(users);
      setUserstable(users);
      console.log(22222222222222222222222);
      // setdata(users);
      // for (const v of users) {
      //   console.log(v);
      //   setIds((ids) => ([...ids, v.id]));
      //   setNames((names) => ([...names, v.name]));
      //   setAges((ages) => ([...ages, v.age]));
      // }
    } catch (err) {
      console.error(err);
    }
  };
  // const listup=()=>{
  //   const newList=[...userstable,users];
  //   setUserstable(newList);
  // };
  // const onSubmit = async (name,age) => {
  //   const response = await fetch(
  //     "http://localhost:8000/users",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name,
  //         age,
  //       }),
  //     }
  //   );
  //   console.log("response is...", response);
  // };
  const onSubmit = async (name,age) => {
    
    if (!name) {
      alert("Please enter name");
      return;
    }

    if (name.length > 50) {
      alert("Please enter a name shorter than 50 characters");
      return;
    }

    if (age < 20 || age > 80) {
      alert("Please enter age between 20 and 80");
      return;
    }

    try {
      const result = await fetch("http://localhost:8080/user", {
        method: "POST",
        mode:"cors",
        body: JSON.stringify({
          name: name,
          age: age,
        }),
      });
      if (!result.ok) {
        throw Error(`Failed to create user: ${result.status}`);
      }

      setName("");
      setAge(0);
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
  <div className="App">
    <header className="App-header">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
    <Form onSubmit={onSubmit} />
    {/* {age} */}
    
    {/* {(() => {
      for (const id of ids) {
        return (<p>{id}</p>);
      }
    })()}
     {(() => {
      for (const name of names) {
        return (<p>{name}</p>);
      }
    })()}
     {(() => {
      for (const age of ages) {
        return (<p>{age}</p>);
      }
    })()}
    {(()=>{
      const usertable=[];
      for (let i=0;i++;){
        usertable.push(<li>{ids[i],names[i],age[i]}</li>)
      }
      return <ul>{usertable}</ul>;
    })()} */}
    
    <ul>
      {userstable.map((user)=>(
       <table>
        <tr>
         <th>{user.name}</th><td><span>,</span>{user.age}</td>
        </tr>
       </table>
        
      ))};
    </ul>
  </div>
);
  
}

export default App;

