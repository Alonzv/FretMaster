export interface TheoryCategory {
  id: string
  title: { he: string; en: string }
  description: { he: string; en: string }
  articles: string[]
}

export const theoryCategories: TheoryCategory[] = [
  {
    id: "foundations",
    title: { he: "יסודות הגיטרה", en: "Guitar Foundations" },
    description: {
      he: "המכניקה של הצליל, בניית הפרטבורד וקריאת תווים — מהפיזיקה ועד לניווט על הסף.",
      en: "The mechanics of sound, fretboard construction, and reading notation — from physics to navigation.",
    },
    articles: ["physics_of_the_string", "fretboard_matrix", "sight_reading"],
  },
  {
    id: "scales",
    title: { he: "סולמות ומרווחים", en: "Scales & Intervals" },
    description: {
      he: "מרווחים כיחידות יסוד, סולם המז'ור כשלד, והפנטטוני כמפתח לאלתור.",
      en: "Intervals as atomic units, the major scale as the skeleton, and the pentatonic as the key to improvisation.",
    },
    articles: ["intervals", "major_scale", "minor_scales_masterclass", "pentatonic_masterclass"],
  },
  {
    id: "harmony",
    title: { he: "אקורדים והרמוניה", en: "Chords & Harmony" },
    description: {
      he: "בניית אקורדים, מעגל הקווינטות, הרמוניה פונקציונלית וווייסינגז מתקדמים.",
      en: "Building chords, the circle of fifths, functional harmony, and advanced voicings.",
    },
    articles: ["triads_chords", "circle_of_fifths", "functional_harmony", "chord_voicings_extensions"],
  },
  {
    id: "modes",
    title: { he: "הרמוניה מודאלית", en: "Modal Harmony" },
    description: {
      he: "הגישה המקבילה, פילטרים רגשיים ואלתור מורכב.",
      en: "The parallel approach, emotional filters, and complex improvisation.",
    },
    articles: ["modes_filters_of_emotion"],
  },
]
