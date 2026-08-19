r/SaaS
viral posts

---
Title: Company copied my code after refusing to pay for a license. I know because their site is sending data to MY Hotjar account. What would you do?

Content:
Freelance dev here (EU). A startup I was in partnership talks with came to me with an idea for a tool. Their own dev attempted a first version that was slow, buggy, and honestly barely functional. I rebuilt it from scratch in my own time, own repo, no contract, never got paid. The idea was theirs, the code is mine.

Partnership fell through. I offered them a cheap non-exclusive license so they could keep using and commercializing my version. They declined and said they’d build their own.

Yesterday my Hotjar dashboard started showing sessions from their domain. They didn’t build their own. They copied mine, literally, including my tracking ID. They’re now marketing it as their own SaaS, presenting my work as something they built.

I called them. They denied copying anything. Meanwhile every visitor on their site shows up in my analytics. What would you do?

Stats: 189k views in 10 hours with 292 upvotes

---

Title: Coworker got promoted for insane AI shipping speed. He just got suspended, and now I am expected to clean up his undocumented mess for free.

Content:
fudging some identifying details here so i don't dox myself, but this is very real and just ate my entire weekend.

i work in product dev at a mid-sized B2B SaaS. i'm not anti-AI at all. i use our approved Copilot seat every day for tests, boilerplate, boring stuff like that. i get the whole point of moving fast.

few months ago we hired a new dev. his shipping speed was honestly unreal and management absolutely loved him for it. all we heard about was his 'initiative and end-to-end ownership.' dude built and shipped a custom onboarding portal for enterprise clients in literally three days.

and the crazy part is, it actually worked. clients could log in, update their migration status, and it would ping our CS team through Slack webhooks. management basically made him the poster child for our new velocity push and he got promoted pretty much immediately.

I did ask some basic questions during our syncs. where is this thing actually getting its data from? is there a staging environment? who reviewed the DB migrations?

apparently i was being too cautious and needed to adapt to the new pace.

then a major enterprise prospect hit us with a massive security questionnaire before signing, so IT had to audit the onboarding portal to make sure we weren't doing anything stupid with client data. lol.

that's when the whole thing came apart.

when they pulled me in to look through the logs, i found out he originally used Enter Pro to prototype the onboarding flow. honestly, the prototype itself was solid. probably the cleanest part of the entire project.

everything after that was the problem.

he stitched together the production setup using raw scripts generated across his personal Copilot and Windsurf accounts. and again, the app worked. that's probably why nobody noticed.

but there was basically zero governance around anything.

didn't use our local CLI to sync the final state back to git. zero tests. was pasting client DB structures directly into personal AI workspaces without masking anything. API keys for internal tools were sitting in an environment IT had no visibility into. schema changes were happening on the fly with no migration history.

so yeah, it worked.

nobody could just tell you what the hell was actually running, where it was running, what had changed, or who had access to what.

and to be clear, the original prototype wasn't what IT flagged. it was everything he did AFTER that with unapproved personal accounts, unmasked client context, undocumented production changes and credentials that never went through our normal review process.

IT flagged the whole project. coworker got suspended pending investigation.

except CS already depends on this portal, so we can't exactly just turn it off.

management came to me to "stabilize the transition."

which apparently means congratulations, you get to clean up someone else's entire mess for free.

now i'm reverse engineering the data flow, rotating keys, figuring out what is actually running in production, writing documentation that should've existed from day one, and trying to get the whole thing into compliance.

on top of my actual roadmap work.

no title bump. no extra pay. no deadline adjustment.

i told them i'll obviously patch the immediate security risks because i'm not going to knowingly leave a security hole sitting there. but i'm not permanently owning this thing unless they formally adjust my scope and deadlines.

management says i'm "making a work issue too personal" and that i'm hurting the customers.

and this is the part i genuinely don't understand.

if AI-assisted shipping speed counts as productivity, why doesn't all the cleanup count too?

the testing. the documentation. the security review. the migrations. the compliance work. the hours spent figuring out what someone else did three months ago.

you don't get to celebrate the velocity, promote the guy for it, and then pretend all the engineering work he skipped just magically disappears.

someone still has to pay that bill.

am i being unreasonable for refusing to permanently own this unless they actually adjust my deadlines and scope?

because right now i'm just exhausted.

