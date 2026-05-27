"use client";

import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <button
      onClick={handleLogout}
      className="
        flex items-center gap-2
        rounded-xl
        border border-zinc-800
        bg-zinc-950
        px-3 py-2
        text-sm text-zinc-400
        transition-all
        hover:border-zinc-700
        hover:bg-zinc-800
        hover:text-white
      "
    >
      <LogOut size={16} />

      <span className="hidden lg:inline">
        Logout
      </span>
    </button>
  );
}