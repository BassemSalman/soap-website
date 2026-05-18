export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border p-8 shadow-sm text-center">
        <h1 className="mb-4 text-2xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          A sign-in link has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
