import { logout } from "@/actions/auth";
import "../globals.css";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

export default function AuthLayout({ children }) {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
  );
}
