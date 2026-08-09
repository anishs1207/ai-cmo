import Link from "next/link";
import { auth } from "../../lib/auth/server";

export default async function LandingPage() {
  const { data: session } = await auth.getSession();
  const signedIn = Boolean(session?.user);

  return (
    <div className="marketing">
      <nav className="marketing-nav">
        <Link href="/" className="marketing-brand">
          <span className="brand-mark">R</span>
          Ripple
        </Link>
        <div className="row" style={{ gap: 10 }}>
          {signedIn ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/sign-in" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link href="/auth/sign-up" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="marketing-hero">
        <p className="brand-word">Ripple</p>
        <h1>Organic growth that learns what actually works.</h1>
        <p className="lede">
          Ripple reads your business, writes native posts, publishes them, and shows you every visitor
          they send back — so the next campaign is sharper than the last.
        </p>
        <div className="marketing-cta">
          <Link
            href={signedIn ? "/dashboard" : "/auth/sign-up"}
            className="btn btn-primary btn-lg"
          >
            {signedIn ? "Open dashboard" : "Start free"}
          </Link>
          <a href="#how" className="btn btn-secondary btn-lg">
            See how it works
          </a>
        </div>
      </section>

      <div className="rule" />

      <section id="how" className="marketing-section">
        <h2>From site to signal</h2>
        <p className="lede">
          One quiet loop for early-stage founders: know the brand, ship the posts, track the traffic,
          learn what moved people.
        </p>
        <div className="step-list">
          {[
            {
              n: "01",
              title: "Learn your business",
              body: "Paste your site. Ripple builds a marketing knowledge base — audience, voice, offers, and where your customers already hang out.",
            },
            {
              n: "02",
              title: "Ship native campaigns",
              body: "It writes platform-native posts with tracked links, then publishes or schedules them so you stay in the conversation without burning evenings.",
            },
            {
              n: "03",
              title: "See what worked",
              body: "Every click lands on your dashboard. Analyze a campaign and Ripple folds those learnings into the next one automatically.",
            },
          ].map((step) => (
            <div key={step.n} className="step-row">
              <span className="step-num">{step.n}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      <section className="marketing-section" style={{ textAlign: "center", paddingBottom: 96 }}>
        <h2 style={{ margin: "0 auto 12px" }}>Calm autopilot. Clear proof.</h2>
        <p className="lede" style={{ margin: "0 auto 28px" }}>
          Built for founders who need growth without the agency noise — and want to know if it
          actually worked.
        </p>
        <Link
          href={signedIn ? "/dashboard" : "/auth/sign-up"}
          className="btn btn-primary btn-lg"
        >
          {signedIn ? "Go to dashboard" : "Build your marketing brain"}
        </Link>
      </section>

      <footer className="marketing-footer">Ripple — organic growth autopilot</footer>
    </div>
  );
}
