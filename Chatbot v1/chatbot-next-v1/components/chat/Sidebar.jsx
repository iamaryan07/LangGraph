import {
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";

export default function Sidebar({
  chats,
  currentChat,
  loadChat,
  createNewChat,
}) {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          
          <div className="bg-white text-black p-2 rounded-xl">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              Chatbot
            </h2>

            <p className="text-sm text-zinc-400">
              AI Workspace
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 transition p-3 rounded-2xl text-sm font-medium"
        >
          <Plus size={18} />

          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => loadChat(chat)}
            className={`
              w-full flex items-center gap-3 transition p-4 rounded-2xl text-left
              ${
                currentChat?.id === chat.id
                  ? "bg-zinc-800"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }
            `}
          >
            <MessageSquare size={18} />

            <span className="text-sm text-zinc-300 truncate">
              {chat.title}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">
        <div className="bg-zinc-900 rounded-2xl p-4">
          <p className="text-sm text-zinc-400">
            Powered by LangGraph + FastAPI
          </p>
        </div>
      </div>

    </aside>
  );
}