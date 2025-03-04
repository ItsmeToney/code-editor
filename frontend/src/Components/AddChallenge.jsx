import { useState } from "react";
import axios from "axios";

export default function AddChallenge() {
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  function handleAddTestCase() {
    setTestCases((prev) => [...prev, { input: "", output: "" }]);
  }

  function handleRemoveTestCase(index) {
    const updatedTestCases = testCases.filter((_, i) => i != index);
    setTestCases(updatedTestCases);
  }

  async function createChallenge(question) {
    try {
      const response = await axios.post(
        "https://code-editor-backend-production-e36d.up.railway.app/questions",
        {
          title: question.title,
          description: question.description,
          testCases: question.testCases,
          functionSignatures: question.functionSignatures,
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log("Error inside AddChallenge component", err);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const title = fd.get("title");
    const description = fd.get("description");

    const functionSignatures = {
      C: fd.get("C"),
      Java: fd.get("Java"),
      Python: fd.get("Python"),
    };
    // console.log(functionSignatures);

    const formattedTestCases = testCases.map((testCase) => {
      return {
        input: JSON.parse(testCase.input),
        output: JSON.parse(testCase.output),
      };
    });
    // console.log(formattedTestCases);
    createChallenge({
      title,
      description,
      testCases: formattedTestCases,
      functionSignatures,
    });
  }
  function handleInputChange(index, field, value) {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center mt-20 p-6 bg-slate-700 text-white w-[90%] max-w-2xl mx-auto rounded-lg shadow-lg tracking-wider"
    >
      <h2 className="text-2xl font-semibold mb-4">Add a Challenge</h2>

      {/* Question Title */}
      <div className="flex flex-col w-full mb-4">
        <label htmlFor="title" className="text-lg font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="p-2 border border-gray-400 rounded-md bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col w-full mb-4">
        <label htmlFor="description" className="text-lg font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="p-2 border border-gray-400 rounded-md bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows="3"
        ></textarea>
      </div>

      {/* Input-Output Section */}
      <div className="flex flex-col w-full mb-4 p-4 bg-slate-600 rounded-md shadow-md">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="input" className="text-lg font-medium">
            Input
          </label>
          <label htmlFor="output" className="text-lg font-medium">
            Output
          </label>
          <button
            type="button"
            className="h-6 w-6 flex justify-center items-center bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAddTestCase}
          >
            +
          </button>
        </div>
        {testCases.map((testCase, index) => {
          return (
            <div key={index} className="flex gap-4 items-center mb-4">
              <input
                type="text"
                id="input"
                name="input"
                value={testCase.input}
                onChange={(e) =>
                  handleInputChange(index, "input", e.target.value)
                }
                className="flex-1 p-2 border border-gray-400 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                id="output"
                name="output"
                value={testCase.output}
                onChange={(e) =>
                  handleInputChange(index, "output", e.target.value)
                }
                className="flex-1 p-2 border border-gray-400 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="h-6 w-6 flex justify-center items-center bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveTestCase(index)}
              >
                -
              </button>
            </div>
          );
        })}
      </div>

      {/* Function Descriptions */}
      <div className="flex flex-col w-full p-4 bg-slate-600 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Function Descriptions</h2>

        {["C", "Java", "Python"].map((lang) => (
          <div key={lang} className="flex flex-col mb-3">
            <label htmlFor={lang} className="text-lg font-medium">
              {lang}
            </label>
            <textarea
              name={lang}
              id={lang}
              className="p-2 border border-gray-400 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="3"
            ></textarea>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all">
        Submit Question
      </button>
    </form>
  );
}
