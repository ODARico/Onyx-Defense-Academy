/* ============================================================================
   ONYX DEFENSE ACADEMY — NC CONCEALED CARRY RECIPROCITY
   ============================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE INTERACTIVE MAP.

   ---------------------------------------------------------------------------
   READ THIS FIRST
   ---------------------------------------------------------------------------
   Reciprocity changes. States pass laws, agreements get signed and dropped,
   and a state that honored your permit last year may not this year. Getting
   this wrong is not a typo -- it can mean a student carrying illegally in
   another state. Treat every change to this file as something to verify
   against an official source before you commit it.

   The statuses below were read off the USCCA reciprocity map image already on
   this site, which is marked current as of 07/2026. VERIFY THEM against that
   image (assets/nc-reciprocity-map.png) before you publish, and re-check
   whenever the USCCA updates their map.

   ---------------------------------------------------------------------------
   HOW TO UPDATE A STATE
   ---------------------------------------------------------------------------
   Find the state's line below and change the word in status: to one of these
   four (spelling matters -- anything else shows as "unknown" on the site):

     "yes"             -- honors your NC permit
     "constitutional"  -- honors your NC permit AND allows permitless carry
     "restricted"      -- honors your NC permit, but with conditions
     "no"              -- does NOT honor your NC permit
     "home"            -- reserved for North Carolina itself

   Then update asOf below to the date you verified it, e.g. "11/2026". That
   date is shown to visitors, so keep it honest.

   OPTIONAL FIELDS
   - note        : one short sentence shown under the status, for anything
                   worth flagging. Leave "" if there's nothing to add.
   - officialUrl : a link to that state's official carry-law page (Attorney
                   General or State Police). Left blank on purpose -- fill
                   these in over time with links YOU have checked. When blank,
                   the panel just shows the USCCA link instead. Never guess a
                   URL here; a dead link on a legal page looks worse than none.
   ============================================================================ */

const reciprocityData = {

  // Date these statuses were last verified. Shown on the site.
  asOf: "07/2026",

  // Where visitors go for authoritative, current information.
  usccaUrl: "https://www.usconcealedcarry.com/firearms-training/instructors/north-carolina-instructors/onyx-defense-academy-llc-3016131/",

  states: [
  { abbr: "AL", name: "Alabama", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "AK", name: "Alaska", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "AZ", name: "Arizona", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "AR", name: "Arkansas", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "CA", name: "California", status: "no", note: "", officialUrl: "" },
  { abbr: "CO", name: "Colorado", status: "restricted", note: "", officialUrl: "" },
  { abbr: "CT", name: "Connecticut", status: "no", note: "", officialUrl: "" },
  { abbr: "DE", name: "Delaware", status: "yes", note: "", officialUrl: "" },
  { abbr: "DC", name: "District of Columbia", status: "no", note: "", officialUrl: "" },
  { abbr: "FL", name: "Florida", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "GA", name: "Georgia", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "HI", name: "Hawaii", status: "no", note: "", officialUrl: "" },
  { abbr: "ID", name: "Idaho", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "IL", name: "Illinois", status: "no", note: "", officialUrl: "" },
  { abbr: "IN", name: "Indiana", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "IA", name: "Iowa", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "KS", name: "Kansas", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "KY", name: "Kentucky", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "LA", name: "Louisiana", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "ME", name: "Maine", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "MD", name: "Maryland", status: "no", note: "", officialUrl: "" },
  { abbr: "MA", name: "Massachusetts", status: "no", note: "", officialUrl: "" },
  { abbr: "MI", name: "Michigan", status: "restricted", note: "", officialUrl: "" },
  { abbr: "MN", name: "Minnesota", status: "yes", note: "", officialUrl: "" },
  { abbr: "MS", name: "Mississippi", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "MO", name: "Missouri", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "MT", name: "Montana", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "NE", name: "Nebraska", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "NV", name: "Nevada", status: "yes", note: "", officialUrl: "" },
  { abbr: "NH", name: "New Hampshire", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "NJ", name: "New Jersey", status: "no", note: "", officialUrl: "" },
  { abbr: "NM", name: "New Mexico", status: "yes", note: "", officialUrl: "" },
  { abbr: "NY", name: "New York", status: "no", note: "New York City has its own separate rules on top of state law.", officialUrl: "" },
  { abbr: "NC", name: "North Carolina", status: "home", note: "", officialUrl: "" },
  { abbr: "ND", name: "North Dakota", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "OH", name: "Ohio", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "OK", name: "Oklahoma", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "OR", name: "Oregon", status: "no", note: "", officialUrl: "" },
  { abbr: "PA", name: "Pennsylvania", status: "restricted", note: "", officialUrl: "" },
  { abbr: "RI", name: "Rhode Island", status: "no", note: "", officialUrl: "" },
  { abbr: "SC", name: "South Carolina", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "SD", name: "South Dakota", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "TN", name: "Tennessee", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "TX", name: "Texas", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "UT", name: "Utah", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "VT", name: "Vermont", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "VA", name: "Virginia", status: "yes", note: "", officialUrl: "" },
  { abbr: "WA", name: "Washington", status: "yes", note: "", officialUrl: "" },
  { abbr: "WV", name: "West Virginia", status: "constitutional", note: "", officialUrl: "" },
  { abbr: "WI", name: "Wisconsin", status: "yes", note: "", officialUrl: "" },
  { abbr: "WY", name: "Wyoming", status: "constitutional", note: "", officialUrl: "" },
  ]
};
