import { useState } from "react";
import Timer from "../../Components/Timer/Timer";
import CodeEditor from "../../Components/CodeEditor/CodeEditor";
import axios from "axios";
import FullScreenWrapper from "../../Components/FullScreenWrapper/FullScreenWrapper";

function ExamPage() {
  const [code, setCode] = useState();
  const [result, setResult] = useState([
    { input: "15\n12", expectedOutput: "180", output: "", success: false },
    { input: "5\n7", expectedOutput: "35", output: "", success: false },
    { input: "0\n0", expectedOutput: "0", output: "", success: false },
  ]);

  const testCases = [
    {
      input: "15\n12",
      expectedOutput: "180",
    },
    {
      input: "5\n7",
      expectedOutput: "35",
    },
    {
      input: "0\n0",
      expectedOutput: "0",
    },
  ];

  const handleRun = async (language) => {
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        language: language,
        code: code,
        testCases: testCases,
      });
      const { results } = response.data;
      console.log(results);

      const updatedResults = results.map((res) => ({
        input: res.input,
        expectedOutput: res.expectedOutput,
        output: res.actualOutput,
        success: res.passed,
      }));

      setResult(updatedResults);
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  const handleTimeOut = () => {
    console.log("time our");
  };

  return (
    <FullScreenWrapper>
      <div className="bg-slate-100 w-full h-full px-5">
        <div className="py-3 flex justify-between items-center sticky top-0 bg-slate-100">
          <div>
            <h1 className="text-lg font-semibold">CST333</h1>
            <h1 className="text-3xl font-bold">Python lab examination</h1>
          </div>
          <div>
            <Timer hour={0.5} onTimeUp={handleTimeOut} />
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
              Write a Python program to print product of 2 numbers
            </h1>
            <table className="table-auto w-full text-left">
              <thead className="text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Test Case</th>
                  <th className="px-6 py-3">Expected Output</th>
                  <th className="px-6 py-3">Actual Output</th>
                  <th className="px-6 py-3">Pass/Fail</th>
                </tr>
              </thead>
              <tbody>
                {result.map((testCase, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-3">{testCase.input}</td>
                    <td className="px-6 py-3">{testCase.expectedOutput}</td>
                    <td className="px-6 py-3">{testCase.output || "N/A"}</td>
                    <td className="px-6 py-3">
                      {testCase.success ? (
                        <span className="text-green-500">Pass</span>
                      ) : (
                        <span className="text-red-500">Fail</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 flex justify-between">
          <div>
            {
              <CodeEditor value={code} setValue={setCode} onRun={handleRun} />
              //<CodeEditorMirror val={code} setValue={setCode} onRun={handleRun} />
            }
          </div>
        </div>

        <div className="h-14"></div>
      </div>
    </FullScreenWrapper>
  );
}

export default ExamPage;
