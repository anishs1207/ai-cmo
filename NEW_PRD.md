# Vibe Marketing — MVP Product Requirements Document

## 1. Document Status

- Status: Draft approved through product discovery
- Initial markets: India and the United States
- Initial language: English
- Initial paid channel: Meta Ads
- Supported business models: ecommerce and SaaS

## 2. Product Summary

Vibe Marketing is an AI-assisted paid-marketing operator for founders who do not know digital marketing and do not want to spend their time learning it or hiring a skilled performance marketer.

The MVP turns a customer's website, business information, uploaded documents, and existing creative assets into a tracked Meta advertising campaign. It then monitors campaign performance and recommends evidence-based improvements. The customer approves every spend-affecting action by default. Customers may optionally enable bounded autonomy within limits they define.

### Core product promise

> Turn your website, business information, and existing creative assets into a tracked Meta Sales or Leads campaign—then recommend evidence-based improvements—with you approving every spend-affecting action unless bounded autonomy is enabled.

The MVP does not promise guaranteed growth, guaranteed ROAS, unrestricted autonomy, organic social management, or AI-generated UGC.

## 3. Problem

Small ecommerce and SaaS founders often lack the time, expertise, or budget required to operate paid marketing well. Existing tools are fragmented: one product creates content, another launches ads, another tracks attribution, and a marketer must still connect the strategy, execution, measurement, and optimization loops.

The customer needs a system that:

1. Understands the business and its offer.
2. Turns that understanding into a defensible campaign strategy.
3. Configures campaigns and tracking correctly.
4. Makes the work understandable and approvable without requiring marketing expertise.
5. Monitors results and proposes safe, evidence-based actions.

## 4. Target Customer

The initial customer is a founder or small-business operator in India or the United States who:

- Runs an ecommerce business or SaaS product.
- Wants to acquire customers using Meta Ads.
- Does not have strong performance-marketing expertise.
- Does not want to hire a full-time marketer or agency.
- Has a functioning website or landing page.
- Has existing image or video creative assets.
- Can install or authorize installation of first-party conversion tracking.
- Has a Meta Business account, ad account, and valid payment method.

The strongest initial fit is an existing advertiser spending approximately USD 1,000–20,000 per month or the local equivalent. New advertisers may use the product, but will begin with a conservative learning campaign because no account history exists.

### Supported playbooks

The product must maintain separate playbooks rather than applying one generic funnel:

- Ecommerce: optimize Meta Sales campaigns for purchases and purchase CPA, with ROAS as a guardrail.
- SaaS: optimize Meta Leads campaigns for a customer-defined qualified-lead or activated-trial event. Raw clicks and unqualified form submissions are not valid primary success events.

## 5. Goals

### MVP goals

- Reduce the work required to move from business context to a launch-ready Meta campaign.
- Make campaign strategy accessible to a non-marketer.
- Prevent avoidable setup, policy, tracking, and budget errors.
- Create a closed measurement and recommendation loop using first-party events.
- Preserve explicit human control over spending by default.
- Establish a channel-agnostic core that can support additional advertising platforms later.

### Non-goals for the MVP

- Original AI video, UGC, avatar, or voice generation.
- End-to-end creator discovery, negotiation, payment, or project management.
- Organic Instagram or Facebook publishing and scheduling.
- Google, TikTok, LinkedIn, Pinterest, X, or other ad platforms.
- Shopify-native order integration.
- CRM or billing-platform integration.
- Meta Instant Forms.
- Awareness, traffic, engagement, app-promotion, messaging, or store-visit campaigns.
- Automatic editing of the customer's website or landing pages.
- Agency dashboards, multi-client agency workflows, or white-labeling.
- OCR or extraction from image-only documents.
- Unrestricted autonomous access to customer budgets.
- Holding or disbursing customer advertising funds.

## 6. Product Principles

1. Human authority by default: consequential actions require approval.
2. No invented facts: missing information remains unknown until verified.
3. Explain decisions, protect implementation: expose the facts and action rationale, but not proprietary prompts, reasoning traces, scoring weights, or reusable internal patterns.
4. First-party measurement: do not rely solely on Meta's self-reported attribution.
5. Evidence before optimization: do not pause or scale campaigns based on sparse data.
6. Preserve originals: creative formatting creates derivatives and never overwrites source assets.
7. No silent changes: all material decisions, edits, and external changes appear in an audit trail.
8. No guaranteed outcomes: distinguish readiness assessments from performance predictions.

## 7. End-to-End User Journey

