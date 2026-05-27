export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />

        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-white">
            Authenticating
          </p>

          <p className="text-xs text-zinc-400">
            Checking your session...
          </p>
        </div>
      </div>
    </div>
  );
}