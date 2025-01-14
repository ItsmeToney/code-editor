import { useState } from "react";
import CodeEditor from "../../Components/CodeEditor/CodeEditor";
import Timer from "../../Components/Timer/Timer";

function ExamPage() {
  const [code, setCode] = useState();
const handleRun = ()=>{
    console.log(code)
}

const handleTimeOut = ()=>{
    console.log('time our')
    
}

  return (
    // <FullScreenWrapper>
    <div className="bg-slate-100 w-full h-full px-5">
      <div className="py-3 flex justify-between items-center sticky top-0 bg-slate-100">
        <div>
          <h1 className="text-lg font-semibold">CST333</h1>
          <h1 className="text-3xl font-bold">OOPS in Java lab examination</h1>
        </div>
        <div>
          <Timer hour={.5} onTimeUp={handleTimeOut}/>
          <div className="px-4 py-2 bg-red-500 text-white rounded-md flex justify-center">
            Submit
          </div>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium m-1">Qustion 1</h1>
          <h1 className="text-lg text-red-500 font-medium">5 Marks</h1>
        </div>
        <div>
          <h1 className="m-1 text-lg">
            Write a C program to print sum of 2 numbers
          </h1>
          <h1>Test cases</h1>
          <ul className="list-disc pl-10">
            <li>tc1</li>
            <li>tc1</li>
            <li>tc1</li>
            <li>tc1</li>
          </ul>
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <div>
          <CodeEditor value={code} setValue={setCode} onRun={handleRun}/>
        </div>
      </div>
      <div className="h-14">
      </div>
    </div>
    //</FullScreenWrapper>
  );
}

export default ExamPage;
