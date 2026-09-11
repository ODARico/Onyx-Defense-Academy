/* ============================================================================
   ONYX DEFENSE ACADEMY — FIND MY CLASS QUIZ
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE THE QUIZ QUESTIONS OR
   WHICH CLASS EACH ANSWER PATH RECOMMENDS. The website reads this list
   automatically -- you don't need to touch the HTML, CSS, or script.js.

   ---------------------------------------------------------------------------
   HOW THE QUESTIONS WORK
   ---------------------------------------------------------------------------
   quizQuestions is a list of questions asked in order. Each question has:
   - id      : a short internal name for this question. Don't change these
               without also updating the "recommend" logic below -- they're
               how each answer gets looked up.
   - prompt  : the question text shown to the visitor.
   - options : the list of buttons shown. Each one needs:
               - label : the button text
               - value : a short internal name for this answer (used below)

   You can reword any prompt or label freely -- that's just display text.
   Adding, removing, or reordering OPTIONS on a question is also safe. But if
   you add a whole NEW question, or change a value used in the recommend()
   logic further down, you'll need to update that logic to match.

   ---------------------------------------------------------------------------
   HOW A CLASS GETS RECOMMENDED
   ---------------------------------------------------------------------------
   The recommend() function below looks at the answers (by question id) and
   returns one of the exact class names from schedule-data.js. The very first
   matching rule wins, top to bottom -- so specific cases are checked before
   general fallbacks.

   Every classType returned here MUST exactly match a class name used in
   classes.html / schedule-data.js / reviews-data.js / script.js, character
   for character, or the "Text"/"Email" buttons on the result screen will
   still work, but the tap-to-jump-to-schedule feature won't find a match.
   ============================================================================ */

const quizQuestions = [
  {
    id: "experience",
    prompt: "Have you shot a handgun before?",
    options: [
      { label: "Never", value: "never" },
      { label: "A little", value: "some" },
      { label: "Regularly", value: "a-lot" }
    ]
  },
  {
    id: "permit",
    prompt: "Do you need this for a NC concealed carry permit?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not sure", value: "not-sure" }
    ]
  },
  {
    id: "group",
    prompt: "Who's training?",
    options: [
      { label: "Just me", value: "solo" },
      { label: "A couple people", value: "couple" },
      { label: "A group of 3+", value: "group" }
    ]
  },
  {
    id: "specific",
    prompt: "Anything specific?",
    options: [
      { label: "Just the basics", value: "basics" },
      { label: "Legal refresher", value: "legal" },
      { label: "Cleaning & maintenance", value: "cleaning" },
      { label: "Real estate agent safety", value: "real-estate" },
      { label: "A class for my kid", value: "kid" }
    ]
  }
];

/**
 * answers looks like: { experience: "never", permit: "yes", group: "solo", specific: "basics" }
 * Returns { classType, reason } -- classType must exactly match a class name
 * used elsewhere on the site (see the note above).
 */
function recommendClass(answers) {
  // Q4 is checked first -- a specific stated need overrides everything else.
  if (answers.specific === "legal") {
    return {
      classType: "NC Concealed Carry Legal Refresher",
      reason: "You just want to stay current on the law, so a classroom-only refresher is the fastest fit."
    };
  }
  if (answers.specific === "cleaning") {
    return {
      classType: "Handgun Cleaning Basics",
      reason: "You're after cleaning and maintenance specifically, not a full training day."
    };
  }
  if (answers.specific === "real-estate") {
    return {
      classType: "Real Estate Agent Safety",
      reason: "This class is built specifically for agents who show properties alone."
    };
  }
  if (answers.specific === "kid") {
    return {
      classType: "ODA Children's Firearms & Safety Fundamentals",
      reason: "This course is written specifically for kids, with parents welcome to take part."
    };
  }

  // Otherwise ("Just the basics"), fall back to experience / permit / group size.
  const needsPermit = answers.permit === "yes" || answers.permit === "not-sure";
  const experiencePhrase = {
    never: "you've never shot before",
    some: "you've shot a little before",
    "a-lot": "you're already comfortable with a handgun"
  }[answers.experience] || "you're getting started";

  if (needsPermit && answers.group === "group") {
    return {
      classType: "Private Concealed Carry Course",
      reason: "Since " + experiencePhrase + " and you're training as a group of 3 or more toward a permit, a private class for your group makes sense."
    };
  }
  if (needsPermit) {
    return {
      classType: "NC Concealed Carry Course",
      reason: "Since " + experiencePhrase + " and need a permit, start here."
    };
  }
  if (answers.group === "solo") {
    return {
      classType: "Handgun One-on-One",
      reason: "Since " + experiencePhrase + " and don't need a permit, private instruction can move entirely at your pace."
    };
  }
  return {
    classType: "Basic Handgun",
    reason: "Since " + experiencePhrase + " and you're training with others, a relaxed group setting is a great starting point."
  };
}
