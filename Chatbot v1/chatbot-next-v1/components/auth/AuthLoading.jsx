export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="flex flex-col items-center">

        <div
          className="
            h-12
            w-12
            animate-spin
            rounded-full
            border-4
            border-zinc-800
            border-t-white
          "
        />

        <h2 className="mt-6 text-lg font-medium">
          Loading
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Preparing your workspace...
        </p>

      </div>

    </main>
  );
}