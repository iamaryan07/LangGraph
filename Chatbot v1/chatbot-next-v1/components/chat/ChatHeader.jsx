import { Sparkles } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="border-b border-zinc-800 px-6 py-4">

      <div className="flex items-center gap-3">

        <div className="bg-white text-black p-2 rounded-xl">
          <Sparkles size={18} />
        </div>

        <h1 className="font-semibold text-lg">
          AI Assistant
        </h1>

      </div>

    </header>
  );
}