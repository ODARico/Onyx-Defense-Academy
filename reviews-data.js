/* ============================================================================
   ONYX DEFENSE ACADEMY — STUDENT REVIEWS
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD OR REMOVE A REVIEW.
   The homepage reads this list automatically.

   HOW TO ADD A REVIEW:
   1. Copy one whole block below, from the "{" to the "},"
   2. Paste it right after the last entry (before the closing "]")
   3. Fill in your details between the quotes
   4. Save the file

   FIELD GUIDE:
   - quote   : what the student wrote, in their words. No quotation marks
               needed — the site adds those. Careful: a " inside the text will
               break the file. Use a ' or reword if you ever need one.
   - name    : how you want them credited, e.g. "Austin B." First name and last
               initial reads as respectful and keeps a student's full name off
               a public page. Leave "" and the card shows "Verified student".
   - classId : which class they took. Must be EXACTLY one of these four, or ""
               to leave the card unlabeled:
                 "Concealed Carry"
                 "Basic Handgun"
                 "Handgun One-on-One"
                 "NC Concealed Carry Legal Refresher"
               Every review currently in this file was from a Concealed Carry
               class. Set this per review as you add other courses.
   - date    : "YYYY-MM-DD", the date of the CLASS (not the review). Used for
               ordering only — newest shows first.

   To remove a review, delete its whole block (including the { and }).
   If this list is empty, the whole reviews section hides itself automatically.

   ---------------------------------------------------------------------------
   HOW MANY SHOW AT ONCE
   ---------------------------------------------------------------------------
   Keep ALL your reviews in the list below — the site does not show them all at
   once. On every page load it picks a few at random, so the section stays a
   readable size and repeat visitors see different ones. Change the number in
   reviewsShowCount just below to show more or fewer. If you have fewer reviews
   than that number, it simply shows all of them.
   ============================================================================ */

// How many reviews to show at a time. 3 fits neatly across on a desktop.
const reviewsShowCount = 3;

const reviewsData = [

  {
    quote: "Rico is absolutely amazing as an instructor. He’s 100% professional and is able to make the info understandable to everyone. I absolutely recommend him to someone new or knowledgeable.",
    name: "Austin B.",
    classId: "Concealed Carry",
    date: "2026-01-24"
  },

  {
    quote: "Christian is very knowledgeable and explains the material clearly. The class was well organized, structured effectively, and easy to follow. I felt comfortable asking questions, and the information was presented in a way that was both informative and engaging. Overall, it was an excellent class experience.",
    name: "Shelby S.",
    classId: "Concealed Carry",
    date: "2026-01-24"
  },

  {
    quote: "Great instructor",
    name: "Dewayne C.",
    classId: "Concealed Carry",
    date: "2025-10-18"
  },

  {
    quote: "Great instructor we had a great time and learned a lot.",
    name: "Ricardo A.",
    classId: "Concealed Carry",
    date: "2025-10-18"
  },

  {
    quote: "Class was educational and concise. Range time was great afterwards.",
    name: "Gabriela J.",
    classId: "Concealed Carry",
    date: "2025-10-18"
  },

  {
    quote: "Learned so much, and had a great time. 100% recommend!",
    name: "Cortney F.",
    classId: "Concealed Carry",
    date: "2025-06-28"
  },

  {
    quote: "This was an excellent class and the instructor was very experienced in his teaching style and the knowledge of all different types of hand guns.",
    name: "Terry C.",
    classId: "Concealed Carry",
    date: "2025-05-17"
  },

  {
    quote: "Instructor was great, knowledgeable and able to answer all questions.",
    name: "Jordan H.",
    classId: "Concealed Carry",
    date: "2024-01-06"
  },

  {
    quote: "Great instruction, well taught and prepared me for concealed carry",
    name: "William P.",
    classId: "Concealed Carry",
    date: "2023-07-22"
  },

  {
    quote: "A very well organized and carried out class very interactive and easy to understand.",
    name: "Nathaniel G.",
    classId: "Concealed Carry",
    date: "2023-07-22"
  },

  {
    quote: "Great course and instructor. Very knowledgeable and elaborates on any questions asked.",
    name: "Dedrick M.",
    classId: "Concealed Carry",
    date: "2023-06-24"
  },

  {
    quote: "Very professional and thorough instructor! Entertained any questions without compromise or loss of focus. Created an excellent class room environment allowing for a positive learning environment. I fully recommend this instructor.",
    name: "Seldon W.",
    classId: "Concealed Carry",
    date: "2023-05-27"
  },

  {
    quote: "Absolutely a great class!! The instructor Mr. Rios was very knowledgeable and made the material easy to understand. Safety was definitely implemented vigorously throughout the class. 10 out of 10 would recommend this class!",
    name: "",
    classId: "Concealed Carry",
    date: "2023-05-27"
  },

  // EXAMPLE — copy this block for each new review:
  // {
  //   quote: "What the student wrote goes here.",
  //   name: "First L.",
  //   classId: "Basic Handgun",
  //   date: "2026-03-14"
  // },

];
