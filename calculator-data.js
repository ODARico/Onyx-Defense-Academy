/* ============================================================================
   ONYX DEFENSE ACADEMY — GROUP COST CALCULATOR
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE PRICING OR RANGE-FEE
   RULES FOR THE CALCULATOR. The website reads this automatically -- you
   don't need to touch the HTML, CSS, or script.js.

   The key for each entry must exactly match a class name used in
   classes.html / schedule-data.js / reviews-data.js / quiz-data.js,
   character for character.

   ---------------------------------------------------------------------------
   PER-PERSON CLASSES  (pricingType: "perPerson")
   ---------------------------------------------------------------------------
   - price     : dollars per student.
   - liveFire  : "none"  -> never ask about a range, never add a fee.
                 "fixed" -> this class always includes live fire, so always
                            ask whether they have their own place to shoot.
   - feeType   : only used when a range fee can apply. "qualification" ($10)
                 or "training" ($20) -- see rangeFeePerPerson at the bottom.
   - minPeople : optional. Below this number the calculator shows a note
                 instead of a total.

   ---------------------------------------------------------------------------
   THE PUBLIC / PRIVATE SPLIT  (privateOption)
   ---------------------------------------------------------------------------
   Some classes behave differently when booked privately for one group than
   they do as a public class. Basic Handgun is the current example: a public
   session is classroom-only, but a private group can add live fire.

   When a class has a privateOption, the calculator shows a Public/Private
   choice, and the settings inside privateOption override the top-level ones
   whenever "Private" is picked.

   - instructionFee : a FLAT fee for the whole class, not per student --
                      it's one extra hour of instructor time, priced like an
                      hour of Handgun One-on-One. This is charged whenever
                      live fire is added, regardless of whose range is used.

   ---------------------------------------------------------------------------
   HOURLY CLASSES  (pricingType: "hourly")
   ---------------------------------------------------------------------------
   - firstHourPrice          : price of the first hour for the first student.
   - additionalHalfHourPrice : price per extra 30 minutes for that student.
   - additionalPersonRate    : what EACH additional student costs, as a share
                               of the first student's price. 0.5 means half
                               rate -- a second person at 1 hour adds $15, and
                               each extra 30 minutes adds $7.50. This reflects
                               attention being split between students with
                               potentially different needs.
   - liveFire: "optional"    : range time is the student's choice here, so the
                               calculator asks whether there's range time at
                               all before asking whose range.
   ============================================================================ */

const calculatorData = {
  "NC Concealed Carry Course": {
    pricingType: "perPerson",
    price: 95,
    liveFire: "fixed",
    feeType: "qualification"
  },

  "Basic Handgun": {
    pricingType: "perPerson",
    price: 50,
    // Public sessions are classroom-only. Per USCCA's own course page this
    // is 4 hours of in-class time: students handle an instructor-provided
    // handgun, and no student firearms are allowed in the classroom.
    liveFire: "none",
    // A PRIVATE group can add live fire. The $30 is one extra hour of
    // instructor time for the whole class (not per student). If they use our
    // standard range, the range's own per-student qualification fee applies
    // on top; if they bring their own location, it doesn't.
    privateOption: {
      liveFire: "optional",
      instructionFee: 30,
      feeType: "qualification"
    }
  },

  "NC Concealed Carry Legal Refresher": {
    pricingType: "perPerson",
    price: 40,
    liveFire: "none"
  },

  "Handgun Cleaning Basics": {
    pricingType: "perPerson",
    price: 35,
    liveFire: "none"
  },

  "Real Estate Agent Safety": {
    pricingType: "perPerson",
    price: 35,
    liveFire: "none"
  },

  "ODA Children's Firearms & Safety Fundamentals": {
    pricingType: "perPerson",
    price: 60,
    liveFire: "none"
  },

  "Private Concealed Carry Course": {
    pricingType: "perPerson",
    price: 95,
    liveFire: "fixed",
    feeType: "qualification",
    minPeople: 3
  },

  "Handgun One-on-One": {
    pricingType: "hourly",
    firstHourPrice: 30,
    additionalHalfHourPrice: 15,
    additionalPersonRate: 0.5,
    liveFire: "optional",
    feeType: "training"
  }
};

// What the range charges PER STUDENT when "use your range" is chosen.
// Which one applies is set by each class's feeType above.
const rangeFeePerPerson = {
  qualification: 10,
  training: 20
};
