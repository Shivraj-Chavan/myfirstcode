

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

const languageMap = {
  javascript: {
    language: "nodejs",
    versionIndex: "4",
  },
  python: {
    language: "python3",
    versionIndex: "5",
  },
  java: {
    language: "java",
    versionIndex: "4",
  },
  cpp: {
    language: "cpp17",
    versionIndex: "1",
  },
  c: {
    language: "c",
    versionIndex: "5",
  },
};

export const runCode = async (req, res) => {
  try {
    const {
      sourceCode,
      language,
      input = "",
      stdin
    } = req.body;

    const finalSourceCode = sourceCode || code;

    if (!finalSourceCode || !language) {
      return res.status(400).json({
        success: false,
        message: "sourceCode and language are required",
      });
    }

    const languageConfig =
      languageMap[language.toLowerCase()];

    if (!languageConfig) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language",
      });
    }

    // JDoodle API
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret:
          process.env.JDOODLE_CLIENT_SECRET,

        script: sourceCode,

        stdin: input,

        language: languageConfig.language,

        versionIndex:
          languageConfig.versionIndex,

          stdin,

        compileOnly: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const result = response.data;

    return res.status(200).json({
      success: true,

      stdout: result.output || "",

      stderr: "",

      compile_output:
        result.error || "",

      statusCode:
        result.statusCode,

      isExecutionSuccess:
        result.isExecutionSuccess,

      isCompiled:
        result.isCompiled,

      executionTime:
        result.cpuTime,

      memory:
        result.memory,
    });
  } catch (err) {
    console.error(
      "JDoodle execution error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      success: false,

      message: "Execution failed",

      error:
        err.response?.data ||
        err.message,
    });
  }
};