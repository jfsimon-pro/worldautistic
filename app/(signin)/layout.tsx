export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
