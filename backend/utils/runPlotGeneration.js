const { spawn } = require("child_process");
const path = require("path");

const runPlotGeneration = (analytics, userId) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      "../data_processing/plot_generator_entry.py"
    );

    const python = spawn("E:\\Anaconda3\\python.exe", [scriptPath]);

    let error = "";

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) return reject(error);
      resolve();
    });

    python.stdin.write(
      JSON.stringify({
        analytics,
        user_id: userId
      })
    );

    python.stdin.end();
  });
};

module.exports = { runPlotGeneration };
