// import axios from "axios";

// const languageMap = {
//   javascript: 56,
//   python: 116,
//   java: 10,
//   cpp: 1,
//   c: 11,
// };

// export const runCode = async (req, res) => {
//   try {
//     const { sourceCode, language, input = "" } = req.body;

//     if (!sourceCode || !language) {
//       return res.status(400).json({
//         success: false,
//         message: "sourceCode and language are required",
//       });
//     }

//     const compilerId =
//       languageMap[language.toLowerCase()];

//     if (!compilerId) {
//       return res.status(400).json({
//         success: false,
//         message: "Unsupported language",
//       });
//     }

//     // Create Submission
//     const submissionResponse = await axios.post(
//       `${process.env.SPHERE_URL}/submissions`,
//       {
//         compilerId,
//         source: sourceCode,
//         input,
//       },
//       {
//         params: {
//           access_token:
//             process.env.SPHERE_ACCESS_TOKEN,
//         },
//       }
//     );

//     const submissionId =
//       submissionResponse.data.id;

//     // Wait for execution
//     await new Promise(resolve =>
//       setTimeout(resolve, 3000)
//     );

//     // Get execution result
//     const resultResponse = await axios.get(
//       `${process.env.SPHERE_URL}/submissions/${submissionId}`,
//       {
//         params: {
//           access_token:
//             process.env.SPHERE_ACCESS_TOKEN,
//         },
//       }
//     );

//     const result = resultResponse.data;

//     const outputUri =
//       result.result?.streams?.output?.uri;

//     const errorUri =
//       result.result?.streams?.error?.uri;

//     const compileUri =
//       result.result?.streams?.cmpinfo?.uri;

//     let stdout = "";
//     let stderr = "";
//     let compile_output = "";

//     // Fetch Output
//     if (outputUri) {
//       const outputResponse =
//         await axios.get(outputUri);

//       stdout = outputResponse.data;
//     }

//     // Fetch Runtime Error
//     if (errorUri) {
//       const errorResponse =
//         await axios.get(errorUri);

//       stderr = errorResponse.data;
//     }

//     // Fetch Compile Error
//     if (compileUri) {
//       const compileResponse =
//         await axios.get(compileUri);

//       compile_output =
//         compileResponse.data;
//     }

//     return res.status(200).json({
//       success: true,
//       stdout,
//       stderr,
//       compile_output,
//       status:
//         result.result?.status?.name,
//       executionTime:
//         result.result?.time,
//       memory:
//         result.result?.memory,
//     });

//   } catch (err) {
//     console.error(
//       err.response?.data || err.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Execution failed",
//       error:
//         err.response?.data ||
//         err.message,
//     });
//   }
// };















// import axios from "axios";

// const languageMap = {
//   javascript: {
//     language: "nodejs",
//     versionIndex: "4",
//   },
//   python: {
//     language: "python3",
//     versionIndex: "5",
//   },
//   java: {
//     language: "java",
//     versionIndex: "4",
//   },
//   cpp: {
//     language: "cpp17",
//     versionIndex: "1",
//   },
//   c: {
//     language: "c",
//     versionIndex: "5",
//   },
// };

// export const runCode = async (req, res) => {
//   try {
//     const {
//       sourceCode,
//       code,
//       language,
//       stdin = ""
//     } = req.body;
    
//     const finalSourceCode = sourceCode || code;
    
//     if (!finalSourceCode || !language) {
//       return res.status(400).json({
//         success: false,
//         message: "sourceCode and language are required",
//       });
//     }

//     const languageConfig =
//       languageMap[language.toLowerCase()];

//     if (!languageConfig) {
//       return res.status(400).json({
//         success: false,
//         message: "Unsupported language",
//       });
//     }

//     // JDoodle API
//     const response = await axios.post(
//       "https://api.jdoodle.com/v1/execute",
//       {
//         clientId: process.env.JDOODLE_CLIENT_ID,
//         clientSecret:
//           process.env.JDOODLE_CLIENT_SECRET,

//         script: sourceCode,

//         stdin: input,

//         language: languageConfig.language,

//         versionIndex:
//           languageConfig.versionIndex,

//           stdin,

//         compileOnly: false,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         timeout: 30000,
//       }
//     );

//     const result = response.data;

//     return res.status(200).json({
//       success: true,

//       stdout: result.output || "",

//       stderr: "",

//       compile_output:
//         result.error || "",

//       statusCode:
//         result.statusCode,

//       isExecutionSuccess:
//         result.isExecutionSuccess,

//       isCompiled:
//         result.isCompiled,

//       executionTime:
//         result.cpuTime,

//       memory:
//         result.memory,
//     });
//   } catch (err) {
//     console.error(
//       "JDoodle execution error:",
//       err.response?.data || err.message
//     );

//     return res.status(500).json({
//       success: false,

//       message: "Execution failed",

//       error:
//         err.response?.data ||
//         err.message,
//     });
//   }
// };

export { runCode } from "./codeExecutionController.js";
