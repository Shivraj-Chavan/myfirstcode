

// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const SPHERE_URL = process.env.SPHERE_URL;
// const ACCESS_TOKEN = process.env.SPHERE_ACCESS_TOKEN;

// const languageMap = {
//   javascript: 56,
//   python: 116,
//   java: 10,
//   cpp: 1,
//   c: 11,
// };

// export const runCode = async (req, res) => {
//   try {
//     const { code, language, stdin = "" } = req.body;

//     const compilerId = languageMap[language.toLowerCase()];

//     if (!compilerId) {
//       return res.status(400).json({
//         message: "Unsupported language",
//       });
//     }

//     // Create submission
//     const submission = await axios.post(
//       `${SPHERE_URL}/submissions`,
//       {
//         sourceCode: code,
//         compilerId,
//         input: stdin,
//       },
//       {
//         params: {
//           access_token: ACCESS_TOKEN,
//         },
//       }
//     );

//     const submissionId = submission.data.id;

//     // Wait for execution
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // Get result
//     const result = await axios.get(
//       `${SPHERE_URL}/submissions/${submissionId}`,
//       {
//         params: {
//           access_token: ACCESS_TOKEN,
//         },
//       }
//     );
//     console.log(JSON.stringify(result.data, null, 2));
//     res.json(result.data);
//   } catch (err) {
//     console.log(err.response?.data || err.message);

//     res.status(500).json({
//       message: "Execution failed",
//       error: err.response?.data || err.message,
//     });
//   }
// };

import axios from "axios";

const PISTON_URL = process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";
const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";

const languageMap = {
  javascript: {
    piston: { language: "javascript", version: "*", file: "index.js" },
    wandbox: "nodejs-head",
    jdoodle: { language: "nodejs", versionIndex: "4" },
  },
  python: {
    piston: { language: "python", version: "*", file: "main.py" },
    wandbox: "cpython-head",
    jdoodle: { language: "python3", versionIndex: "5" },
  },
  java: {
    piston: { language: "java", version: "*", file: "Main.java" },
    wandbox: "openjdk-head",
    jdoodle: { language: "java", versionIndex: "4" },
  },
  cpp: {
    piston: { language: "c++", version: "*", file: "main.cpp" },
    wandbox: "gcc-head",
    jdoodle: { language: "cpp17", versionIndex: "1" },
  },
  c: {
    piston: { language: "c", version: "*", file: "main.c" },
    wandbox: "gcc-head-c",
    jdoodle: { language: "c", versionIndex: "5" },
  },
};

function getJavaFilename(sourceCode) {
  const match = sourceCode.match(/public\s+class\s+([A-Za-z_$][A-Za-z0-9_$]*)/);
  return match ? `${match[1]}.java` : "Main.java";
}

async function executeWithPiston(config, sourceCode, stdin, langKey) {
  const startTime = Date.now();
  const filename = langKey === "java" ? getJavaFilename(sourceCode) : config.piston.file;

  const response = await axios.post(
    PISTON_URL,
    {
      language: config.piston.language,
      version: config.piston.version,
      files: [{ name: filename, content: sourceCode }],
      stdin,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    }
  );

  const elapsed = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
  const data = response.data || {};
  const compile = data.compile || null;
  const run = data.run || {};

  const compileCode = compile?.code ?? 0;
  const compileOutput =
    compileCode !== 0
      ? compile?.stderr || compile?.output || compile?.stdout || ""
      : compile?.stderr || "";

  const stdout = compileCode === 0 ? run.stdout || "" : "";
  const stderr = compileCode === 0 ? run.stderr || "" : "";
  const exitCode = compileCode !== 0 ? compileCode : run.code ?? 0;
  const isSuccess = compileCode === 0 && exitCode === 0 && !run.signal;

  let status = "Accepted (Piston)";
  if (compileCode !== 0) {
    status = "Compilation Error";
  } else if (run.signal) {
    status = `Terminated (${run.signal})`;
  } else if (exitCode !== 0) {
    status = `Runtime Error (exit ${exitCode})`;
  }

  return {
    success: true,
    engine: "piston",
    stdout,
    stderr,
    compile_output: compileOutput,
    output: stdout || stderr || compileOutput,
    error: stderr || compileOutput,
    status,
    statusCode: exitCode,
    isExecutionSuccess: isSuccess,
    isCompiled: compileCode === 0,
    executionTime: elapsed,
    memory: null,
  };
}

