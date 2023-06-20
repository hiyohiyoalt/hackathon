import { useState } from "react";
import  "./App";
const Form = (props) => {
  const [name, setName] = useState("");
  
  const[age,setAge]=useState(0);
  const submit = (event) => {
    event.preventDefault()
    props.onSubmit(name,age)
   
  }

  return (
    <form style={{ display: "flex", flexDirection: "column" }} onSubmit={submit}>
      <label>Name: </label>
      <input
        type={"text"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      
      <label>Age: </label>
      <input
        type={"number"}
        value={age}
        onChange={(e) => setAge(e.target.valueAsNumber)}
      ></input>
      <button type={"submit"}>Submit</button>
    </form>
  );
};

export default Form;