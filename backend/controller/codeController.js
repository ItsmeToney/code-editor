// const { exec } = require("child_process");
// const fs = require("fs");

// const codeExecution = async (req, res) => {
//   const { code, language, testCases } = req.body;
//   console.log(req.body);

//   let fileName, compileCommand, runCommand;

//   // Determine file extension and commands based on language
//   if (language === "C") {
//     fileName = "Main.c";
//     compileCommand = "gcc Main.c -o Main.exe"; // Use .exe on Windows
//     runCommand = "Main.exe"; // Execute without `./`
//   } else if (language === "Java") {
//     fileName = "Main.java";
//     compileCommand = "javac Main.java";
//     runCommand = "java Main";
//   } else if (language === "Python") {
//     fileName = "Main.py";
//     compileCommand = null; // No compilation needed
//     runCommand = "python Main.py";
//   } else {
//     return res.status(400).json({ error: "Unsupported language" });
//   }

//   console.log(fileName, compileCommand, runCommand);
//   try {
//     // Write the code to a temporary file
//     fs.writeFileSync(fileName, code);

//     // Compile if necessary
//     if (compileCommand) {
//       await execPromise(compileCommand).catch((err) => {
//         console.error("Compilation Error:", err);
//         throw new Error(`Compilation failed: ${err}`);
//       });
//     }

//     let testResults = [];

//     for (let i = 0; i < testCases.length; i++) {
//       const { input, expectedOutput } = testCases[i];

//       const output = await execPromiseWithInput(runCommand, input);

//       // Compare actual output with expected output
//       const isPassed = output.trim() === expectedOutput.trim();

//       testResults.push({
//         testCase: i + 1,
//         input,
//         expectedOutput,
//         actualOutput: output.trim(),
//         passed: isPassed,
//       });
//     }

//     // Cleanup temp files
//     cleanupTempFiles(language);

//     console.log(testResults);
//     res.json({ results: testResults });
//   } catch (error) {
//     cleanupTempFiles(language);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Helper function to execute commands and return promise
// const execPromise = (command) => {
//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) reject(stderr || error.message);
//       else resolve(stdout);
//     });
//   });
// };

// // Helper function to execute a command with input
// const execPromiseWithInput = (command, input) => {
//   return new Promise((resolve, reject) => {
//     console.log(`Executing: ${command}`);
//     console.log(`Input:`, input);
//     const process = exec(command, (error, stdout, stderr) => {
//       if (error) reject(stderr || error.message);
//       else resolve(stdout);
//     });

//     // Send input to the process
//     if (process.stdin) {
//       const formattedInput = Array.isArray(input) ? input.join("\n") : input;
//       console.log(formattedInput);
//       process.stdin.write(formattedInput + "\n");

//       process.stdin.end();
//     }
//   });
// };

// // Cleanup function to remove temp files
// const cleanupTempFiles = (language) => {
//   try {
//     fs.unlinkSync(
//       `Main.${language === "C" ? "c" : language === "Java" ? "java" : "py"}`
//     );
//     if (language === "C") {
//       // fs.unlinkSync("Main");
//       fs.unlinkSync("Main.exe");
//     } // Remove compiled binary
//     if (language === "Java") fs.unlinkSync("Main.class"); // Remove compiled Java class
//   } catch (err) {
//     console.error("Cleanup Error:", err.message);
//   }
// };

// module.exports = codeExecution;

//////////////////////////////////////////////////////////////////////////////

const { exec } = require("child_process");
const fs = require("fs");

// Main function to execute code
const codeExecution = async (req, res) => {
  const { functionCode, language, testCases } = req.body;
  console.log("Received Request:", req.body);

  try {
    // Generate the full program with predefined function
    const fullCode = wrapFunction(language, functionCode, testCases);
    console.log("Full code:", fullCode);

    const { fileName, compileCommand, runCommand } =
      getLanguageConfig(language);

    // Write the full code to a temporary file
    fs.writeFileSync(fileName, fullCode);

    // Compile if necessary
    if (compileCommand) {
      await execPromise(compileCommand);
    }

    // Execute test cases
    const testResults = await runTestCases(runCommand, testCases);

    // Cleanup temp files
    cleanupTempFiles(language);

    console.log("Execution Results:", testResults);
    res.json({ results: testResults });
  } catch (error) {
    cleanupTempFiles(language);
    res.status(500).json({ error: error.message });
  }
};

