import {
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import LogoutButton from "@/components/auth/LogoutButton";
import { useRouter } from "next/navigation";

export default function Sidebar({
  chats,
  currentChat,
  createNewChat,
  handleDeleteChat,
}) {
  const router = useRouter();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}
      <div className="p-5 border-b border-zinc-800">

        <div className="flex items-center gap-3">

          <div className="bg-white text-black p-2 rounded-xl">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              Recall
            </h2>

            <p className="text-sm text-zinc-500">
              AI Workspace
            </p>
          </div>

        </div>

        <button
          onClick={createNewChat}
          className="
            mt-5
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-white
            p-3
            text-sm
            font-medium
            text-black
            transition
            hover:bg-zinc-200
          "
        >
          <Plus size={18} />
          New Chat
        </button>

      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {chats.map((chat) => (

          <div
            key={chat.id}
            onClick={() => router.push(`/chat/${chat.id}`)}
            className={`
              group
              flex
              items-center
              justify-between
              gap-2
              rounded-xl
              px-3
              py-3
              cursor-pointer
              transition
              ${
                currentChat?.id === chat.id
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-900"
              }
            `}
          >

            <div className="flex items-center gap-3 min-w-0">

              <MessageSquare
                size={16}
                className="text-zinc-400 shrink-0"
              />

              <span className="truncate text-sm text-zinc-200">
                {chat.title}
              </span>

            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.id);
              }}
              className="
                opacity-0
                group-hover:opacity-100
                transition
                rounded-md
                p-1
                text-zinc-500
                hover:bg-zinc-700
                hover:text-red-400
              "
            >
              <Trash2 size={15} />
            </button>

          </div>

        ))}

      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4">
        <LogoutButton />
      </div>

    </aside>
  );
}