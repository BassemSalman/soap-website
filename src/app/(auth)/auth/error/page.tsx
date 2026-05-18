export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border p-8 shadow-sm text-center">
        <h1 className="mb-4 text-2xl font-semibold">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">
          Something went wrong. Please try signing in again.
        </p>
      </div>
    </div>
  );
}
