// import { useState } from "react";

// export default function AdminInterface() {
//   const [question, setQuestion] = useState({
//     title: "",
//     description: "",
//     testCases: [{ input: "", output: "" }],
//     functionSignatures: { C: "", Java: "", Python: "" },
//   });

//   // Handle input changes
//   //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//   //     const { name, value } = e.target;
//   //     setQuestion((prev) => ({
//   //       ...prev,
//   //       [name]: value,
//   //     }));
//   //   };

//   //   // Handle test case input
//   //   const handleTestCaseChange = (index: number, field: "input" | "output", value: string) => {
//   //     const updatedTestCases = [...question.testCases];
//   //     updatedTestCases[index][field] = value;
//   //     setQuestion((prev) => ({ ...prev, testCases: updatedTestCases }));
//   //   };

//   //   // Add new test case
//   //   const addTestCase = () => {
//   //     setQuestion((prev) => ({
//   //       ...prev,
//   //       testCases: [...prev.testCases, { input: "", output: "" }],
//   //     }));
//   //   };

//   //   // Handle function signature input
//   //   const handleSignatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//   //     const { name, value } = e.target;
//   //     setQuestion((prev) => ({
//   //       ...prev,
//   //       functionSignatures: {
//   //         ...prev.functionSignatures,
//   //         [name]: value,
//   //       },
//   //     }));
//   //   };

//   //   // Submit form data
//   //   const handleSubmit = (e: React.FormEvent) => {
//   //     e.preventDefault();
//   //     console.log("Submitted Data:", question);
//   //     // Send the data to backend API
//   //   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-4">Add Question</h2>
//       <form className="space-y-4">
//         <input
//           type="text"
//           name="title"
//           placeholder="Question Title"
//           //   value={question.title}
//           //   onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Question Description"
//           //   value={question.description}
//           //   onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <h3 className="text-lg font-bold">Test Cases</h3>
//         {question.testCases.map((testCase, index) => (
//           <div key={index} className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="Input"
//               //   value={testCase.input}
//               //   onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
//               className="p-2 border rounded flex-1"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Expected Output"
//               //   value={testCase.output}
//               //   onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
//               className="p-2 border rounded flex-1"
//               required
//             />
//             <button
//               type="button"
//               className="p-2 bg-green-500 text-white rounded"
//             >
//               +
//             </button>
//           </div>
//         ))}

//         <h3 className="text-lg font-bold">Function Signatures</h3>
//         <textarea
//           name="C"
//           placeholder="Function Signature for C"
//           //   value={question.functionSignatures.C}
//           //   onChange={handleSignatureChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="Java"
//           placeholder="Function Signature for Java"
//           //   value={question.functionSignatures.Java}
//           //   onChange={handleSignatureChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="Python"
//           placeholder="Function Signature for Python"
//           //   value={question.functionSignatures.Python}
//           //   onChange={handleSignatureChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full p-2 bg-blue-600 text-white rounded"
//         >
//           Submit Question
//         </button>
//       </form>
//     </div>
//   );
// }
