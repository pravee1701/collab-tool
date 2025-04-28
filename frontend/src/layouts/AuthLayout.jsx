export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-md">
          {children}
        </div>
      </div>
    );
  }
  