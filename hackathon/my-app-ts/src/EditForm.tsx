import { useState } from "react";

type Props = {
  onUpdate: (reid: string, recontent: string) => void;
};

const EditForm = (props: Props) => {
  const [recontent, setRecontent] = useState("");
  const [reid, setReid]=useState("");

  const update = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onUpdate(reid, recontent);
  };

  return (
    <form className="editform" style={{ display: "flex", flexDirection: "column" }} onSubmit={update}>
      <label className="label">Id: </label>
      <input
        type={"text"}
        value={reid}
        onChange={(e) => setReid(e.target.value)}
      ></input>
      <label className="label">Edit: </label>
      <input
        type={"text"}
        style={{ marginBottom: 20 }}
        value={recontent}
        onChange={(e) => setRecontent(e.target.value)}
      ></input>
      <button type={"submit"}>編集</button>
    </form>
  );
};

export default EditForm;