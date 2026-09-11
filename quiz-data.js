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
      { label: "Yes — I need to get one", value: "need" },
      { label: "I already have one", value: "have" },
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

/* ----------------------------------------------------------------------------
   WHICH CLASS GETS RECOMMENDED
   ----------------------------------------------------------------------------
   answers looks like:
     { experience: "never", permit: "need", group: "solo", specific: "basics" }

   Returns { classType, reason, alsoConsider } where alsoConsider is optional.
   Every classType returned MUST exactly match a class name used in
   classes.html / schedule-data.js / reviews-data.js / calculator-data.js.

   ORDER MATTERS. The rules below are checked top to bottom, first match wins,
   and they're deliberately ordered by how binding the requirement is:

   1. A class for a kid comes first -- a minor can't hold a NC permit, so the
      other answers can't override it.

   2. NEEDING A PERMIT comes next, and it OUTRANKS the "anything specific?"
      answer on purpose. Only the full NC Concealed Carry Course meets the
      NCDOJ requirement -- the Legal Refresher, Cleaning Basics and Real
      Estate Agent Safety classes do not. Someone who says they need a permit
      and then picks "legal refresher" would otherwise be steered into a class
      that can't get them the permit they came for. When this rule overrides
      what they picked, alsoConsider keeps their original interest visible
      instead of silently dropping it.

   3. Only then do the specialty picks apply -- which is now safe, because
      anyone still reaching this point either already holds a permit or
      doesn't need one.

   4. Finally, the general fallback based on group size and experience.
   -------------------------------------------------------------------------- */
function recommendClass(answers) {
  var experiencePhrase = {
    never: "you've never shot before",
    some: "you've shot a little before",
    "a-lot": "you're already comfortable with a handgun"
  }[answers.experience] || "you're getting started";

  var needsPermit = answers.permit === "need" || answers.permit === "not-sure";

  // 1. A class for a kid -- a minor can't hold a NC permit, so nothing overrides this.
  if (answers.specific === "kid") {
    var kidResult = {
      classType: "ODA Children's Firearms & Safety Fundamentals",
      reason: "This course is written specifically for kids, and parents and guardians are welcome to take part."
    };
    if (needsPermit) {
      kidResult.alsoConsider = {
        classType: "NC Concealed Carry Course",
        note: "You also mentioned needing a permit for yourself \u2014 that's the class for it."
      };
    }
    return kidResult;
  }

  // 2. Needing a permit outranks the "anything specific?" answer. See note above.
  if (needsPermit) {
    var permitReason;
    if (answers.specific === "legal") {
      permitReason = "The Legal Refresher is a law update for people who already hold a permit \u2014 it won't meet the requirement on its own. Since you still need to get your permit, the full course is the one that does.";
    } else if (answers.permit === "not-sure") {
      permitReason = "Since " + experiencePhrase + " and aren't sure whether you need a permit, this course covers everything either way. If it turns out you don't need one, mention it and we'll point you somewhere better suited.";
    } else {
      permitReason = "Since " + experiencePhrase + " and need to get your permit, start here \u2014 this is the course that meets the requirement.";
    }

    var permitResult;
    if (answers.group === "group") {
      permitResult = {
        classType: "Private Concealed Carry Course",
        reason: permitReason + " With a group of 3 or more, it can be taught privately for just your group."
      };
    } else {
      permitResult = { classType: "NC Concealed Carry Course", reason: permitReason };
    }

    // Keep their original interest visible rather than silently dropping it.
    if (answers.specific === "cleaning") {
      permitResult.alsoConsider = {
        classType: "Handgun Cleaning Basics",
        note: "You mentioned cleaning and maintenance \u2014 this one can be added separately."
      };
    } else if (answers.specific === "real-estate") {
      permitResult.alsoConsider = {
        classType: "Real Estate Agent Safety",
        note: "You mentioned agent safety \u2014 this one can be added separately."
      };
    }
    return permitResult;
  }

  // 3. Specialty picks -- safe now, since anyone here already holds a permit
  //    or doesn't need one.
  if (answers.specific === "legal") {
    return {
      classType: "NC Concealed Carry Legal Refresher",
      reason: "Since you already hold your permit and just want to stay current on the law, a classroom-only refresher is the fastest fit."
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

  // 4. General fallback.
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
