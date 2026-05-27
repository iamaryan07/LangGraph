import { MessageSquare, Plus, Sparkles, Trash2 } from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import { useRouter } from "next/navigation";


export default function Sidebar({
  chats,
  currentChat,
  createNewChat,
  handleDeleteChat
}) {

  const router = useRouter()

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-zinc-800 bg-zinc-950">

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
          <div
            key={chat.id}
            onClick={() => router.push(`/chat/${chat.id}`)}
            className={`
              w-full flex items-center justify-between
              gap-3 transition p-4 rounded-2xl cursor-pointer
              ${
                currentChat?.id === chat.id
                  ? "bg-zinc-800"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MessageSquare size={18} />

              <span className="text-sm text-zinc-300 truncate">
                {chat.title}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();

                handleDeleteChat(chat.id);
              }}
              className="
                rounded-md p-1
                text-zinc-500 transition
                hover:bg-zinc-700
                hover:text-red-400
              "
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">
        <div className="rounded-2xl bg-zinc-900 p-4">
          
          <div className="flex items-center justify-between">
            
            <div className="flex-1 pr-4">
              {/* <p className="text-sm font-medium text-zinc-200">
                AI Workspace
              </p> */}

              <p className="text-xs text-zinc-500">
                Powered by LangGraph + FastAPI
              </p>
            </div>

            <LogoutButton />

          </div>

        </div>
      </div>

    </aside>
  );
}