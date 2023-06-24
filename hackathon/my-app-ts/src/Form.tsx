import { useState } from "react";

type Props = {
  onSubmit: (editorname: string, content: string) => void;
};

const Form = (props: Props) => {
  const [editorname, setEditorname] = useState("");
  const [content, setContent] = useState("");
  const [edited, setEdited]=useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(editorname, content);
  };

  return (
    <div className="submitform">
      <form style={{ display: "flex", flexDirection: "column" }} onSubmit={submit}>
      <label className="namelabel">Name: </label>
      <input
        type={"text"}
        value={editorname}
        onChange={(e) => setEditorname(e.target.value)}
      ></input>
      <label>Message: </label>
      <input
        type={"text"}
        style={{ marginBottom: 20 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></input>
      <button type={"submit"}>送信</button>
    </form>
    </div>
    
  );
};

export default Form;