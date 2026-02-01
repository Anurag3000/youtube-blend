const { spawn } = require("child_process");
const path = require("path");

const runAnalyticsGeneration = (userData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      "../data_processing/generate_analytics_entry.py"
    );

    const python = spawn("E:\\Anaconda3\\python.exe", [scriptPath]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) return reject(error);

      try {
        resolve(JSON.parse(output));
      } catch {
        reject("Invalid analytics JSON from Python");
      }
    });

    python.stdin.write(JSON.stringify(userData));
    python.stdin.end();
  });
};

module.exports = { runAnalyticsGeneration };
