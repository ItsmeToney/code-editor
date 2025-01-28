const { exec } = require("child_process");
const fs = require("fs");
console.log("Test");

const codeExecution = async (req, res) => {
  const { code, language, testCases } = req.body;
  console.log(req.body);

  let fileName, compileCommand, runCommand;

  // Determine file extension and commands based on language
  if (language === "C") {
    fileName = "Main.c";
    compileCommand = "gcc Main.c -o Main.exe"; // Use .exe on Windows
    runCommand = "Main.exe"; // Execute without `./`
  } else if (language === "Java") {
    fileName = "Main.java";
    compileCommand = "javac Main.java";
    runCommand = "java Main";
  } else if (language === "Python") {
    fileName = "Main.py";
    compileCommand = null; // No compilation needed
    runCommand = "python Main.py";
  } else {
    return res.status(400).json({ error: "Unsupported language" });
  }

  console.log(fileName, compileCommand, runCommand);
  try {
    // Write the code to a temporary file
    fs.writeFileSync(fileName, code);

    // Compile if necessary
    if (compileCommand) {
      await execPromise(compileCommand).catch((err) => {
        console.error("Compilation Error:", err);
        throw new Error(`Compilation failed: ${err}`);
      });
    }

    let testResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const { input, expectedOutput } = testCases[i];

      const output = await execPromiseWithInput(runCommand, input);

      // Compare actual output with expected output
      const isPassed = output.trim() === expectedOutput.trim();

      testResults.push({
        testCase: i + 1,
        input,
        expectedOutput,
        actualOutput: output.trim(),
        passed: isPassed,
      });
    }

    // Cleanup temp files
    cleanupTempFiles(language);

    console.log(testResults);
    res.json({ results: testResults });
  } catch (error) {
    cleanupTempFiles(language);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to execute commands and return promise
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });
  });
};

// Helper function to execute a command with input
const execPromiseWithInput = (command, input) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message);
      else resolve(stdout);
    });

    // Send input to the process
    if (process.stdin) {
      process.stdin.write(input + "\n");
      process.stdin.end();
    }
  });
};

// Cleanup function to remove temp files
const cleanupTempFiles = (language) => {
  try {
    fs.unlinkSync(
      `Main.${language === "C" ? "c" : language === "Java" ? "java" : "py"}`
    );
    if (language === "C") {
      // fs.unlinkSync("Main");
      fs.unlinkSync("Main.exe");
    } // Remove compiled binary
    if (language === "Java") fs.unlinkSync("Main.class"); // Remove compiled Java class
  } catch (err) {
    console.error("Cleanup Error:", err.message);
  }
};

module.exports = codeExecution;
