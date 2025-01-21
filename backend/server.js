import express from "express";
import pkg from "body-parser";
import cors from "cors";
import { exec } from "child_process";
import { writeFileSync,unlinkSync } from "fs";
import { basename, join } from "path";

const { json } = pkg;

const app = express();
app.use(cors());
app.use(json());

const LANGUAGE_EXTENSIONS = {
  python: "py",
  java: "java",
  cpp: "cpp",
};

const LANGUAGE_EXEC_COMMANDS = {
  python: (filename) => `python ${filename}`,
  java: (filename) =>
    `javac ${filename} && java ${basename(filename, ".java")}`,
  cpp: (filename) => `g++ ${filename} -o ${filename}.out && ./${filename}.out`,
};

app.post("/execute", async (req, res) => {
  const { language, code, testCases } = req.body;

  if (!LANGUAGE_EXTENSIONS[language]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const extension = LANGUAGE_EXTENSIONS[language];
  const tempFilePath = join("./exam_test", `code.${extension}`);

  writeFileSync(tempFilePath, code);

  const command = LANGUAGE_EXEC_COMMANDS[language](tempFilePath);

  try {
    // Function to execute a test case
    const executeTestCase = (input, expectedOutput) => {
      return new Promise((resolve, reject) => {

        const tempInputPath = join("./exam_test", "temp_input.txt");
        writeFileSync(tempInputPath, input);

        const testCommand = `powershell -Command "Get-Content ${tempInputPath} | ${command}`;

        exec(testCommand, (error, stdout, stderr) => {
          if (error) {
            reject({ input, success: false, output: stderr.trim() });
          } else {
            const result = {
              input,
              success: stdout.trim() === expectedOutput.trim(),
              output: stdout.trim(),
              expectedOutput,
            };
            unlinkSync(tempInputPath)
            resolve(result);
          }
        });
      });
    };

    const results = [];
    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;
      try {
        const result = await executeTestCase(input, expectedOutput);
        results.push(result);
      } catch (err) {
        results.push(err); // If error occurs, push the error result
      }
    }

    unlinkSync(tempFilePath); // Clean up the temporary file after all test cases

    // Send the results after all test cases are processed
    res.json({ results });
  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ error: "Execution error" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
