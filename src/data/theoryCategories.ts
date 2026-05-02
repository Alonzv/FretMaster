export interface TheoryCategory {
  id: string
  title: { he: string; en: string }
  description: { he: string; en: string }
  articles: string[]
}

export const theoryCategories: TheoryCategory[] = [
  {
    id: "foundations",
    title: { he: "יסודות ופיזיקה", en: "Foundations & Physics" },
    description: {
      he: "המכניקה של הצליל, בניית הפרטבורד והבנת הגיטרה ברמה המדעית.",
      en: "The mechanics of sound, fretboard construction, and understanding the guitar scientifically.",
    },
    articles: ["physics_of_the_string", "fretboard_matrix", "sight_reading"],
  },
  {
    id: "scales",
    title: { he: "סולמות ומרווחים", en: "Scales & Intervals" },
    description: {
      he: "אבני הבניין של המוזיקה — מרווחים, סולם המז'ור ושורשי כל הידע.",
      en: "The building blocks of music — intervals, the major scale, and the roots of all knowledge.",
    },
    articles: ["major_scale", "intervals"],
  },
  {
    id: "improvisation",
    title: { he: "שלד האלתור", en: "The Improvisation Core" },
    description: {
      he: "שבירת קופסאות, סולמות בסיסיים והשפה של הרוק והבלוז.",
      en: "Breaking boxes, basic scales, and the language of rock and blues.",
    },
    articles: ["pentatonic_masterclass"],
  },
  {
    id: "harmony",
    title: { he: "ארכיטקטורה הרמונית", en: "Harmonic Architecture" },
    description: {
      he: "כוחות משיכה, קדנצות, ווייסינגז ומתחי צבע עליונים.",
      en: "Gravitational forces, cadences, drop voicings, and upper extensions.",
    },
    articles: ["triads_chords", "functional_harmony", "chord_voicings_extensions", "circle_of_fifths"],
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
