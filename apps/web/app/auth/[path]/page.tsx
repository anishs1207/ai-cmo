import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(80% 60% at 50% -10%, rgba(10,132,255,0.09) 0%, rgba(10,132,255,0) 70%), var(--bg)",
      }}
    >
      <div style={{ width: "min(420px, 100%)" }}>
        <AuthView path={path} />
      </div>
    </main>
  );
}