1. The user creates a business workspace and chooses ecommerce or SaaS.
2. The user supplies one or more website URLs, a manual description, text-based documents, and the item or offer to promote.
3. The system extracts and organizes the business context.
4. The user verifies an editable Brand Profile or skips detailed review with a warning.
5. The user connects a Meta Business account and grants the required permissions.
6. When available, the system automatically audits the previous 90 days of Meta campaign history.
7. The user supplies existing creative assets.
8. The system validates the assets and generates transparent placement-compatible derivatives where required.
9. The system audits the destination page and verifies first-party and Meta conversion tracking.
10. The system proposes one campaign plan with up to three distinct messaging angles.
11. The user approves strategy, budget, copy, creative previews, placements, tracking, and final launch.
12. The system creates and launches the Meta campaign using the customer's ad account and payment method.
13. The system collects events, monitors health, and evaluates performance.
14. The system places optimization actions in an approval queue or executes permitted actions when bounded autonomy is enabled.

## 8. Functional Requirements

### 8.1 Workspace and access

- Each workspace represents one business.
- A workspace has an Owner and may have collaborators.
- MVP roles are Admin and Viewer.
- Agency-level multi-business management is out of scope.
- The system must record material actions and their actor in an immutable audit log.

### 8.2 Business intake

The system must accept one or more of:

- A public website or product URL.
- A manual business description.
- Text-based PDF, DOCX, or TXT files within published size and page limits.
- A description of the product, service, or offer to promote.

Website crawling must:

- Access only public pages on the submitted domain.
- Respect applicable robots directives.
- Use a configured page limit.
- Prioritize home, product, pricing, feature, about, FAQ, testimonial, policy, and contact pages.
- Never access authenticated pages automatically.
- List discovered sources and allow users to include or exclude them.

Document processing must:

- Extract text from supported files.
- Detect image-only or scanned files.
- Clearly state when a file was not processed because OCR is unavailable.
- Ignore embedded images in the MVP.

### 8.3 Brand Profile and marketing knowledge base

The system must derive a structured internal knowledge base containing at least:

- Business overview and business model.
- Products or services.
- Problems solved and customer benefits.
- Target audiences and customer segments.
- Jobs, pain points, objections, and purchase motivations.
- Features and defensible benefits.
- Offers, prices, currencies, discounts, and commercial constraints.
- Differentiators and unique selling propositions.
- Competitors and alternative solutions.
- Positioning and messaging pillars.
- Brand voice, tone, personality, and identity.
- Approved claims and supporting evidence.
- Testimonials and reviews with sources and usage status.
- FAQs.
- Landing pages and intended conversion events.
- Known legal, policy, geographic, or audience restrictions.
- Source, retrieval date, and confidence for derived facts.

Campaign-critical facts include offer, price, audience, claims, testimonials, target geography, landing page, conversion event, and budget. Conflicting critical facts must be presented with their sources and resolved by the user. Explicitly verified user input has priority over derived information.

The system must never manufacture unknown details, testimonials, prices, claims, or competitor information.

### 8.4 Operator and Expert experiences

All customers start in Operator mode.

Operator mode shows:

- Submitted inputs.
- A concise, editable Brand Profile.
- Generated campaign outputs.
- Approval requests.
- Expected operational impact and spend exposure.
- Performance and recommended actions.

Expert mode, accessible through progressive disclosure, may additionally show:

- Structured audiences.
- Positioning and messaging pillars.
- Offer strategy.
- Campaign structure.
- Creative and placement rationale.

The product never exposes proprietary system prompts, private reasoning traces, scoring weights, or cross-customer pattern logic. Users may skip detailed Brand Profile review through an off-by-default control that presents a clear accuracy warning. Critical spend and claim approvals cannot be skipped in approval-led mode.

### 8.5 Competitor discovery

- Accept competitors named by the user.
- Suggest candidates using current public research.
- Provide the source and retrieval date for time-sensitive observations.
- Require confirmation that a suggested business is genuinely comparable.
- Never copy competitor creative assets or present inferred claims as verified facts.

### 8.6 Claims, reviews, and policy safety

- Maintain a registry of marketing claims and their substantiation.
- Require evidence for objective, quantitative, superlative, health, or comparative claims.
- Block unsupported claims from generated ads.
- Use testimonials only when supplied by the customer or obtained from an approved, traceable source with appropriate usage rights.
- Preserve the meaning of reviews and prohibit invented, merged, or exaggerated testimonials.
- Require explicit approval for every testimonial used in advertising.
- Apply Meta policies and market-relevant requirements, including US FTC and Indian ASCI considerations.

