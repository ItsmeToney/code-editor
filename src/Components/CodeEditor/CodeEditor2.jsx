/* eslint-disable react/prop-types */
import { useCodeMirror } from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { useRef, useState } from "react";

function CodeEditorMirror(prop) {
    const {val , setValue, onRun } = prop
    const [language,setLanguage] = useState(python);
    const ref =useRef(null)
    const { setContainer } = useCodeMirror({
        container:ref.current,
        value:val,
          height:'300px',
          theme:'dark',
          extensions:{language},
          onChange:(value)=>setValue(value),
    },);
    console.log(val);
  return (
    <>
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
            <option value={python}>Python</option>
            <option value={java}>Java</option>
            <option value={cpp}>CPP</option>
          </select>
        </div>
        <div ref={(el)=>{
            ref.current = el;
            setContainer(el)
        }}>
          
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
    </>
  );
}

export default CodeEditorMirror;
