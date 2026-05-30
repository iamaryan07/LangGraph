"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="
        w-full
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-zinc-800
        bg-zinc-950
        px-4
        py-3
        text-sm
        text-zinc-400
        transition
        hover:bg-zinc-800
        hover:text-white
        hover:border-zinc-700
      "
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}