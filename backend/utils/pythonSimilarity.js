const { spawn } = require("child_process");
const path = require("path");

const runPythonSimilarity = (user1Channels, user2Channels) => {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(
      __dirname,
      "../../data_processing/similarity_engine.py"
    );

    const pythonProcess = spawn(
      "E:\\Anaconda3\\python.exe",   // same Python path you already use
      [pythonScript]
    );

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errorOutput));
      }

      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        reject(new Error("Invalid JSON from Python"));
      }
    });

    // Send data to Python via STDIN
    pythonProcess.stdin.write(
      JSON.stringify({
        user1_channels: user1Channels,
        user2_channels: user2Channels
      })
    );

    pythonProcess.stdin.end();
  });
};

module.exports = { runPythonSimilarity };
