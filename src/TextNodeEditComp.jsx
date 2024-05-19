import { useState } from "react";

// component to edit selected node
export default function TextNodeEditComp({
  data,
  id,
  onUpdateNode,
  onUpdateCancelNode,
}) {
  const [value, setValue] = useState(data["value"]);

  return (
    <div className="text-node-edit">
      <div className="text-node-edit-header">
        {/* back button will cancel edit operation */}
        <img
          width="15"
          height="15"
          src="https://img.icons8.com/ios-filled/50/long-arrow-left.png"
          alt="long-arrow-left"
          onClick={() => onUpdateCancelNode(id)}
          style={{ cursor: "pointer" }}
        />
        {data["label"]}
        <div></div>
      </div>
      {/* form to submit text/message of selected node */}
      <form
        action="#"
        style={{ padding: "10px", borderBottom: "2px solid #eee" }}
      >
        <div style={{ color: "gray", marginBottom: "5px" }}>Text</div>
        <textarea
          onInput={(event) => {
            setValue(event.target.value);
          }}
          placeholder={data["placeholder"]}
          value={value}
          autoFocus
        />
        <button onClick={() => onUpdateNode(id, value)}>Update</button>
      </form>
    </div>
  );
}
