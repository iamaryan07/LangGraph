"use client";

import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/"
      }
    });

    if (error) {
      console.log(error);
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="   
    w-fit self-start
    flex items-center gap-3
    rounded-xl
    border border-zinc-300
    bg-white
    px-5 py-3
    text-sm font-medium text-zinc-800
    shadow-sm
    transition-all duration-200
    hover:bg-zinc-100
    hover:shadow-md
    active:scale-[0.98]
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

      <span>Continue with Google</span>
    </button>
  );
}
