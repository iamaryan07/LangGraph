"use client";

import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex">

      {/* Left Side */}
      <section className="hidden lg:flex flex-1 flex-col justify-center px-24">

        <div className="max-w-2xl">

          <div className="flex items-center gap-3 mb-8">

            <div className="bg-white text-black p-3 rounded-2xl">
              <Sparkles size={28} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Recall
              </h2>

              <p className="text-zinc-500">
                AI Workspace
              </p>
            </div>

          </div>

          <h1 className="text-6xl font-bold leading-tight">
            Build, chat and
            <br />
            automate with AI.
          </h1>

          <p className="mt-6 text-xl text-zinc-400 max-w-xl">
            Personal AI assistant powered by LangGraph,
            Groq, FastAPI, MCP tools, retrieval-augmented
            generation and persistent memory.
          </p>

          <div className="mt-12 space-y-4">

            <Feature text="Persistent conversations" />
            <Feature text="Long-term memory" />
            <Feature text="Web search and RAG" />
            <Feature text="MCP tool integrations" />
            <Feature text="Human approval workflows" />

          </div>

        </div>

      </section>

      {/* Right Side */}
      <section className="flex-1 flex items-center justify-center p-6">

        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-950
            p-8
            shadow-2xl
          "
        >

          <div className="mb-8">

            <h2 className="text-3xl font-semibold">
              Welcome Back
            </h2>

            <p className="mt-2 text-zinc-400">
              Sign in to access your AI workspace.
            </p>

          </div>

          <button
            onClick={handleLogin}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-white
              px-5
              py-4
              text-black
              font-medium
              transition
              hover:bg-zinc-200
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.2 7.1l6.2 5.2C39 36.7 44 31 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>

            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-zinc-500">
            Authentication secured by Supabase
          </p>

        </div>

      </section>

    </main>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-2 rounded-full bg-white" />

      <span className="text-zinc-300">
        {text}
      </span>
    </div>
  );
}