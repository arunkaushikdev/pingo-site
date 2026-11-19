/*
 * The only file you need to edit to run the site.
 * A value left as "" simply hides that button or link. Nothing here is a secret, it is all public.
 */
const CONFIG = {
  siteUrl: "https://arunkaushikdev.github.io/pingo-site/",

  // Is the closed test open for volunteers right now? true shows "Closed test is open".
  testOpen: true,
  testersNeeded: 12,
  // Optional: people who joined but are not on the wall. The wall counts max(this, number of names below).
  testersJoined: 0,

  // STEP 1. A Google Group's join page. Add the group's email as the tester list in Play Console and everyone who joins gets access with no manual adding.
  groupUrl: "https://groups.google.com/g/pingo-closed-testers",
  // STEP 2. A Google Form asking: name, role (student or professional), organisation or college, LinkedIn (optional), and a tick-box "You may show my name on the Wall of Thanks".
  formUrl: "",
  // STEP 3. The "Join on the web" link from Play Console, Testing, Closed testing, Testers. Exists once your closed test is live.
  optInUrl: "",
  // Where testers report bugs and ideas: a Google Form or a WhatsApp group invite.
  feedbackUrl: "",

  contactEmail: "arun.idevs@gmail.com",
  // Digits only with country code, no plus sign, for example 919876543210. Empty hides the WhatsApp button.
  whatsappNumber: "",
  linkedinUrl: "",
  facebookUrl: "https://www.facebook.com/profile.php?id=61584796410306",
  instagramUrl: "https://www.instagram.com/happylearninghq/",
  xUrl: "https://x.com/CodeNCoffe",


  // Shown on certificates. When the 14 days are done, set the real end date.
  testStart: "",
  testEnd: "",
};

/*
 * The Wall of Thanks. Add a person ONLY after they agreed in the form that their name may be shown.
 * id: short lowercase word with no spaces, used in their certificate link.
 */
const TESTERS = [
  // { id: "riya-s", name: "Riya Sharma", role: "Student", org: "Delhi University", link: "https://www.linkedin.com/in/..." },
];
