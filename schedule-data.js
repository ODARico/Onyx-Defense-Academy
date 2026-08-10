/* ============================================================================
   ONYX DEFENSE ACADEMY — UPCOMING CLASSES
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD OR REMOVE A CLASS DATE.
   The website reads this list automatically — you don't need to touch the
   HTML, CSS, or any other file.

   HOW TO ADD A NEW CLASS DATE:
   1. Copy one whole block below, from the "{" to the "}," 
   2. Paste it right after the last entry in the list (before the closing "]")
   3. Fill in your details between the quotes
   4. Save the file

   FIELD GUIDE:
   - classType : must be EXACTLY one of these seven (spelling/capitalization matters):
                 "Concealed Carry"
                 "Basic Handgun"
                 "Handgun One-on-One"
                 "NC Concealed Carry Legal Refresher"
                 "Handgun Cleaning Basics"
                 "Real Estate Agent Safety"
                 "ODA Children's Firearms & Safety Fundamentals"
   - date      : the class date, formatted "YYYY-MM-DD"  (e.g. September 12, 2026 = "2026-09-12")
   - time      : whatever you want shown, e.g. "9:00 AM - 6:00 PM"
   - location  : where it's happening, e.g. "a range or location near you"
   - notes     : optional. Anything extra, e.g. "2 spots left" or "Bring your own eye/ear protection".
                 Leave as "" (empty quotes) if you don't need a note.
   - registerUrl : optional. If you have a direct registration link (e.g. from your
                 USCCA instructor listing), paste it here and the "Call to Reserve"
                 button becomes a "Register Now" button linking straight there instead.
                 Leave as "" if you don't have one -- it'll fall back to Call to Reserve.

   Classes are shown on the site automatically sorted soonest-first, and a
   date quietly drops off the list the day after it happens. To cancel a
   class, just delete its whole block (including the surrounding { }).
   ============================================================================ */

const scheduleData = [

  {
    classType: "NC Concealed Carry Legal Refresher",
    date: "2026-08-29",
    time: "8:00 AM",
    location: "Autryville, NC",
    notes: "",
    registerUrl: "https://www.usconcealedcarry.com/firearms-training/instructors/north-carolina-instructors/onyx-defense-academy-llc-3016131/class-autryville-nc-nc-concealed-carry-legal-refresher-92cc0/"
  },
  {
    classType: "Concealed Carry",
    date: "2026-08-29",
    time: "8:00 AM",
    location: "Autryville, NC",
    notes: "",
    registerUrl: "https://www.usconcealedcarry.com/firearms-training/instructors/north-carolina-instructors/onyx-defense-academy-llc-3016131/class-autryville-nc-nc-concealed-carry-class-2e5ca/"
  },
   
  // EXAMPLE — copy this block for classes without a USCCA registration link:
  // {
  //   classType: "Concealed Carry",
  //   date: "2026-09-12",
  //   time: "9:00 AM - 6:00 PM",
  //   location: "a range or location near you",
  //   notes: "",
  //   registerUrl: ""
  // },

];