The MVP must refuse political advertising, gambling, adult products, weapons, prescription drugs, unsupported health claims, and other unsupported high-risk categories. It must flag sensitive personal-attribute targeting and require additional review for supplements, cosmetic claims, alcohol, housing, employment, and credit. The precise restricted-category registry must be configurable as policies change.

### 8.7 Meta account connection and historical audit

- Connect to the customer's Meta Business and ad account using the minimum required permissions.
- Meta charges advertising spend directly to the customer's existing payment method.
- The product never holds an advertising wallet or customer media funds.
- If usable history exists, automatically analyze the previous 90 days.
- Analyze spend, objectives, conversion events, audiences, placements, creatives, and performance.
- Allow users to exclude obsolete campaigns or anomalous periods.
- Clearly separate account-specific findings from generic assumptions.

Instagram and Facebook are Meta placements. The system may route budget and creative differently between them based on customer constraints and evidence. It should begin with consolidated learning and create separate campaigns only when material creative requirements, constraints, or statistically meaningful performance differences justify independent budgets. Age-based platform stereotypes alone are insufficient evidence.

### 8.8 Creative assets

The MVP accepts customer-provided images and videos. It does not generate original footage, avatars, voices, or UGC.

The upload flow must:

- Preserve the original asset unchanged.
- Validate file type, size, duration, dimensions, aspect ratio, resolution, and policy risk.
- Publish current upload guidance rather than relying on permanently hardcoded platform limits.
- Recommend safe master formats:
  - Feed portrait: 1080 × 1350 pixels (4:5).
  - Feed square: 1080 × 1080 pixels (1:1).
  - Stories and Reels: 1080 × 1920 pixels (9:16).
  - Reels video: preferably 1080 × 1920, with at least 720p and 30 FPS, subject to current Meta requirements.
- Create placement-compatible derivatives when needed.
- Disclose every crop, resize, or format conversion.
- Show previews for all intended placements before approval.
- Flag any transformation that may remove or obscure text, logos, products, faces, or key content for manual adjustment.
- Block progression and request a replacement when no compliant derivative can be produced safely.

The system may generate associated primary text, headlines, descriptions, hooks, captions, and CTAs. It must not materially alter the creative content beyond the approved technical formatting described above.

### 8.9 Landing-page audit

Before launch, audit the destination for:

- Availability and broken links.
- Mobile usability.
- Page performance.
- Message and offer consistency with the proposed ad.
- CTA clarity.
- Checkout or form functionality.
- Policy and claims risk.
- First-party and Meta conversion tracking.

Block launch for a broken destination, nonfunctional conversion path, material offer mismatch, prohibited claim, or missing required tracking. Warn but allow approval for softer conversion-quality concerns. Do not modify the website in the MVP.

### 8.10 First-party tracking and attribution

The MVP must provide a consent-aware first-party tracking layer that can capture:

- Landing-page visits.
- Customer-defined funnel events.
- Ecommerce purchase ID and value through a generic purchase event.
- SaaS qualified-lead or activated-trial events.

The system must also configure or verify relevant Meta Pixel and/or Conversions API events and deduplicate matching events using stable event and transaction/lead identifiers.

Attribution requirements:

- Use first-party click-based attribution as the optimization source of truth.
- Default to a 7-day click window for ecommerce purchases and SaaS lead/activation optimization.
- Report downstream SaaS trial or subscription outcomes over 30 days when those events are available.
- Display Meta-reported attribution separately.
- Never merge first-party and Meta-attributed conversions into a misleading combined total.
- Show attribution discrepancies to the user.

Verified tracking and a meaningful conversion event are launch gates for Sales and Leads campaigns.

### 8.11 Campaign strategy and generation

The MVP supports:

- Meta Sales campaigns for ecommerce.
- Meta Leads campaigns using website destinations for SaaS.

For each campaign, the system must recommend:

- Objective and primary conversion event.
- Target geography and audience hypothesis.
- Offer and landing page.
- Budget and schedule.
- Placement strategy.
- Up to three differentiated messaging angles.
- Copy and CTA for each selected angle.
- A test design and success/stop criteria.
- Tracking configuration and UTMs.

Present one recommended plan rather than many near-duplicate plans. Each angle must state the hypothesis it tests.

The number of variants must be constrained by budget and expected CPA. The default maximum is three creative/copy combinations across no more than two audience hypotheses. The user may exceed the recommendation only after acknowledging reduced confidence.

The system must calculate a minimum viable test budget based on the conversion goal, expected CPA range, test duration, and number of variables. If the available budget cannot support a meaningful test, reduce the test scope or block launch and explain the minimum viable alternative. Do not imply statistical certainty when it is unavailable.