async function executeWithWandbox(config, sourceCode, stdin, langKey) {
  const startTime = Date.now();
  // Wandbox compiles Java inside prog.java, so remove `public` modifier on top-level class to allow any class name
  const preparedCode =
    langKey === "java"
      ? sourceCode.replace(/public\s+class\s+/g, "class ")
      : sourceCode;

  const response = await axios.post(
    WANDBOX_URL,
    {
      compiler: config.wandbox,
      code: preparedCode,
      stdin,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 25000,
    }
  );

  const elapsed = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
  const data = response.data || {};
  const exitStatus = Number(data.status ?? 0);
  const compileOutput = data.compiler_error || data.compiler_message || "";
  const stdout = data.program_output || "";
  const stderr = data.program_error || "";
  const hasCompileError = Boolean(data.compiler_error) && !stdout && exitStatus !== 0;

  let status = "Accepted (Piston)";
  if (hasCompileError) {
    status = "Compilation Error";
  } else if ( data.signal ) {
    status = `Terminated (${data.signal})`;
  } else if (exitStatus !== 0) {
    status = `Runtime Error (exit ${exitStatus})`;
  }

  return {
    success: true,
    engine: "wandbox",
    stdout,
    stderr,
    compile_output: compileOutput,
    output: stdout || stderr || compileOutput,
    error: stderr || compileOutput,
    status,
    statusCode: exitStatus,
    isExecutionSuccess: exitStatus === 0,
    isCompiled: !hasCompileError,
    executionTime: elapsed,
    memory: null,
  };
}

async function executeWithJDoodle(config, sourceCode, stdin) {
  const response = await axios.post(
    JDOODLE_URL,
    {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: sourceCode,
      stdin,
      language: config.jdoodle.language,
      versionIndex: config.jdoodle.versionIndex,
      compileOnly: false,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  const result = response.data || {};
  const isSuccess = result.isExecutionSuccess !== false && !result.error;

  return {
    success: true,
    engine: "jdoodle",
    stdout: result.output || "",
    stderr: "",
    compile_output: result.error || "",
    output: result.output || "",
    error: result.error || "",
    status: isSuccess ? "Accepted" : "Execution Error",
    statusCode: result.statusCode,
    isExecutionSuccess: isSuccess,
    isCompiled: result.isCompiled,
    executionTime: result.cpuTime ? `${result.cpuTime}s` : undefined,
    memory: result.memory,
  };
}

export const runCode = async (req, res) => {
  try {
    const {
      sourceCode,
      code,
      language,
      input = "",
      stdin = "",
    } = req.body || {};

    const finalSourceCode = sourceCode ?? code;
    const finalStdin = stdin || input || "";

    if (!finalSourceCode || !language) {
      return res.status(400).json({
        success: false,
        message: "code (or sourceCode) and language are required",
      });
    }

    const langKey = String(language).toLowerCase().trim();
    const languageConfig = languageMap[langKey];

    if (!languageConfig) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language: ${language}`,
      });
    }

    // 1. Primary: Piston Free API
    try {
      const pistonResult = await executeWithPiston(
        languageConfig,
        finalSourceCode,
        finalStdin,
        langKey
      );
      return res.status(200).json(pistonResult);
    } catch (pistonErr) {
      console.warn(
        "Piston execution unavailable, trying fallback compiler:",
        pistonErr.response?.data || pistonErr.message
      );
    }

    // 2. Fallback #1: Wandbox Free Compiler API
    try {
      const wandboxResult = await executeWithWandbox(
        languageConfig,
        finalSourceCode,
        finalStdin,
        langKey
      );
      return res.status(200).json(wandboxResult);
    } catch (wandboxErr) {
      console.warn(
        "Wandbox fallback unavailable:",
        wandboxErr.response?.data || wandboxErr.message
      );
    }

    // 3. Fallback #2: JDoodle (if credentials are configured)
    if (process.env.JDOODLE_CLIENT_ID && process.env.JDOODLE_CLIENT_SECRET) {
      const jdoodleResult = await executeWithJDoodle(
        languageConfig,
        finalSourceCode,
        finalStdin
      );
      return res.status(200).json(jdoodleResult);
    }

    return res.status(502).json({
      success: false,
      message: "Compiler service is temporarily busy. Please try again in a moment.",
    });
  } catch (err) {
    console.error(
      "Code execution error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,
      message: "Execution failed",
      error: err.response?.data || err.message,
    });
  }
};
