import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

import {
  Play,
  RotateCcw,
  Lightbulb,
  Terminal,
  Code2,
  ChevronDown,
  Sparkles,
  Cpu,
  BookOpen,
  Copy,
  CheckCircle2,
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

// ===============================
// JUDGE0 CONFIG
// ===============================



// LANGUAGE MAP

const LANGUAGES = [
  {
    label: "JavaScript",
    value: "javascript",
    id: 56,
    icon: "⚡",
    boilerplate: `function solve(){
  console.log("Hello World");
}
solve();`,
  },

  {
    label: "Python",
    value: "python",
    id: 116,
    icon: "🐍",
    boilerplate: `print("Hello World")`,
  },

  {
    label: "Java",
    value: "java",
    id: 10,
    icon: "☕",
    boilerplate: `public class Main{
    public static void main(String args[]){
        System.out.println("Hello World");
    }
}`,
  },

  {
    label: "C++",
    value: "cpp",
    id: 1,
    icon: "⚙️",
    boilerplate: `#include<iostream>
using namespace std;

int main(){
    cout<<"Hello World";
    return 0;
}`,
  },
];

// ===============================
// MAIN COMPONENT
// ===============================

const Playground = () => {

  const [language, setLanguage] =
    useState(LANGUAGES[0]);

  const [code, setCode] =
    useState(language.boilerplate);

  const [input, setInput] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [running, setRunning] =
    useState(false);

  const [hintIndex, setHintIndex] =
    useState(0);

  const [copied, setCopied] =
    useState(false);

  // ===============================
  // CHANGE LANGUAGE
  // ===============================

  useEffect(() => {

    setCode(language.boilerplate);

    setOutput("");

    setHintIndex(0);

  }, [language]);

  // ===============================
  // RUN CODE
  // ===============================

  // const runCode = async () => {
  //   if (running) return;
  
  //   try {
  //     setRunning(true);
  //     setOutput("⚡ Executing code...\n");
  
  //     const response = await axios.post(
  //       ENDPOINT.RUN_CODE,
  //       {
  //         sourceCode: code,
  //         languageId: language.id,
  //         input,
  //       }
  //     );
  
  //     const data = response.data.data;
  
  //     console.log(data);
  
  //     if (!data) {
  //       setOutput("❌ No response received.");
  //       return;
  //     }
  
  //     // Compilation Error
  //     if (data.result?.streams?.error) {
  //       setOutput("❌ Compilation Error");
  //       return;
  //     }
  
  //     // Runtime Error
  //     if (
  //       data.result?.status?.name
  //         ?.toLowerCase()
  //         .includes("runtime")
  //     ) {
  //       setOutput("❌ Runtime Error");
  //       return;
  //     }
  
  //     // Success
  //     setOutput("✅ Program executed successfully");
  //   } catch (err) {
  //     console.log(err);
  
  //     setOutput(
  //       `❌ ${err.response?.data?.message || err.message}`
  //     );
  //   } finally {
  //     setRunning(false);
  //   }
  // };


  const runCode = async () => {
    if (running) return;
  
    try {
      setRunning(true);
      setOutput("⚡ Executing code...");
  
      const { data } = await axios.post(
        ENDPOINT.RUN_CODE,
        {
          sourceCode: code,
          language: language.value,
          input,
        }
      );
  
      if (!data.success) {
        setOutput(`❌ ${data.message}`);
        return;
      }
  
      if (data.compile_output) {
        setOutput(`❌ Compilation Error\n\n ${data.compile_output}`);
        return;
      }
  
      if (data.stderr) {
        setOutput(`❌ Runtime Error\n\n ${data.stderr}`);
        return;
      }
  
      if (!data.stdout) {
        setOutput("✅ Program executed successfully\n\n(No Output)");
        return;
      }
  
      setOutput(data.stdout);
    } catch (err) {
      setOutput(
        `❌ ${ err.response?.data?.message || err.message  }`
      );
    } finally {
      setRunning(false);
    }
  };

  // ===============================
  // RESET
  // ===============================

  const handleReset = () => {

    setCode(language.boilerplate);

    setInput("");

    setOutput("");

    setHintIndex(0);
  };

  // ===============================
  // HINTS
  // ===============================

  const handleHint = () => {

    if (
      hintIndex <
      language.hints.length
    ) {

      setOutput(
        `💡 ${language.hints[hintIndex]}`
      );

      setHintIndex(prev => prev + 1);

    } else {

      setOutput(
        "💡 No more hints"
      );
    }
  };

  // ===============================
  // COPY CODE
  // ===============================

  const copyCode = async () => {

    await navigator.clipboard.writeText(
      code
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (

    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: "#0d0d0d",
        fontFamily:
          "'JetBrains Mono', monospace",
      }}
    >

      {/* =============================== */}
      {/* TOPBAR */}
      {/* =============================== */}

      <div
        className="h-14 border-b border-white/10 flex items-center justify-between px-5"
        style={{
          background: "#111",
        }}
      >

        <div className="flex items-center gap-3">

          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <div className="flex items-center gap-2 ml-3">

            <Code2
              size={18}
              className="text-cyan-400"
            />

            <h1
              className="text-white font-bold text-sm tracking-wider uppercase"
            >
              Playground
            </h1>

          </div>
        </div>

        {/* LANGUAGE SELECT */}

        <div className="relative">

          <select
            value={language.value}
            onChange={(e) => {

              const lang =
                LANGUAGES.find(
                  l =>
                    l.value ===
                    e.target.value
                );

              setLanguage(lang);
            }}
            className="bg-black/40 border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none appearance-none cursor-pointer"
          >

            {LANGUAGES.map(lang => (

              <option
                key={lang.value}
                value={lang.value}
              >
                {lang.icon} {lang.label}
              </option>

            ))}

          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 top-3 text-white/40 pointer-events-none"
          />

        </div>
      </div>

      {/* =============================== */}
      {/* MAIN */}
      {/* =============================== */}

      <div className="flex flex-1 overflow-hidden">

        {/* =============================== */}
        {/* LEFT */}
        {/* =============================== */}

        <div className="flex-1 flex flex-col">

          {/* ACTION BAR */}

          <div
            className="h-14 border-b border-white/10 flex items-center gap-3 px-4"
            style={{
              background: "#111",
            }}
          >

            <button
              onClick={runCode}
              disabled={running}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >

              <Play size={14} />

              {running
                ? "Running..."
                : "Run Code"}

            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-white/10 hover:bg-white/5 transition-all text-white/70 px-4 py-2 rounded-lg text-sm"
            >

              <RotateCcw size={14} />

              Reset

            </button>

            <button
              onClick={handleHint}
              className="flex items-center gap-2 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 transition-all px-4 py-2 rounded-lg text-sm"
            >

              <Lightbulb size={14} />

              Hint

            </button>

            <button
              onClick={copyCode}
              className="flex items-center gap-2 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all px-4 py-2 rounded-lg text-sm"
            >

              {copied
                ? <CheckCircle2 size={14} />
                : <Copy size={14} />}

              {copied
                ? "Copied"
                : "Copy"}

            </button>

          </div>

          {/* MONACO */}

          <div className="flex-1 overflow-hidden">

            <Editor
              height="100%"
              language={language.value}
              value={code}
              onChange={(v) =>
                setCode(v || "")
              }
              theme="vs-dark"
              options={{
                fontSize: 15,
                minimap: {
                  enabled: false,
                },
                smoothScrolling: true,
                fontLigatures: true,
                cursorBlinking: "phase",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />

          </div>

        </div>

        {/* =============================== */}
        {/* RIGHT PANEL */}
        {/* =============================== */}

        <div
          className="w-[360px] border-l border-white/10 flex flex-col"
          style={{
            background: "#111",
          }}
        >

          {/* INPUT */}

          <div className="p-4 border-b border-white/10">

            <div className="flex items-center gap-2 mb-3">

              <Cpu
                size={15}
                className="text-cyan-400"
              />

              <h2 className="text-white text-sm font-semibold">
                Custom Input
              </h2>

            </div>

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder={`Example Input:

                5
                10 20
                hello`}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none resize-none"
            />

          </div>

          {/* OUTPUT */}

          <div className="flex-1 overflow-hidden flex flex-col">

            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">

              <Terminal
                size={15}
                className="text-green-400"
              />

              <h2 className="text-white text-sm font-semibold">
                Output
              </h2>

            </div>

            <div className="flex-1 overflow-y-auto p-4">

            <pre
  className={`text-sm whitespace-pre-wrap leading-relaxed ${
    output.includes("❌")
      ? "text-red-400"
      : output.includes("⏰")
      ? "text-yellow-400"
      : output.includes("💾")
      ? "text-orange-400"
      : "text-green-300"
  }`}
>
  {output}
</pre>
            </div>

          </div>

          {/* TIPS */}

          <div className="p-4 border-t border-white/10">

            <div className="flex items-center gap-2 mb-3">

              <Sparkles
                size={15}
                className="text-yellow-400"
              />

              <h2 className="text-white text-sm font-semibold">
                Tips
              </h2>

            </div>

            <div className="space-y-2 text-xs text-white/50 leading-relaxed">

              <p>
                • Practice DSA & logic building
              </p>

              <p>
                • Use hints if stuck
              </p>

              <p>
                • Test edge cases
              </p>

              <p>
                • Write clean code
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Playground;