### 8.12 Approval gates

Approval-led mode has four gates:

1. Business and brand facts.
2. Strategy, audience, objective, budget, and schedule.
3. Creative derivatives, copy, placements, landing page, and tracking preview.
4. Final campaign creation or launch.

Every approval screen must state:

- What will change.
- Why the action is recommended.
- Which account and campaign are affected.
- The maximum immediate and ongoing spend exposure.
- Any material uncertainty or warning.

Post-launch recommendations should be grouped in an approval queue instead of generating excessive interruptions.

### 8.13 Bounded autonomy

Approval-led mode is the default. A user may explicitly enable bounded autonomy and configure:

- A daily account or campaign budget ceiling.
- A maximum percentage budget change, defaulting to no more than 20% per adjustment.
- Permitted action categories, such as pausing ads, shifting existing budget, or scaling eligible winners.
- Notification preferences.

Even with autonomy enabled, the following always require approval:

- Creating a materially new campaign strategy.
- Increasing the total authorized account budget.
- Exceeding a configured limit.
- Changing billing or payment settings.
- Entering a new geography, objective, or regulated category.

The product must provide an immediate kill switch and a complete audit log. When tracking becomes unreliable, suspend autonomous optimization and alert the user. If unverified spend continues beyond a defined grace period, recommend pausing; automatic emergency pausing is allowed only when explicitly pre-authorized.

### 8.14 Monitoring and optimization

Collect events continuously and calculate reporting metrics at least hourly. Perform ordinary optimization evaluations once or twice daily. Immediate health evaluation is allowed for abnormal spend, tracking failure, broken destinations, rejected ads, or exhausted budgets.

The operator dashboard must emphasize actions rather than reproduce Meta Ads Manager. It must show:

- Spend today and over the selected period.
- First-party conversions.
- Purchase or qualified-lead CPA.
- Ecommerce ROAS where revenue is available.
- SaaS qualified-lead or activation rate.
- Meta-attributed results displayed separately.
- Attribution discrepancy.
- CPM, CTR, CPC, and relevant funnel events.
- Campaign health and tracking health.
- Best- and worst-performing creative assets or messaging angles.
- Fatigue indicators.
- Budget allocation.
- Pending recommendations and approvals.

Optimization recommendations may include pausing an underperformer, reallocating existing budget, scaling a winner, changing copy, changing placement mix, or proposing a new messaging test.

Recommendations must satisfy configured evidence thresholds. Initial defaults should include:

- Do not judge ordinary performance from only a few hours of data.
- Consider pausing after approximately 1.5–2 times target CPA has been spent without a conversion, subject to delivery and attribution checks.
- Scale only after multiple verified conversions at an acceptable CPA.
- Increase budget by no more than 20% in a single adjustment.

These are system-managed and explainable defaults in the MVP, not advanced user-configurable rules.

### 8.15 External changes and rejection handling

If a user changes a managed campaign directly in Meta Ads Manager, the system must:

- Detect and import the external change.
- Record it in the audit log.
- Invalidate stale pending recommendations.
- Never overwrite it automatically.
- Ask whether the campaign remains AI-managed or becomes monitoring-only.

If Meta rejects an ad, the system must:

- Display Meta's reason.
- Identify the affected copy, creative, destination, or configuration.
- Suggest a compliant revision for approval.
- Preserve the rejected version and revision history.
- Never repeatedly resubmit automatically or attempt policy evasion.

### 8.16 Notifications

Immediate in-app and email alerts are required for:

- Ad rejection.
- Tracking failure.
- Broken landing page or conversion flow.
- Abnormal spend or reached safety limit.
- Budget exhaustion.
- An action requiring time-sensitive approval.

Routine results and recommendations belong in a daily digest. SMS, WhatsApp, and Slack alerts are deferred.

## 9. Data, Privacy, and Security

- Use least-privilege access for Meta and website integrations.
- Encrypt credentials and tokens in transit and at rest.
- Revoke platform tokens promptly when an integration is disconnected.
- Separate tenant data logically and enforce tenant authorization on every access path.
- Maintain consent-aware tracking suitable for the customer's selected target market.
- Provide workspace data export and permanent deletion.
- Retain active-workspace campaign and aggregated event data for up to 13 months by default.
- Retain raw visitor-level identifiers only for a shorter configured period, targeted at 30–90 days, then aggregate or delete them.
- Document subprocessors, retention, deletion, and customer responsibilities.

