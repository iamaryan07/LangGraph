export default function TypingLoader() {
  return (
    <div className="flex items-center gap-2 px-4">
      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />

      <div
        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
        style={{
          animationDelay: "0.15s",
        }}
      />

      <div
        className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
        style={{
          animationDelay: "0.3s",
        }}
      />
    </div>
  );
}