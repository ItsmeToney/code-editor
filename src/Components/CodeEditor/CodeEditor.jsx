/* eslint-disable react/prop-types */
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

function CodeEditor(props) {
  //const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");

  const {
    value,
    setValue,
    onRun,
  } = props;

  return (
    <div className="rounded-lg overflow-clip ">
      <div className="bg-[#333333]">
        <h1 className="text-white px-2 py-2">Code Editor</h1>
      </div>
      <div className="bg-[#1E1E1E] border-b border-[#333333]">
        <select
          className="bg-[#1E1E1E] text-white px-3 py-2 hover:cursor-pointer focus:outline-none "
          value={language}
          onChange={(evnt) => {
            setLanguage(evnt.target.value);
            console.log(evnt.target.value);
          }}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      <div>
        <Editor
          line={5}
          theme="vs-dark"
          width="96vw"
          height="50vh"
          defaultLanguage={language}
          defaultValue={value}
          onChange={(value) => {
            setValue(value);
          }}
        />
      </div>
      <div className="bg-[#1E1E1E] p-2 flex justify-end border-t border-[#333333]">
        <button
          className="bg-green-600 px-4 w-36 py-1 text-white  rounded-lg"
          onClick={onRun}
        >
          Run
        </button>
      </div>
    </div>
  );
}

export default CodeEditor;