Stats: 6.9k views in 46 minutes with 7 upvotes

---

Title: fudging some identifying details here so i don't dox myself, but this is very real and just ate my entire weekend.

i work in product dev at a mid-sized B2B SaaS. i'm not anti-AI at all. i use our approved Copilot seat every day for tests, boilerplate, boring stuff like that. i get the whole point of moving fast.

few months ago we hired a new dev. his shipping speed was honestly unreal and management absolutely loved him for it. all we heard about was his 'initiative and end-to-end ownership.' dude built and shipped a custom onboarding portal for enterprise clients in literally three days.

and the crazy part is, it actually worked. clients could log in, update their migration status, and it would ping our CS team through Slack webhooks. management basically made him the poster child for our new velocity push and he got promoted pretty much immediately.

I did ask some basic questions during our syncs. where is this thing actually getting its data from? is there a staging environment? who reviewed the DB migrations?

apparently i was being too cautious and needed to adapt to the new pace.

then a major enterprise prospect hit us with a massive security questionnaire before signing, so IT had to audit the onboarding portal to make sure we weren't doing anything stupid with client data. lol.

that's when the whole thing came apart.

when they pulled me in to look through the logs, i found out he originally used Enter Pro to prototype the onboarding flow. honestly, the prototype itself was solid. probably the cleanest part of the entire project.

everything after that was the problem.

he stitched together the production setup using raw scripts generated across his personal Copilot and Windsurf accounts. and again, the app worked. that's probably why nobody noticed.

but there was basically zero governance around anything.

didn't use our local CLI to sync the final state back to git. zero tests. was pasting client DB structures directly into personal AI workspaces without masking anything. API keys for internal tools were sitting in an environment IT had no visibility into. schema changes were happening on the fly with no migration history.

so yeah, it worked.

nobody could just tell you what the hell was actually running, where it was running, what had changed, or who had access to what.

and to be clear, the original prototype wasn't what IT flagged. it was everything he did AFTER that with unapproved personal accounts, unmasked client context, undocumented production changes and credentials that never went through our normal review process.

IT flagged the whole project. coworker got suspended pending investigation.

except CS already depends on this portal, so we can't exactly just turn it off.

management came to me to "stabilize the transition."

which apparently means congratulations, you get to clean up someone else's entire mess for free.

now i'm reverse engineering the data flow, rotating keys, figuring out what is actually running in production, writing documentation that should've existed from day one, and trying to get the whole thing into compliance.

on top of my actual roadmap work.

no title bump. no extra pay. no deadline adjustment.

i told them i'll obviously patch the immediate security risks because i'm not going to knowingly leave a security hole sitting there. but i'm not permanently owning this thing unless they formally adjust my scope and deadlines.

management says i'm "making a work issue too personal" and that i'm hurting the customers.

and this is the part i genuinely don't understand.

if AI-assisted shipping speed counts as productivity, why doesn't all the cleanup count too?

the testing. the documentation. the security review. the migrations. the compliance work. the hours spent figuring out what someone else did three months ago.

you don't get to celebrate the velocity, promote the guy for it, and then pretend all the engineering work he skipped just magically disappears.

someone still has to pay that bill.

am i being unreasonable for refusing to permanently own this unless they actually adjust my deadlines and scope?

because right now i'm just exhausted.

Content:
[has an omage showing screenshot of stripe first spike in sales]

I remember when I got my first Stripe payment, it was 47 euros. I feels unreal.

Then I didn't sell for months.

Before that I've build for 3 years. Yeah it was before chatgpt.

Got into depression after this one sales.

I just sold to 1 company then nothing.

But, now we did 550 euros in a week.

That's cheesy but the never give up advice is the realest.

Stats: 25.4k views and 136 upvotes in 21 hrs

---

Title: Built a SaaS have zero clue how to market it where do I even start?

Content:
Spent months building a CRM (multi-tenant, live in prod, actual paying-ready) Turns out building it was the easy part I have no idea how to get it in front of people

No marketing background, no audience, no email list Just a working product and a founder who can code but can't sell

For people who've been through this how did you get your first 10-50 users? Cold outreach, communities, content, ads, something else? Trying to figure out what's actually worth my time vs. what's just noise everyone repeats

Stats: 25k views in 17 hrs and 43 upvotes

---