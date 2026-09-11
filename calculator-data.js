/* ============================================================================
   ONYX DEFENSE ACADEMY — GROUP COST CALCULATOR
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE PRICING OR RANGE-FEE
   RULES FOR THE CALCULATOR. The website reads this automatically -- you
   don't need to touch the HTML, CSS, or script.js.

   ---------------------------------------------------------------------------
   FIELD GUIDE — one entry per class, keyed by its EXACT name
   ---------------------------------------------------------------------------
   The key must exactly match a class name used in classes.html /
   schedule-data.js / reviews-data.js / quiz-data.js, character for
   character, or the calculator won't be able to find that class's card to
   confirm pricing/availability.

   - pricingType : "perPerson" or "hourly".

   For "perPerson" classes:
   - price     : dollars per student.
   - liveFire  : "none" (never a range question/fee) or "fixed" (this class
                 always includes live fire, so always ask the range
                 question).
   - feeType   : only needed when liveFire is "fixed". Either
                 "qualification" or "training" -- see rangeFeePerPerson
                 below for what each one costs.
   - minPeople : optional. If set, the calculator shows a note instead of a
                 total when the headcount is below this number.

   For "hourly" classes (currently just Handgun One-on-One):
   - firstHourPrice        : price for the first hour.
   - additionalHalfHourPrice : price for each extra 30 minutes after that.
   - liveFire              : "optional" -- whether this session includes
                              range time is the student's choice, not fixed
                              to the class. First asks whether there's range
                              time at all; only asks the location question
                              (see below) if the answer is yes.
   - feeType               : the range-fee type charged IF range time is
                              chosen (see rangeFeePerPerson below).
   - rangeFlatFee          : the flat fee added if they choose "use your
                              range" -- flat because this is a single
                              student, not multiplied by a headcount.

   ---------------------------------------------------------------------------
   THE RANGE QUESTION ITSELF
   ---------------------------------------------------------------------------
   Whenever a range question is shown (liveFire "fixed", or "optional" AND
   the student said yes to range time), the choice is the same either way:
   "I have my own location" (free) or "Use your range" (adds a fee). For
   perPerson classes that fee is per student, using rangeFeePerPerson below.
   For the hourly class it's the flat rangeFlatFee instead.

   rangeFeePerPerson maps feeType -> dollars per student when "Use your
   range" is chosen for a perPerson class.
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
    liveFire: "fixed",
    feeType: "qualification"
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
    liveFire: "optional",
    feeType: "training",
    rangeFlatFee: 20
  }
};

// Dollars per student when a perPerson class's range question is answered
// "Use your range" -- keyed by feeType.
const rangeFeePerPerson = {
  qualification: 10,
  training: 20
};
