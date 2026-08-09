import { AuthForm } from "../../../components/AuthForm";
import { authViewPaths } from "@neondatabase/auth-ui/server";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="auth-shell">
      <div style={{ width: "min(420px, 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span
            className="brand-mark"
            style={{ width: 40, height: 40, borderRadius: 11, fontSize: 18, margin: "0 auto 12px" }}
          >
            R
          </span>
          <div style={{ fontWeight: 650, letterSpacing: "-0.02em", fontSize: 18 }}>Ripple</div>
        </div>
        <AuthForm path={path} />
      </div>
    </main>
  );
}
