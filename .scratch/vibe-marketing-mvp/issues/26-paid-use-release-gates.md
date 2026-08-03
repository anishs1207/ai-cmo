# 26 — Verify paid-use release gates

**What to build:** The complete MVP demonstrates that every PRD release gate holds under normal operation, integration failure, and adversarial tenant access.

**Blocked by:** 17 — Publish and launch an approved Meta campaign; 18 — Report first-party and Meta performance separately; 19 — Generate evidence-gated optimization recommendations; 20 — Approve and execute post-launch actions; 21 — Enable bounded autonomy and emergency controls; 22 — Reconcile external Meta changes and rejected ads; 23 — Deliver operational alerts and daily digests; 24 — Enforce trial and subscription entitlements; 25 — Provide workspace export, deletion, and retention.

**Status:** ready-for-agent

**Implemented in commit:** —

- [ ] Automated tests verify tenant isolation, approval gates, audit coverage, financial limits, kill switch, attribution separation, and data lifecycle.
- [ ] Integration tests verify Meta connection, revocation, launch recovery, rejection handling, and external-edit safety.
- [ ] India and US consent, privacy, billing, advertising, and policy obligations have recorded appropriate review before external paid use.

