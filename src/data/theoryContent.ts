export interface BilingualText {
  he: string;
  en: string;
}

export interface ArticleSection {
  type: 'paragraph' | 'highlight' | 'example' | 'fretboard';
  title?: BilingualText;
  content: BilingualText;
}

export interface TheoryArticle {
  id: string;
  title: BilingualText;
  subtitle: BilingualText;
  tags: BilingualText[];
  sections: ArticleSection[];
}

export const theoryContent: Record<string, TheoryArticle> = {
  major_scale: {
    id: "major_scale",
    title: { he: "הסולם המז'ורי", en: "The Major Scale" },
    subtitle: {
      he: "ה-DNA של המוזיקה המערבית ונקודת האפס של כל התיאוריה",
      en: "The DNA of Western Music and the Ground Zero of Theory",
    },
    tags: [
      { he: "יסודות",         en: "Basics" },
      { he: "סולמות",         en: "Scales" },
      { he: "תיאוריה_בסיסית", en: "Basic_Theory" },
    ],
    sections: [
      {
        type: "paragraph",
        title: {
          he: "הקדמה: נקודת האפס של התיאוריה",
          en: "Introduction: The Ground Zero of Theory",
        },
        content: {
          he: "אם נמשיל את עולם המוזיקה למערכת הפעלה, הסולם המז'ורי הוא קוד המקור. זוהי נקודת הייחוס שממנה הכל נמדד. כשמוזיקאים מדברים על סולמות אחרים, על אקורדים מורכבים, או על מרווחים (אינטרוולים), הם תמיד משווים אותם לסולם המז'ורי. הסולם המז'ורי מורכב משבעה צלילים (ועוד אחד שסוגר את המעגל ומתחיל אותו מחדש). מבחינה רגשית, האוזן האנושית התרגלה לפרש את רצף הצלילים הזה כ\"שמח\", \"פתוח\", \"יציב\" ו\"פתור\". בניגוד לסולמות מינוריים שמשרים אווירה נוגה או מלנכולית, הסולם המז'ורי מרגיש כמו חזרה הביתה. כ-90 אחוזים משירי הפופ, הרוק, והפולק שאתה שומע ברדיו, נכתבו מתוך המאגר של שבעת הצלילים הללו. כדי להבין את הגיטרה באמת, החוקיות של הסולם הזה חייבת להפוך לטבע שני.",
          en: "If we compare the world of music to an operating system, the major scale is the source code. It is the reference point from which everything is measured. When musicians talk about other scales, complex chords, or intervals, they always compare them to the major scale. It consists of seven notes (plus one that closes the loop and starts it anew). Emotionally, the human ear has grown accustomed to interpreting this sequence of sounds as 'happy,' 'open,' 'stable,' and 'resolved.' Unlike minor scales that evoke a gloomy or melancholic atmosphere, the major scale feels like coming home. About 90 percent of the pop, rock, and folk songs you hear on the radio were written from the pool of these seven notes. To truly understand the guitar, the mechanics of this scale must become second nature.",
        },
      },
      {
        type: "highlight",
        title: {
          he: "פרק 1: האנטומיה של הסולם (נוסחת הקסם)",
          en: "Chapter 1: Anatomy of the Scale (The Magic Formula)",
        },
        content: {
          he: "כדי להבין איך הסולם המז'ורי עובד, אנחנו צריכים קודם כל להסכים על יחידות המידה שלנו. בגיטרה, יחידת המידה הבסיסית ביותר היא הסריג (Fret). תזוזה של סריג אחד בלבד (לדוגמה, מהסריג השלישי לסריג הרביעי על אותו מיתר) נקראת בתיאוריה \"חצי טון\" (Half Step). תזוזה של שני סריגים נקראת \"טון שלם\" (Whole Step). סולם מז'ורי הוא לא אוסף אקראי של צלילים שבמקרה נשמעים טוב ביחד. מדובר בנוסחה מתמטית-גיאומטרית נוקשה של מרחקים. אתה יכול לבחור כל צליל בעולם שתרצה, להכריז עליו כנקודת ההתחלה שלך (זה נקרא ה\"שורש\" או ה\"טוניקה\"), ואם תצעד קדימה לפי הנוסחה הבאה, בהכרח תקבל את הסולם המז'ורי של אותו צליל. הנוסחה מורכבת מצעדים של טונים שלמים וחצאי טונים, והיא הולכת כך: טון, טון, חצי-טון, טון, טון, טון, חצי-טון. באנגלית מקובל לשנן את זה כרצף האותיות: W-W-H-W-W-W-H. בוא נבדוק את זה על הסולם המוכר ביותר, סולם דו מז'ור (C Major). הסולם הזה מיוחד כי אין בו שום \"דיאז\" או \"במול\". בפסנתר, אלו רק הקלידים הלבנים. אם נתחיל מהצליל דו (C) ונפעיל את הנוסחה: מ-C נעלה טון שלם אל D (רֶה). מ-D נעלה טון שלם אל E (מִי). מ-E נעלה חצי טון אל F (פָה). מ-F נעלה טון שלם אל G (סוֹל). מ-G נעלה טון שלם אל A (לָה). מ-A נעלה טון שלם אל B (סִי). מ-B נעלה חצי טון אל C (דוֹ וחזרנו לשורש, רק אוקטבה אחת למעלה).",
          en: "To understand how the major scale works, we first need to agree on our units of measurement. On the guitar, the most basic unit of measurement is the fret. Moving one fret (for example, from the third to the fourth fret on the same string) is theoretically called a 'Half Step'. Moving two frets is called a 'Whole Step'. A major scale is not a random collection of notes that happen to sound good together. It is a strict mathematical-geometrical formula of distances. You can choose any note in the world, declare it your starting point (called the 'Root' or 'Tonic'), and if you step forward according to the following formula, you will inevitably get the major scale of that note. The formula consists of whole steps and half steps, and it goes like this: Whole, Whole, Half, Whole, Whole, Whole, Half. It is commonly memorized as the sequence: W-W-H-W-W-W-H. Let's test this on the most well-known scale, C Major. This scale is special because it has no 'sharps' (#) or 'flats' (b). On a piano, these are just the white keys. If we start from the note C and apply the formula: From C we go up a whole step to D. From D up a whole step to E. From E up a half step to F. From F up a whole step to G. From G up a whole step to A. From A up a whole step to B. From B up a half step to C (and we're back to the root, just one octave higher).",
        },
      },
      {
        type: "fretboard",
        title: {
          he: "פרק 2: תיאוריה פוגשת עץ ומיתרים (הגישה הליניארית)",
          en: "Chapter 2: Theory Meets Wood and Strings (The Linear Approach)",
        },
        content: {
          he: "רוב הגיטריסטים לומדים סולמות דרך \"קופסאות\" (Boxes) בגלל שנוח לנגן אותן, אבל הן מחביאות את התיאוריה. הדרך הכי טובה לראות ולהפנים את הנוסחה של הסולם המז'ורי היא לנגן אותה על מיתר אחד בלבד. ככה המרחקים קופצים לעין. בוא ניקח את המיתר החמישי הפתוח בגיטרה. הצליל שלו הוא A (לָה). זה יהיה השורש שלנו. עכשיו נצעד לפי הנוסחה (טון = 2 סריגים, חצי טון = סריג 1): התחלה: מיתר פתוח (A). צעד 1 (טון): סריג 2 (B). צעד 2 (טון): סריג 4 (C# שים לב, היינו צריכים לעלות טון שלם מ-B, אז דילגנו על C שנמצא בסריג 3). צעד 3 (חצי טון): סריג 5 (D). צעד 4 (טון): סריג 7 (E). צעד 5 (טון): סריג 9 (F#). צעד 6 (טון): סריג 11 (G#). צעד 7 (חצי טון): סריג 12 (A - חזרנו הביתה). ברגע שאתה מנגן את המיתר הזה הלוך ושוב, אתה שומע מיד את אופי הסולם. עם זאת, לנגן סולואים על מיתר אחד זה לא יעיל. האצבעות יצטרכו לקפוץ מצד אחד של הצוואר לצד השני. לכן הגיטרה מכוונת בצורה שמאפשרת לנו לחתוך את הנוסחה הזו ולסדר אותה לרוחב המיתרים. במקום לעלות שני סריגים על אותו מיתר, אנחנו יכולים פשוט לעבור למיתר שמתחתיו. המרחקים נשארים בדיוק אותם מרחקים, הם פשוט מקופלים לתוך מבנה שמתאים לכף היד.",
          en: "Most guitarists learn scales through 'Boxes' because they are convenient to play, but they hide the theory. The best way to see and internalize the major scale formula is to play it on just one string. This way, the distances pop out at you. Let's take the open fifth string on the guitar. Its note is A. This will be our root. Now let's step according to the formula (Whole = 2 frets, Half = 1 fret): Start: Open string (A). Step 1 (Whole): Fret 2 (B). Step 2 (Whole): Fret 4 (C# - notice, we had to go up a whole step from B, so we skipped C which is on fret 3). Step 3 (Half): Fret 5 (D). Step 4 (Whole): Fret 7 (E). Step 5 (Whole): Fret 9 (F#). Step 6 (Whole): Fret 11 (G#). Step 7 (Half): Fret 12 (A - we are back home). The moment you play this string back and forth, you immediately hear the character of the scale. However, playing solos on one string isn't efficient. Your fingers would have to jump from one side of the neck to the other. Therefore, the guitar is tuned in a way that allows us to chop this formula and arrange it across the strings. Instead of moving up two frets on the same string, we can simply move to the string below it. The distances remain exactly the same; they are just folded into a structure that fits the palm of your hand.",
        },
      },
      {
        type: "paragraph",
        title: {
          he: "פרק 3: משפחת האקורדים (הרמוניה דיאטונית)",
          en: "Chapter 3: The Chord Family (Diatonic Harmony)",
        },
        content: {
          he: "הסולם המז'ורי הוא לא רק קו מלודי שאפשר לנגן תו אחרי תו. הוא גם המפעל שבו מייצרים אקורדים. אם תיקח את שבעת הצלילים של סולם C Major, ותרכיב מהם אקורדים על ידי דילוגים (למשל צליל 1, צליל 3 וצליל 5), תקבל סדרה של שבעה אקורדים ששייכים לאותה משפחה. מכיוון שכולם בנויים מאותם חומרי גלם, הם יישמעו פנטסטי יחד. זה נקרא \"מהלך אקורדים דיאטוני\". החוקיות המז'ורית מייצרת תמיד את אותו מבנה משפחתי, לא משנה באיזה שורש התחלת: האקורד הראשון (השורש), הרביעי והחמישי יהיו תמיד אקורדים מז'וריים (שמחים). האקורד השני, השלישי והשישי יהיו תמיד אקורדים מינוריים (עצובים). האקורד השביעי יהיה מוקטן (Diminished), בעל צליל מתוח ולא יציב. אם נישאר ב-C Major, האקורדים המז'וריים שלנו הם C, F, G. האקורדים המינוריים שלנו הם Am, Dm, Em. זו הסיבה ששיר שמורכב מהאקורדים C, G, Am, F נשמע לנו כל כך טבעי והגיוני, הוא פשוט מנגן את הדרגות של הסולם המז'ורי.",
          en: "The major scale is not just a melodic line you can play note by note. It is also the factory where chords are made. If you take the seven notes of the C Major scale, and build chords from them by skipping notes (e.g., note 1, note 3, and note 5), you get a series of seven chords that belong to the same family. Because they are all built from the same raw materials, they will sound fantastic together. This is called a 'diatonic chord progression'. The major scale logic always produces the exact same family structure, no matter which root you started on: The first chord (the root), the fourth, and the fifth will always be major chords (happy). The second, third, and sixth chords will always be minor chords (sad). The seventh chord will be diminished, possessing a tense and unstable sound. If we stay in C Major, our major chords are C, F, and G. Our minor chords are Am, Dm, and Em. This is why a song composed of the chords C, G, Am, F sounds so natural and logical to us; it is simply playing the degrees of the major scale.",
        },
      },
      {
        type: "example",
        title: {
          he: "פרק 4: הסולם המז'ורי בעולם האמיתי",
          en: "Chapter 4: The Major Scale in the Real World",
        },
        content: {
          he: "The Beatles - Let It Be: בית הספר הטוב ביותר לסולם המז'ורי. השיר כתוב בסולם דו מז'ור (C Major). מהלך האקורדים המפורסם (C, G, Am, F) משתמש בדרגות הראשונה, החמישית, השישית והרביעית של הסולם. גם סולו הגיטרה של ג'ורג' האריסון מסתמך כמעט לחלוטין על התווים הנקיים של סולם דו מז'ור (בשילוב פנטטוניקה), מה שמעניק לסולו תחושה של השלמה, תקווה ובהירות.\nPink Floyd - Wish You Were Here: ריף הפתיחה האקוסטי המפורסם בעולם. השיר מבוסס על סולם סול מז'ור (G Major). דיוויד גילמור משתמש בסולם המז'ורי כדי לנגן מלודיה שנשמעת עממית, חמה ופתוחה, במיוחד בגלל השימוש במיתר סול (G) הפתוח שמהדהד ברקע ומשמש כטוניקה יציבה בזמן שהאצבעות מטיילות על הסולם.\nLudwig van Beethoven - Symphony No. 9 (Ode to Joy): המלודיה אולי המפורסמת ביותר בהיסטוריה האנושית מבוססת בצורה הטהורה ביותר על הסולם המז'ורי. המנגינה צועדת למעלה ולמטה על פני חמישה צלילים רצופים מתוך הסולם (דרגות 1 עד 5), שלב אחר שלב, ללא קפיצות גדולות. המתמטיקה הפשוטה הזו היא מה שמייצר את תחושת הניצחון והאוניברסליות של היצירה.",
          en: "The Beatles - Let It Be: The best school for the major scale. The song is written in C Major. The famous chord progression (C, G, Am, F) uses the first, fifth, sixth, and fourth degrees of the scale. George Harrison's guitar solo also relies almost entirely on the clean notes of the C major scale (combined with pentatonics), which gives the solo a sense of completion, hope, and clarity.\nPink Floyd - Wish You Were Here: The most famous acoustic opening riff in the world. The song is based on the G Major scale. David Gilmour uses the major scale to play a melody that sounds folk-like, warm, and open, especially due to the use of the open G string that resonates in the background and serves as a stable tonic while the fingers travel across the scale.\nLudwig van Beethoven - Symphony No. 9 (Ode to Joy): Perhaps the most famous melody in human history is based in the purest way on the major scale. The melody marches up and down across five consecutive notes from the scale (degrees 1 through 5), step by step, without large leaps. This simple math is what creates the piece's sense of triumph and universality.",
        },
      },
    ],
  },
};