Customer data remains private by default. Cross-customer learning is allowed only when customers explicitly opt in and only through anonymized, aggregated cohorts with minimum cohort sizes. Never expose or reuse another customer's identity, raw campaign data, pricing, audiences, copy, or creative assets.

## 10. Billing

- Charge customers through monthly software subscriptions.
- Tier limits may include connected ad accounts, active campaigns, tracked event volume, and analysis frequency.
- Do not charge a percentage of advertising spend in the MVP.
- Usage-intensive future features may use credits, but monitoring of an active paid campaign must not stop unexpectedly because credits expire.
- Offer a 14-day trial allowing business intake, Brand Profile review, Meta connection, historical audit, and one draft campaign.
- Require a paid subscription before campaign publication and continuous monitoring.

## 11. Success Metrics

Validate the MVP with at least 20 pilot businesses. Initial product success criteria are:

- At least 60% complete onboarding and approve a campaign draft.
- Median time from URL submission to a launch-ready draft is under 30 minutes, excluding time awaiting user input or third-party authorization.
- At least 80% of launched campaigns have verified tracking and no critical setup error.
- At least 50% of active pilot customers approve or act on an optimization recommendation within 30 days.
- Zero unauthorized spend changes.
- Zero cross-customer data exposure incidents.

Track business outcomes such as CPA and ROAS, but do not use them as the sole MVP pass/fail criterion because results also depend on the customer's product, offer, site, budget, and creative quality.

## 12. Readiness Scoring

Before launch, provide an explainable readiness assessment covering:

- Business-context completeness.
- Offer and message clarity.
- Audience fit.
- Creative and placement compatibility.
- CTA and landing-page consistency.
- Conversion tracking readiness.
- Evidence and claim substantiation.
- Policy risk.
- Test-budget adequacy.

Do not show precise predicted CTR, conversion rate, CPA, or ROAS in the MVP. Account-specific forecasts may be introduced later only when sufficient data exists, and must include confidence ranges and visible uncertainty.

## 13. Architecture Direction

The core domain should remain channel-agnostic even though the MVP supports only Meta. Separate:

- Business and marketing knowledge.
- Strategy and experiment planning.
- Creative asset metadata and variants.
- First-party events and attribution.
- Recommendation and approval policy.
- Channel execution adapters.

Meta-specific campaign objects, permissions, placement rules, and API behavior belong in a Meta adapter. This enables future Google, TikTok, LinkedIn, or other connectors without redesigning the entire marketing intelligence layer.

All platform specifications and policy registries must be versioned or configurable because external requirements change.

## 14. Key Entities

- User
- Workspace
- Member and role
- Business source
- Brand Profile
- Knowledge claim and evidence
- Competitor observation
- Creative source asset
- Creative derivative
- Landing page
- Conversion event definition
- Tracking source
- Meta connection
- Campaign plan
- Messaging hypothesis
- Campaign, ad set, and ad reference
- Approval request and decision
- Autonomy policy
- Performance observation
- Optimization recommendation
- Audit event
- Notification

## 15. MVP Release Gates

The MVP is not ready for external paid use until:

- Tenant isolation and authorization have been tested.
- Meta connection, token revocation, campaign creation, and error recovery work reliably.
- Every launch path enforces the four approval gates unless a valid bounded-autonomy policy applies.
- Budget ceilings and the kill switch are tested.
- First-party events are deduplicated and attribution sources remain separate.
- Broken tracking suspends autonomous actions.
- Creative originals are preserved and all derivatives are previewed.
- Unsupported claims and restricted categories are blocked.
- External Meta edits do not get overwritten.
- Audit logs cover all spend-affecting actions.
- Data export and deletion have been verified.
- India- and US-specific consent, privacy, billing, and policy obligations have undergone appropriate review.

## 16. Future Direction

After the paid Meta MVP is validated, potential phases include:

1. End-to-end UGC and video generation using approved models and reusable viral-content patterns.
2. Shopify order/refund reconciliation.
3. CRM and billing integrations for SaaS revenue and pipeline optimization.
4. Organic content creation, calendars, publishing, and analytics.
5. Meta Instant Forms and lead-routing workflows.
6. Additional paid-channel adapters.
7. Creator sourcing and managed production workflows.
8. Privacy-safe, opt-in aggregate learning across larger customer cohorts.
9. Richer asset transformations, image understanding, and OCR.

The long-term vision is an autonomous marketing employee that understands a business, plans strategy, produces creative, executes campaigns, measures outcomes, learns, and repeats. Each expansion must retain explicit financial controls, evidence-based optimization, privacy boundaries, and traceable user authority.
