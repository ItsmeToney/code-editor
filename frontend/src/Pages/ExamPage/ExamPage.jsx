import { useState, useEffect } from "react";
import Timer from "../../Components/Timer/Timer";
import CodeEditor from "../../Components/CodeEditor/CodeEditor";
import axios from "axios";
import FullScreenWrapper from "../../Components/FullScreenWrapper/FullScreenWrapper";

function ExamPage() {
  const [code, setCode] = useState(""); // Only function body
  const [language, setLanguage] = useState("C");
  const [question, setQuestion] = useState(null);

  const [result, setResult] = useState([]);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await axios.get("http://localhost:5000/questions");
        const questions = response.data.data;
        const index = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[index];
        console.log(selectedQuestion);

        setQuestion({
          id: selectedQuestion._id,
          title: selectedQuestion.title,
          description: selectedQuestion.description,
          testCases: selectedQuestion.testCases,
        });

        setResult(
          selectedQuestion.testCases.map((testCase) => ({
            input: testCase.input,
            expectedOutput: testCase.output,
            output: "N/A",
            success: null,
          }))
        );
        console.log(result);
      } catch (err) {
        console.log("Error fetching question:", err);
      }
    }

    fetchQuestion();
  }, []);

  useEffect(() => {
    async function fetchFunctionSignature() {
      try {
        const signatureResponse = await axios.get(
          `http://localhost:5000/questions/${question.id}/${language}`
        );
        setCode(signatureResponse.data.functionSignature);
      } catch (err) {
        console.log(err);
      }
    }

    fetchFunctionSignature();
  }, [language, question]);

  const handleRun = async (language) => {
    if (!question) return;

    try {
      const data = {
        questionId: question.id,
        language,
        functionCode: code,
        testCases: question.testCases, // Only send function body
      };
      console.log(data);
      const response = await axios.post("http://localhost:5000/execute", data);

      const { results } = response.data;
      setResult(
        results.map((res) => ({
          input: res.input,
          expectedOutput: res.expectedOutput,
          output: res.actualOutput,
          success: res.passed,
        }))
      );
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  const handleTimeOut = () => {
    console.log("Time out");
  };

  return (
    <FullScreenWrapper>
      <div className="bg-slate-100 w-full h-full px-5">
        <div className="py-3 flex justify-between items-center sticky top-0 bg-slate-100">
          <div>
            <h1 className="text-lg font-semibold">CST333</h1>
            <h1 className="text-3xl font-bold">Python Lab Examination</h1>
          </div>
          <div>
            <Timer hour={0.5} onTimeUp={handleTimeOut} />
            <button className="px-4 py-2 bg-red-500 text-white rounded-md">
              Submit
            </button>
          </div>
        </div>

        {question && (
          <div className="bg-white p-4 rounded-lg">
            <h1 className="text-3xl font-medium mb-2">{question.title}</h1>
            <p className="text-lg mb-4">{question.description}</p>

            <h2 className="text-xl font-semibold mt-4">Test Cases:</h2>
            <table className="table-auto w-full text-left border">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Input</th>
                  <th className="px-6 py-3">Expected Output</th>
                  <th className="px-6 py-3">Actual Output</th>
                  <th className="px-6 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {result.map((testCase, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-3">
                      {Array.isArray(testCase.input)
                        ? testCase.input.join(", ")
                        : testCase.input}
                    </td>
                    <td className="px-6 py-3">
                      {testCase.expectedOutput.toString()}
                    </td>
                    <td className="px-6 py-3">{testCase.output || "N/A"}</td>
                    <td className="px-6 py-3">
                      {testCase.success === null ? (
                        <span className="text-gray-500">Pending</span>
                      ) : testCase.success ? (
                        <span className="text-green-500">Pass</span>
                      ) : (
                        <span className="text-red-500">Fail</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <CodeEditor
                value={code}
                setValue={setCode}
                language={language}
                setLanguage={setLanguage}
                onRun={handleRun}
              />
            </div>
          </div>
        )}

        <div className="h-14"></div>
      </div>
    </FullScreenWrapper>
  );
}

export default ExamPage;