// **1. Wrap the user's function inside a complete program**
const wrapFunction = (language, functionCode, testCases) => {
  console.log(testCases.map((tc) => tc.input));
  let wrappedCode;

  if (language === "C") {
    wrappedCode = `#include <stdio.h>

${functionCode}

int main() {
${testCases
  .map(
    (test, index) => `    int result${index} = solution(${test.input.join(
      ", "
    )});
    printf("%d\\n", result${index});`
  )
  .join("\n")}
    return 0;
}`;
  } else if (language === "Java") {
    wrappedCode = `public class Main {
${functionCode}

public static void main(String[] args) {
${testCases
  .map(
    (test) =>
      `    System.out.println(solution(${
        Array.isArray(test.input)
          ? test.input.map((arg) => JSON.stringify(arg)).join(", ")
          : JSON.stringify(test.input)
      }));`
  )
  .join(" ")}
}}`;
  } else if (language === "Python") {
    wrappedCode = `${functionCode}

if __name__ == "__main__":
${testCases
  .map(
    (test, index) => `    print("Test ${index + 1}:", solution(${test.input}))`
  )
  .join("\n")}`;
  } else {
    throw new Error("Unsupported language");
  }

  return wrappedCode;
};

// **2. Define language-specific configurations**
const getLanguageConfig = (language) => {
  let fileName, compileCommand, runCommand;

  if (language === "C") {
    fileName = "Main.c";
    compileCommand = "gcc Main.c -o Main.exe"; // Compilation command
    runCommand = "Main.exe"; // Execution command
  } else if (language === "Java") {
    fileName = "Main.java";
    compileCommand = "javac Main.java";
    runCommand = "java Main";
  } else if (language === "Python") {
    fileName = "Main.py";
    compileCommand = null; // No compilation needed
    runCommand = "python Main.py";
  } else {
    throw new Error("Unsupported language");
  }

  return { fileName, compileCommand, runCommand };
};

// **3. Execute code for all test cases**
const runTestCases = async (runCommand, testCases) => {
  let testResults = [];

  const resOutput = await execPromise(runCommand);

  // console.log(resOutput.trim().split("\n"));
  const outputArray = resOutput.trim().split("\n");
  console.log(outputArray);

  for (let i = 0; i < testCases.length; i++) {
    const { input, output } = testCases[i];
    console.log("Inside runTestCases function", input, output);

    // const resOutput = await execPromiseWithInput(runCommand, input);

    // Compare actual output with expected output
    const isPassed = outputArray[i].replace("\r", "") === output.trim();

    testResults.push({
      testCase: i + 1,
      input,
      expectedOutput: output,
      actualOutput: outputArray[i].replace("\r", ""),
      passed: isPassed,
    });
  }

  return testResults;
};

// **4. Helper function to execute commands**
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });
  });
};

// **5. Helper function to execute a command with input**
const execPromiseWithInput = (command, input) => {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    console.log(`Input:`, input);
    const process = exec(command, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });

    // Send input to the process
    if (process.stdin) {
      const formattedInput = Array.isArray(input) ? input.join("\n") : input;
      process.stdin.write(formattedInput + "\n");
      process.stdin.end();
    }
  });
};

// **6. Cleanup function to remove temp files**
const cleanupTempFiles = (language) => {
  try {
    fs.unlinkSync(
      `Main.${language === "C" ? "c" : language === "Java" ? "java" : "py"}`
    );
    if (language === "C") {
      fs.unlinkSync("Main.exe"); // Remove compiled C binary
    }
    if (language === "Java") fs.unlinkSync("Main.class"); // Remove compiled Java class
  } catch (err) {
    console.error("Cleanup Error:", err.message);
  }
};

module.exports = codeExecution;
