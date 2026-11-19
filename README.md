# Pingo closed-test site

Plain HTML, CSS and JS. No build step, no trackers, no external fonts.

## Run the closed test (all edits are in `config.js`)

1. **Tester group.** Create a Google Group (groups.google.com), set "Who can join" to anyone, copy its join page into `groupUrl`. In Play Console, Testing, Closed testing, Testers, add the group's email. Everyone who joins the group gets access automatically.
2. **Details form.** A Google Form with: name, role (student or professional), college or company, LinkedIn (optional), and a tick-box "You may show my name on the Wall of Thanks". Put its link in `formUrl`.
3. **Opt-in link.** After your closed test is live, copy the "Join on the web" link into `optInUrl`.
4. **Feedback.** A form or WhatsApp group invite in `feedbackUrl`.
5. **Contact.** `contactEmail`, `whatsappNumber` (digits with country code), and your `linkedinUrl`, `facebookUrl`, `instagramUrl`.
6. **Wall of Thanks.** When someone ticked the box, add them to `TESTERS` in `config.js`. They get a certificate at `certificate.html?id=THEIR_ID`.
7. When the 14 days finish, set `testStart` and `testEnd` (YYYY-MM-DD) so certificates show the dates.

## Publish

GitHub repo Settings, Pages, deploy from branch `main`, folder `/ (root)`. The site is then at https://arunkaushikdev.github.io/pingo-site/
