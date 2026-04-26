export interface ArticleSection {
  type: 'paragraph' | 'highlight' | 'example' | 'fretboard' | 'interactive';
  title?: string;
  content: string;
}

export interface LocalizedContent {
  title: string;
  subtitle: string;
  tags: string[];
  sections: ArticleSection[];
}

// Backwards-compat alias
export type ArticleLang = LocalizedContent;

export interface TheoryArticle {
  id: string;
  he: LocalizedContent;
  en: LocalizedContent;
}

export const theoryContent: Record<string, TheoryArticle> = {
  major_scale: {
    id: "major_scale",
    he: {
      title: "הסולם המז'ורי",
      subtitle: "ה-DNA של המוזיקה המערבית ונקודת האפס של כל התיאוריה",
      tags: ["יסודות", "סולמות", "תיאוריה_בסיסית"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: נקודת האפס של התיאוריה",
          content: "אם נמשיל את עולם המוזיקה למערכת הפעלה, הסולם המז'ורי הוא קוד המקור. זוהי נקודת הייחוס שממנה הכל נמדד. כשמוזיקאים מדברים על סולמות אחרים, על אקורדים מורכבים, או על מרווחים (אינטרוולים), הם תמיד משווים אותם לסולם המז'ורי. הסולם המז'ורי מורכב משבעה צלילים (ועוד אחד שסוגר את המעגל ומתחיל אותו מחדש). מבחינה רגשית, האוזן האנושית התרגלה לפרש את רצף הצלילים הזה כ\"שמח\", \"פתוח\", \"יציב\" ו\"פתור\". בניגוד לסולמות מינוריים שמשרים אווירה נוגה או מלנכולית, הסולם המז'ורי מרגיש כמו חזרה הביתה. כ-90 אחוזים משירי הפופ, הרוק, והפולק שאתה שומע ברדיו, נכתבו מתוך המאגר של שבעת הצלילים הללו. כדי להבין את הגיטרה באמת, החוקיות של הסולם הזה חייבת להפוך לטבע שני."
        },
        {
          type: "highlight",
          title: "פרק 1: האנטומיה של הסולם (נוסחת הקסם)",
          content: "כדי להבין איך הסולם המז'ורי עובד, אנחנו צריכים קודם כל להסכים על יחידות המידה שלנו. בגיטרה, יחידת המידה הבסיסית ביותר היא הסריג (Fret). תזוזה של סריג אחד בלבד (לדוגמה, מהסריג השלישי לסריג הרביעי על אותו מיתר) נקראת בתיאוריה \"חצי טון\" (Half Step). תזוזה של שני סריגים נקראת \"טון שלם\" (Whole Step). סולם מז'ורי הוא לא אוסף אקראי של צלילים שבמקרה נשמעים טוב ביחד. מדובר בנוסחה מתמטית-גיאומטרית נוקשה של מרחקים. אתה יכול לבחור כל צליל בעולם שתרצה, להכריז עליו כנקודת ההתחלה שלך (זה נקרא ה\"שורש\" או ה\"טוניקה\"), ואם תצעד קדימה לפי הנוסחה הבאה, בהכרח תקבל את הסולם המז'ורי של אותו צליל. הנוסחה מורכבת מצעדים של טונים שלמים וחצאי טונים, והיא הולכת כך: טון, טון, חצי-טון, טון, טון, טון, חצי-טון. באנגלית מקובל לשנן את זה כרצף האותיות: W-W-H-W-W-W-H. בוא נבדוק את זה על הסולם המוכר ביותר, סולם דו מז'ור (C Major). הסולם הזה מיוחד כי אין בו שום \"דיאז\" או \"במול\". בפסנתר, אלו רק הקלידים הלבנים. אם נתחיל מהצליל דו (C) ונפעיל את הנוסחה: מ-C נעלה טון שלם אל D. מ-D נעלה טון שלם אל E. מ-E נעלה חצי טון אל F. מ-F נעלה טון שלם אל G. מ-G נעלה טון שלם אל A. מ-A נעלה טון שלם אל B. מ-B נעלה חצי טון אל C (חזרנו לשורש, רק אוקטבה אחת למעלה)."
        },
        {
          type: "fretboard",
          title: "פרק 2: תיאוריה פוגשת עץ ומיתרים (הגישה הליניארית)",
          content: "רוב הגיטריסטים לומדים סולמות דרך \"קופסאות\" (Boxes) בגלל שנוח לנגן אותן, אבל הן מחביאות את התיאוריה. הדרך הכי טובה לראות ולהפנים את הנוסחה של הסולם המז'ורי היא לנגן אותה על מיתר אחד בלבד. ככה המרחקים קופצים לעין. בוא ניקח את המיתר החמישי הפתוח בגיטרה. הצליל שלו הוא A (לָה). זה יהיה השורש שלנו. עכשיו נצעד לפי הנוסחה (טון = 2 סריגים, חצי טון = 1 סריג): התחלה: מיתר פתוח (A). צעד 1 (טון): סריג 2 (B). צעד 2 (טון): סריג 4 (C#). צעד 3 (חצי טון): סריג 5 (D). צעד 4 (טון): סריג 7 (E). צעד 5 (טון): סריג 9 (F#). צעד 6 (טון): סריג 11 (G#). צעד 7 (חצי טון): סריג 12 (A - חזרנו הביתה). ברגע שאתה מנגן את המיתר הזה הלוך ושוב, אתה שומע מיד את אופי הסולם. לכן הגיטרה מכוונת בצורה שמאפשרת לנו לחתוך את הנוסחה הזו ולסדר אותה לרוחב המיתרים."
        },
        {
          type: "paragraph",
          title: "פרק 3: משפחת האקורדים (הרמוניה דיאטונית)",
          content: "הסולם המז'ורי הוא לא רק קו מלודי שאפשר לנגן תו אחרי תו. הוא גם המפעל שבו מייצרים אקורדים. אם תיקח את שבעת הצלילים של סולם C Major, ותרכיב מהם אקורדים על ידי דילוגים (למשל צליל 1, צליל 3 וצליל 5), תקבל סדרה של שבעה אקורדים ששייכים לאותה משפחה. זה נקרא \"מהלך אקורדים דיאטוני\". החוקיות המז'ורית מייצרת תמיד את אותו מבנה משפחתי: האקורד הראשון, הרביעי והחמישי יהיו תמיד מז'וריים. השני, השלישי והשישי — מינוריים. השביעי — מוקטן (Diminished). ב-C Major: מז'וריים — C, F, G. מינוריים — Am, Dm, Em. זו הסיבה ששיר שמורכב מ-C, G, Am, F נשמע לנו כל כך טבעי."
        },
        {
          type: "example",
          title: "פרק 4: הסולם המז'ורי בעולם האמיתי",
          content: "The Beatles - Let It Be: השיר כתוב בסולם דו מז'ור (C Major). מהלך האקורדים המפורסם (C, G, Am, F) משתמש בדרגות הראשונה, החמישית, השישית והרביעית של הסולם. גם סולו הגיטרה של ג'ורג' האריסון מסתמך כמעט לחלוטין על התווים הנקיים של סולם דו מז'ור.\nPink Floyd - Wish You Were Here: השיר מבוסס על סולם סול מז'ור (G Major). דיוויד גילמור משתמש בסולם המז'ורי כדי לנגן מלודיה שנשמעת עממית, חמה ופתוחה, במיוחד בגלל השימוש במיתר סול (G) הפתוח שמשמש כטוניקה יציבה.\nLudwig van Beethoven - Symphony No. 9 (Ode to Joy): המלודיה המפורסמת ביותר בהיסטוריה האנושית מבוססת בצורה הטהורה ביותר על הסולם המז'ורי. המנגינה צועדת למעלה ולמטה על פני חמישה צלילים רצופים (דרגות 1 עד 5), שלב אחר שלב, ללא קפיצות גדולות."
        }
      ]
    },
    en: {
      title: "The Major Scale",
      subtitle: "The DNA of Western Music and the Ground Zero of Theory",
      tags: ["Basics", "Scales", "Basic_Theory"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: The Ground Zero of Theory",
          content: "If we compare the world of music to an operating system, the major scale is the source code. It is the reference point from which everything is measured. When musicians talk about other scales, complex chords, or intervals, they always compare them to the major scale. It consists of seven notes (plus one that closes the loop and starts it anew). Emotionally, the human ear has grown accustomed to interpreting this sequence of sounds as 'happy,' 'open,' 'stable,' and 'resolved.' Unlike minor scales that evoke a gloomy or melancholic atmosphere, the major scale feels like coming home. About 90 percent of the pop, rock, and folk songs you hear on the radio were written from the pool of these seven notes. To truly understand the guitar, the mechanics of this scale must become second nature."
        },
        {
          type: "highlight",
          title: "Chapter 1: Anatomy of the Scale (The Magic Formula)",
          content: "To understand how the major scale works, we first need to agree on our units of measurement. On the guitar, the most basic unit of measurement is the fret. Moving one fret is theoretically called a 'Half Step'. Moving two frets is called a 'Whole Step'. A major scale is not a random collection of notes that happen to sound good together. It is a strict mathematical-geometrical formula of distances. You can choose any note in the world, declare it your starting point (the 'Root' or 'Tonic'), and if you step forward according to the following formula, you will inevitably get the major scale of that note. The formula: Whole, Whole, Half, Whole, Whole, Whole, Half — commonly memorized as W-W-H-W-W-W-H. Let's test this on C Major. This scale is special because it has no sharps or flats — on a piano, these are just the white keys. From C up a whole step to D. From D up a whole step to E. From E up a half step to F. From F up a whole step to G. From G up a whole step to A. From A up a whole step to B. From B up a half step to C (back to the root, one octave higher)."
        },
        {
          type: "fretboard",
          title: "Chapter 2: Theory Meets Wood and Strings (The Linear Approach)",
          content: "Most guitarists learn scales through 'Boxes' because they are convenient to play, but they hide the theory. The best way to internalize the major scale formula is to play it on just one string — the distances pop out at you. Let's take the open fifth string (A). This is our root. Stepping by the formula (Whole = 2 frets, Half = 1 fret): Open string (A) → Fret 2 (B) → Fret 4 (C#) → Fret 5 (D) → Fret 7 (E) → Fret 9 (F#) → Fret 11 (G#) → Fret 12 (A). The moment you play this string back and forth, you immediately hear the character of the scale. The guitar is tuned so we can chop this formula and arrange it across the strings — instead of moving two frets on the same string, we simply move to the string below. The distances remain the same, just folded into a shape that fits the palm."
        },
        {
          type: "paragraph",
          title: "Chapter 3: The Chord Family (Diatonic Harmony)",
          content: "The major scale is not just a melodic line. It is also the factory where chords are made. Take the seven notes of C Major, build chords by skipping notes (note 1, note 3, note 5), and you get seven chords from the same family — because they share the same raw material, they sound fantastic together. This is called a 'diatonic chord progression'. The major scale always produces the same family structure: the 1st, 4th, and 5th chords are always major. The 2nd, 3rd, and 6th are always minor. The 7th is diminished. In C Major: major chords — C, F, G. Minor chords — Am, Dm, Em. This is why C, G, Am, F sounds so natural — it simply plays the degrees of the major scale."
        },
        {
          type: "example",
          title: "Chapter 4: The Major Scale in the Real World",
          content: "The Beatles - Let It Be: Written in C Major. The famous chord progression (C, G, Am, F) uses the 1st, 5th, 6th, and 4th degrees. George Harrison's guitar solo relies almost entirely on the clean notes of C major, giving it a sense of completion and clarity.\nPink Floyd - Wish You Were Here: Based on G Major. David Gilmour plays a melody that sounds folk-like and warm, aided by the open G string resonating as a stable tonic in the background.\nLudwig van Beethoven - Symphony No. 9 (Ode to Joy): Perhaps the most famous melody ever, built in the purest way on the major scale — marching up and down across five consecutive scale degrees, step by step. This simple math creates the sense of triumph and universality."
        }
      ]
    }
  },

  triads_chords: {
    id: "triads_chords",
    he: {
      title: "טריאדות ואקורדים",
      subtitle: "הארכיטקטורה של ההרמוניה והסוף לשינון בעל-פה",
      tags: ["יסודות", "אקורדים", "מאסטר-קלאס"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: שקר חוברות האקורדים",
          content: "רובנו התחלנו את דרכנו בגיטרה באותה צורה: פתחנו חוברת (או אתר אינטרנט), ראינו שרטוט של רשת עם נקודות שחורות, ופשוט הנחנו את האצבעות איפה שאמרו לנו. לימדו אותנו שזה C, וזה Am, וזה G. התייחסנו לאקורדים כמו אל מספרי טלפון, רצף אקראי שצריך לשנן בעל פה. ואם שכחנו את הצורה, לא יכולנו לנגן את האקורד. אבל אקורדים הם לא צורות אקראיות, והם לא קסם. אקורדים הם מבנים. בדיוק כמו שמהנדס לא מנחש איפה לשים עמודים כדי שהבניין לא יקרוס, מוזיקאי לא מנחש איפה לשים את האצבעות. בפרק הקודם למדנו על אינטרוולים, המרחקים המדויקים בין שני צלילים. עכשיו, אנחנו הולכים לקחת את המרחקים האלה, להעמיד אותם אחד על השני, ולבנות מהם ארכיטקטורה. ברגע שתבין איך אקורד בנוי, אתה לעולם לא תצטרך חוברת אקורדים יותר. אתה תוכל לבנות כל אקורד בעולם, בכל מקום על צוואר הגיטרה, לגמרי בעצמך."
        },
        {
          type: "highlight",
          title: "פרק 1: חוק השלוש (מהי טריאדה?)",
          content: "המילה 'אקורד' מתארת פשוט מצב שבו מנגנים שלושה צלילים שונים או יותר באותו הזמן. המבנה הבסיסי ביותר של אקורד במוזיקה המערבית, ה-DNA שממנו הכל מתחיל, נקרא טריאדה (Triad), קבוצה של שלושה צלילים. למה דווקא שלושה? כי זה המינימום הנדרש כדי לספר סיפור שלם. תחשוב על טריאדה כמו על בית:\n1. השורש (Root): הרצפה. היסודות של הבית. הצליל הזה נותן לאקורד את השם שלו (למשל, התו דו באקורד דו מז'ור). הוא מספק את כוח המשיכה ואת תחושת היציבות.\n2. הטרצה (Third): החלונות והצבע של הקירות. זהו הצליל השני שאנחנו מוסיפים, והוא נמצא במרחק של 'טרצה' (אינטרוול של 3 או 4 סריגים) מהשורש. הטרצה היא מתג הרגש, היא זו שקובעת באופן בלעדי אם האקורד יישמע שמח או עצוב.\n3. הקווינטה (Fifth): הגג. הצליל השלישי והאחרון נמצא במרחק של קווינטה זכה (7 סריגים) מהשורש. הוא סוגר את המבנה מלמעלה ונותן לו יציבות ועוצמה הדוקה."
        },
        {
          type: "interactive",
          content: "triad-construction"
        },
        {
          type: "fretboard",
          title: "פרק 2: מתג הרגש (הקרב בין מז'ור למינור)",
          content: "הבנו שטריאדה בנויה משורש פלוס טרצה פלוס קווינטה. אבל מה ההבדל בין אקורד שמח לאקורד עצוב? ההבדל הזה מתנקז בסופו של דבר לאצבע אחת בלבד, ולמרחק של סריג אחד בלבד.\n\nהטריאדה המז'ורית (השמחה):\nאם ניקח את תו השורש שלנו, ונוסיף לו טרצה גדולה (מרחק של 4 סריגים), נקבל אקורד מז'ורי. המרווח הזה מייצר תחושה של אור, פתיחות, חגיגה או שלווה. (הנוסחה המלאה: שורש + טרצה גדולה + קווינטה זכה).\n\nהטריאדה המינורית (העצובה):\nאם נרצה לקחת את אותו אקורד שמח ולהפוך אותו לעצוב, אנחנו לא צריכים לפרק את כל הבית. הרצפה (השורש) נשארת במקום. הגג (הקווינטה) נשאר במקום. כל מה שאנחנו צריכים לעשות זה לקחת את האצבע שמנגנת את הטרצה, ולהחליק אותה סריג אחד אחורה. ברגע שהקטנו את המרחק מ-4 סריגים ל-3 סריגים (טרצה קטנה), הכל קורס פנימה אל תוך תחושה של מלנכוליה, דרמה, או בלוז.\n\nבגיטרה, הגיאומטריה הזו היא כוח על. אתה יכול לקחת צורה של כל אקורד מז'ורי שאתה מכיר, לאתר את האצבע שמנגנת את הטרצה, להזיז אותה סריג אחד אחורה (לכיוון מפתחות הכיוון) ויצרת אקורד מינורי מבלי להסתכל בשום ספר."
        },
        {
          type: "interactive",
          content: "major-minor-flip"
        },
        {
          type: "paragraph",
          title: "פרק 3: קצוות האור והחושך (מוקטן ומוגדל)",
          content: "עד עכשיו דיברנו על בתים יציבים. הגג שלנו (הקווינטה) תמיד היה עשוי מקווינטה זכה, מרווח מושלם של 7 סריגים שלא מעורר שמחה ולא עצב, אלא פשוט יציב. אבל מה קורה אם נחליט להזיז גם את הגג?\n\nהאקורד המוקטן (Diminished):\nלוקחים אקורד מינורי (שהוא כבר עצוב ודרמטי), ואת הגג שלו (הקווינטה) מנמיכים בסריג אחד. יצרנו מצב שבו האקורד 'התכווץ' משני הכיוונים. התוצאה? סאונד של סרט אימה. האקורד המוקטן נשמע מתוח בצורה קיצונית, מעוות, ומעביר תחושה שהוא חייב להיפתר ולברוח מיד לאקורד אחר.\n\nהאקורד המוגדל (Augmented):\nלוקחים אקורד מז'ורי (שמח ופתוח), ואת הגג שלו מגביהים בסריג אחד. הפעם האקורד 'נמתח' כלפי חוץ. התוצאה היא סאונד מרחף, חלומי, מוזר, שמרגיש כאילו הוא נעלם בחלל ולא מחובר לקרקע. תחשבו על מוזיקה של פיות או קסם בסרטי דיסני ישנים."
        },
        {
          type: "example",
          title: "פרק 4: סוד המיתרים המרובים (הכפלות ו-Voicing)",
          content: "בשלב הזה אתה כנראה שואל את עצמך שאלה מתבקשת והגיונית: 'אם טריאדה מורכבת מ-3 צלילים בלבד, למה כשאני מנגן אקורד E מז'ור פשוט, אני פורט על כל 6 המיתרים של הגיטרה?'.\nזוהי התגלית הגדולה: כפילויות (Voicing).\nבאקורד E מז'ור, אתה אמנם מנגן על 6 מיתרים, אבל אתה עדיין מנגן רק 3 צלילים ייחודיים! אתה פשוט מנגן אותם שוב ושוב באוקטבות שונות.\n\nבאקורד E מז'ור קלאסי (מיתרים פתוחים):\n* מיתר 6 פתוח מנגן את השורש (E).\n* מיתר 5 מנגן את הקווינטה (B).\n* מיתר 4 מנגן שוב את השורש.\n* מיתר 3 מנגן את הטרצה הגדולה (G# - זה התו שעושה אותו שמח!).\n* מיתר 2 מנגן שוב את הקווינטה.\n* מיתר 1 מנגן שוב את השורש.\n\nההרכב המדויק של אילו כפילויות אתה בוחר לנגן, ובאיזה סדר (למשל, האם הטרצה תהיה הצליל הגבוה ביותר באקורד או הצליל האמצעי?), נקרא Voicing. זו הסיבה שאקורד C יכול להישמע עמום וכהה באזור אחד של הצוואר, ונוצץ ופעמוני באזור אחר, זה אותו אקורד (אותם 3 צלילים), פשוט עם Voicing שונה."
        },
        {
          type: "interactive",
          content: "voicing-visualizer"
        },
        {
          type: "paragraph",
          title: "סיכום: ממשננים לארכיטקטים",
          content: "ברגע שאתה מפנים שאקורד הוא נוסחה של 3 חלקים (שורש, טרצה, קווינטה), היחס שלך לצוואר הגיטרה משתנה לתמיד. אם אתה מחפש אקורד חדש, אתה לא כותב בגוגל 'איך מנגנים...', אלא אתה מסתכל על הצוואר, מוצא את השורש שאתה רוצה, בונה מעליו קווינטה ליציבות, ומחליט איזה רגש להוסיף עם הטרצה. הפכת ממישהו שמשנן ציורים, לארכיטקט שבונה הרמוניה מאפס."
        }
      ]
    },
    en: {
      title: "Triads and Chords",
      subtitle: "The Architecture of Harmony and the End of Rote Memorization",
      tags: ["Basics", "Chords", "Masterclass"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: The Chord Book Lie",
          content: "Most of us started our guitar journey the same way: we opened a book (or a website), saw a diagram of a grid with black dots, and simply placed our fingers where we were told. We were taught that this is C, and this is Am, and this is G. We treated chords like phone numbers, a random sequence to be memorized. And if we forgot the shape, we couldn't play the chord. But chords are not random shapes, and they are not magic. Chords are structures. Just as an engineer doesn't guess where to put pillars so the building won't collapse, a musician doesn't guess where to put their fingers. In the previous chapter, we learned about intervals, the exact distances between two sounds. Now, we are going to take those distances, stack them on top of each other, and build architecture out of them. Once you understand how a chord is built, you will never need a chord book again. You will be able to build any chord in the world, anywhere on the guitar neck, entirely on your own."
        },
        {
          type: "highlight",
          title: "Chapter 1: The Rule of Three (What is a Triad?)",
          content: "The word 'chord' simply describes a situation where three or more different notes are played at the same time. The most basic structure of a chord in Western music, the DNA from which everything begins, is called a Triad, a group of three notes. Why three? Because that's the minimum required to tell a complete story. Think of a triad like a house:\n1. The Root: The floor. The foundation of the house. This note gives the chord its name (for example, the note C in a C Major chord). It provides the gravity and the sense of stability.\n2. The Third: The windows and the color of the walls. This is the second note we add, and it is located at a distance of a 'third' (an interval of 3 or 4 frets) from the root. The third is the emotion switch, it solely determines whether the chord will sound happy or sad.\n3. The Fifth: The roof. The third and final note is located at a distance of a perfect fifth (7 frets) from the root. It closes the structure from above and gives it tight stability and power."
        },
        {
          type: "interactive",
          content: "triad-construction"
        },
        {
          type: "fretboard",
          title: "Chapter 2: The Emotion Switch (The Battle Between Major and Minor)",
          content: "We understand that a triad is built of a root plus a third plus a fifth. But what is the difference between a happy chord and a sad chord? This difference ultimately boils down to just one finger, and a distance of just one fret.\n\nThe Major Triad (The Happy One):\nIf we take our root note, and add a major third (a distance of 4 frets) to it, we get a major chord. This interval creates a sense of light, openness, celebration, or tranquility. (The full formula: Root + Major 3rd + Perfect 5th).\n\nThe Minor Triad (The Sad One):\nIf we want to take that same happy chord and make it sad, we don't need to tear down the whole house. The floor (root) stays in place. The roof (fifth) stays in place. All we have to do is take the finger playing the third, and slide it one fret back. The moment we reduce the distance from 4 frets to 3 frets (minor third), everything collapses inward into a feeling of melancholy, drama, or blues.\n\nOn the guitar, this geometry is a superpower. You can take the shape of any major chord you know, locate the finger playing the third, move it one fret back (towards the tuning pegs) and you've created a minor chord without looking at any book."
        },
        {
          type: "interactive",
          content: "major-minor-flip"
        },
        {
          type: "paragraph",
          title: "Chapter 3: The Edges of Light and Dark (Diminished and Augmented)",
          content: "Until now we have talked about stable houses. Our roof (the fifth) has always been made of a perfect fifth, a perfect interval of 7 frets that evokes neither joy nor sadness, but is simply stable. But what happens if we decide to move the roof as well?\n\nThe Diminished Chord:\nTake a minor chord (which is already sad and dramatic), and lower its roof (the fifth) by one fret. We have created a situation where the chord has 'shrunk' from both directions. The result? The sound of a horror movie. The diminished chord sounds extremely tense, distorted, and conveys a feeling that it must be resolved and escape immediately to another chord.\n\nThe Augmented Chord:\nTake a major chord (happy and open), and raise its roof by one fret. This time the chord is 'stretched' outwards. The result is a floating, dreamy, bizarre sound that feels as if it disappears into space and is ungrounded. Think of fairy music or magic in old Disney movies."
        },
        {
          type: "example",
          title: "Chapter 4: The Secret of Multiple Strings (Voicing)",
          content: "At this point you are probably asking yourself an obvious and logical question: 'If a triad consists of only 3 notes, why is it that when I play a simple E Major chord, I strum all 6 strings of the guitar?'.\nThis is the great discovery: Voicings (Doublings).\nIn an E Major chord, you may be playing on 6 strings, but you are still only playing 3 unique notes! You are simply playing them over and over again in different octaves.\n\nIn a classic open E Major chord:\n* The open 6th string plays the Root (E).\n* The 5th string plays the Fifth (B).\n* The 4th string plays the Root again.\n* The 3rd string plays the Major Third (G# - this is the note that makes it happy!).\n* The 2nd string plays the Fifth again.\n* The 1st string plays the Root again.\n\nThe exact composition of which doublings you choose to play, and in what order (for example, will the third be the highest note in the chord or the middle note?), is called Voicing. This is why a C chord can sound muffled and dark in one area of the neck, and sparkling and bell-like in another area, it is the same chord (the same 3 notes), simply with a different Voicing."
        },
        {
          type: "interactive",
          content: "voicing-visualizer"
        },
        {
          type: "paragraph",
          title: "Conclusion: From Memorizers to Architects",
          content: "Once you internalize that a chord is a 3-part formula (root, third, fifth), your relationship to the guitar neck changes forever. If you are looking for a new chord, you don't type 'how to play...' into Google, instead you look at the neck, find the root you want, build a fifth above it for stability, and decide what emotion to add with the third. You have transformed from someone who memorizes pictures into an architect who builds harmony from scratch."
        }
      ]
    }
  },

  intervals: {
    id: "intervals",
    he: {
      title: "אינטרוולים (מרווחים)",
      subtitle: "הגלולה האדומה של המוזיקה והקוד הסודי של הפרטבורד",
      tags: ["יסודות", "מאסטר-קלאס", "אימון_שמיעה"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: האשליה של שמות התווים",
          content: "אחת הטעויות הגדולות ביותר של גיטריסטים בתחילת דרכם היא האובססיה לשמות התווים. אנחנו מבלים חודשים בניסיון לשנן איפה נמצא כל 'דו דיאז' ו'פה במול' על הפרטבורד, מתוך מחשבה שזוהי הדרך להבין מוזיקה. אבל האמת היא שלמוח האנושי ממש לא אכפת מאיזה תו התחלת לנגן. המוח שלנו לא מזהה תווים אבסולוטיים, הוא מזהה אך ורק יחסים. תחשוב על זה כמו על קואורדינטות. התו 'סול' הוא רק כתובת פיזית במרחב, אבל 'אינטרוול' (מרווח) הוא הוראת הנסיעה. הוא המרחק המדויק, הפיזי והתדרי, בין שני צלילים. כשאתה שומע שיר שמרגש אותך, מה שאתה חווה זה לא את התווים עצמם, אלא את רכבת ההרים של המרחקים ביניהם. מרווח אחד יישמע לנו שמח ופתוח, ומרווח אחר, שרחוק ממנו רק במילימטרים ספורים, יישמע קודר ומאיים. ההבנה של אינטרוולים היא הרגע שבו אתה מפסיק להיות קלדן שמבצע הוראות והופך למוזיקאי שמדבר שפה חיה. זהו הרגע שבו צוואר הגיטרה הופך מים של תווים אקראיים לרשת מבריקה של אפשרויות רגשיות."
        },
        {
          type: "highlight",
          title: "פרק 1: הפיזיקה של הרגש (אריתמטיקה של צלילים)",
          content: "כדי למדוד מרחקים, אנחנו צריכים יחידת מידה. במוזיקה המערבית, יחידת המידה הקטנה ביותר היא 'חצי טון' (Half Step), שבגיטרה שווה בדיוק לסריג אחד. כדי לחשב אינטרוול, אנחנו בוחרים נקודת התחלה כלשהי (השורש) וסופרים כמה סריגים אנחנו מתרחקים ממנה. לכל מרחק כזה יש פונקציה פסיכולוגית מובהקת.\n\nהאינטרוולים הדיסוננטיים (מייצרי המתח):\n* סקונדה קטנה (סריג 1): המרחק הקטן ביותר האפשרי. נשמע דחוס, צורם ומאיים. כששני צלילים קרובים כל כך מנוגנים יחד, גלי הקול שלהם מתנגשים ומייצרים תחושה של חוסר מנוחה עמוק.\n* טריטון (6 סריגים): ממוקם בדיוק באמצע הדרך לאוקטבה. בימי הביניים הוא נאסר לנגינה וכונה 'מרווח השטן' בגלל חוסר היציבות המוחלט שלו. הוא נשמע כאילו הוא עומד להתפוצץ ודורש פתרון מיידי.\n\nהאינטרוולים הרגשיים (הטרצות):\nהטרצות הן הלב הפועם של ההרמוניה, הן מחליטות איזה 'צבע' רגשי יהיה למוזיקה שלך.\n* טרצה קטנה (3 סריגים): המרכיב הסודי של העצב והמלנכוליה. אם תוסיף לשורש צליל במרחק 3 סריגים, יצרת הרגע את ה-DNA של אקורד מינורי.\n* טרצה גדולה (4 סריגים): האור, השמש והשמחה. זהו המרווח שהופך אקורד ל'מז'ורי' ומשדר ביטחון ותקווה.\n\nהאינטרוולים היציבים (הזכים):\nמשדרים יציבות ועוצמה נטולת רגש ספציפי (לא שמח ולא עצוב).\n* קוורטה זכה (5 סריגים): נשמע פתוח, רחב ומרחף. רוב מיתרי הגיטרה מכוונים במרווח הזה.\n* קווינטה זכה (7 סריגים): האינטרוול העוצמתי ביותר. נשמע יציב כמו סלע בטון. זהו הבסיס לאקורדי הכוח (Power Chords) ברוק ומטאל, כוח טהור ובלתי מתפשר."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        },
        {
          type: "fretboard",
          title: "פרק 2: היתרון הלא-הוגן של גיטריסטים (גיאומטריה קבועה)",
          content: "לפסנתרנים יש חיים קשים כשזה מגיע לאינטרוולים. בגלל הסידור של הקלידים הלבנים והשחורים, טרצה גדולה מ'דו' נראית אחרת לגמרי ביד מאשר טרצה גדולה מ'מי במול'. הם חייבים לשנן עשרות שילובים. לנו, הגיטריסטים, יש 'צ'יט קוד' (Cheat Code) מובנה: הגיטרה היא כלי גיאומטרי. המשמעות היא שברגע שלמדת צורה פיזית של אינטרוול על הצוואר, הצורה הזו תישאר זהה לחלוטין לא משנה לאיזה סריג תזיז אותה.\n\nאיך זה נראה בפועל?\n1. הקווינטה (Power Chord): הנח אצבע על מיתר 6. הקווינטה תמיד תמתין לך מיתר אחד למטה, שני סריגים קדימה לכיוון הגוף של הגיטרה. תמיד.\n2. האוקטבה: הנח אצבע על מיתר 6, דלג לגמרי על מיתר 5, והנח אצבע על מיתר 4, שני סריגים קדימה. תקבל אוקטבה מדויקת ומהדהדת.\n3. הטרצה הגדולה (המרכיב השמח): תמיד נמצאת בדיוק מיתר אחד למטה, וסריג אחד אחורה מהשורש שלך.\n4. הטרצה הקטנה (המרכיב העצוב): תמיד נמצאת בדיוק מיתר אחד למטה, שני סריגים אחורה מהשורש שלך.\n\nברגע שהאצבעות שלך מבינות את הגיאומטריה הזו, הצוואר נפתח. כדי להפוך אקורד מז'ורי לאקורד מינורי, אתה לא צריך לחשב שמות תווים, אתה פשוט יודע שאתה צריך להחליק את האצבע שמנגנת את הטרצה סריג אחד אחורה."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        },
        {
          type: "example",
          title: "פרק 3: חיבור אוזן-יד (טריק השירים)",
          content: "התיאוריה חשובה, אבל מוזיקה קורית באוזניים. המטרה האמיתית היא לשמוע שיר, ולזהות מיד אילו אינטרוולים מנוגנים. הדרך היעילה ביותר ללמד את המוח לזהות מרחקים היא לחבר לכל אינטרוול שיר מפורסם שהמלודיה שלו מתחילה בדיוק באותה קפיצה:\n* סקונדה קטנה (1 סריג): הפתיח של הסרט 'מלתעות' (Jaws). הלחץ המצטבר נובע מהמרחק המזערי.\n* טרצה קטנה (3 סריגים): הריף האלמותי של 'Seven Nation Army'. הקפיצה מהתו הראשון לשני נותנת לריף את החספוס והתוקפנות שלו.\n* קוורטה זכה (5 סריגים): תרועת החצוצרות שפותחת את הפסקול של 'מלחמת הכוכבים'. משדר גבורה והכרזה.\n* טריטון (6 סריגים): המילה הראשונה בשיר הפתיחה של 'משפחת סימפסון'. קפיצה שנשמעת חייזרית ומוזרה.\n* קווינטה זכה (7 סריגים): הפתיח ההרואי בפסקול של 'סופרמן'. זינוק נקי לשמיים.\n* אוקטבה (12 סריגים): המילה הראשונה בשיר 'Somewhere Over the Rainbow'. פתיחת מרחב חדש ומרגש."
        },
        {
          type: "paragraph",
          title: "סיכום: המאסטר-קי לאקורדים וסולואים",
          content: "הכל במוזיקה, מאקורדים של מדורות ועד לסולואים של וירטואוזים, בנוי מאינטרוולים. אקורד הוא בסך הכל סדרה של אינטרוולים שמנוגנים באותו זמן (שורש + טרצה גדולה + קווינטה זכה = אקורד מז'ורי). כשאתה מאלתר סולו, אתה לא בוחר תווים באקראי מתוך סולם, אתה בוחר מרווחים לפי הרגש שאתה רוצה להעביר למאזין. רוצה להישמע קודר? נגן טרצה קטנה. רוצה לייצר מתח לפני הפזמון? זרוק סקונדה קטנה או טריטון. השליטה במרחקים האלה היא השליטה המוחלטת בחוקיות של צוואר הגיטרה וברגש המוזיקלי שלך."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        }
      ]
    },
    en: {
      title: "Intervals",
      subtitle: "The Red Pill of Music and the Secret Code of the Fretboard",
      tags: ["Masterclass", "Distances", "Ear_Training"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: The Illusion of Note Names",
          content: "One of the biggest mistakes guitarists make early on is obsessing over note names. We spend months trying to memorize where every 'C sharp' and 'F flat' is on the fretboard, thinking this is the way to understand music. But the truth is, the human brain really doesn't care which note you started on. Our brain does not recognize absolute notes; it only recognizes relationships. Think of it like coordinates. The note 'G' is just a physical address in space, but an 'interval' is the driving direction. It is the exact physical and frequency distance between two sounds. When you hear a song that moves you, what you are experiencing is not the notes themselves, but the roller coaster of the distances between them. One interval will sound happy and open to us, and another, just millimeters away, will sound gloomy and menacing. Understanding intervals is the moment you stop being a typist executing instructions and become a musician speaking a living language. This is the moment the guitar neck turns from a sea of random notes into a brilliant network of emotional possibilities."
        },
        {
          type: "highlight",
          title: "Chapter 1: The Physics of Emotion (Arithmetic of Sounds)",
          content: "To measure distances, we need a unit of measurement. In Western music, the smallest unit is a 'Half Step', which on a guitar equals exactly one fret. To calculate an interval, we choose a starting point (the root) and count how many frets we move away from it. Each such distance has a distinct psychological function.\n\nThe Dissonant (Tension-Building) Intervals:\n* Minor 2nd (1 fret): The smallest distance possible. Sounds compressed, jarring, and menacing. When two sounds this close are played together, their sound waves clash, creating a deep sense of restlessness.\n* Tritone (6 frets): Located exactly halfway to the octave. In the Middle Ages, it was banned from playing and dubbed the 'Devil's Interval' due to its absolute instability. It sounds as if it's about to explode and demands an immediate resolution.\n\nThe Emotional Intervals (The Thirds):\nThe thirds are the beating heart of harmony, they decide what emotional 'color' your music will have.\n* Minor 3rd (3 frets): The secret ingredient of sadness and melancholy. If you add a sound 3 frets away to a root, you have just created the DNA of a minor chord.\n* Major 3rd (4 frets): The light, the sun, and the joy. This is the interval that makes a chord 'major' and projects confidence and hope.\n\nThe Stable (Perfect) Intervals:\nProject stability and power without a specific emotion (neither happy nor sad).\n* Perfect 4th (5 frets): Sounds open, wide, and floating. Most guitar strings are tuned in this interval.\n* Perfect 5th (7 frets): The most powerful interval. Sounds stable as a concrete rock. This is the foundation for Power Chords in rock and metal, pure, uncompromising power."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        },
        {
          type: "fretboard",
          title: "Chapter 2: The Guitarist's Unfair Advantage (Fixed Geometry)",
          content: "Pianists have a hard life when it comes to intervals. Because of the arrangement of black and white keys, a major third from 'C' looks completely different in the hand than a major third from 'E flat'. They have to memorize dozens of combinations. We guitarists have a built-in 'Cheat Code': the guitar is a geometric instrument. This means that once you learn the physical shape of an interval on the neck, that shape remains exactly the same no matter which fret you move it to.\n\nWhat does this look like in practice?\n1. The Fifth (Power Chord): Place a finger on string 6. The fifth will always be waiting for you one string down, two frets forward towards the body of the guitar. Always.\n2. The Octave: Place a finger on string 6, completely skip string 5, and place a finger on string 4, two frets forward. You get a precise, resonant octave.\n3. The Major 3rd (The happy component): Always located exactly one string down, and one fret behind your root.\n4. The Minor 3rd (The sad component): Always located exactly one string down, two frets behind your root.\n\nOnce your fingers understand this geometry, the neck opens up. To turn a major chord into a minor chord, you don't need to calculate note names, you simply know that you need to slide the finger playing the third one fret back."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        },
        {
          type: "example",
          title: "Chapter 3: Ear-Hand Connection (The Song Trick)",
          content: "Theory is important, but music happens in the ears. The real goal is to hear a song and immediately recognize which intervals are being played. The most effective way to teach the brain to recognize distances is to associate each interval with a famous song whose melody starts with the exact same jump:\n* Minor 2nd (1 fret): The intro of the movie 'Jaws'. The accumulating tension stems from the tiny distance.\n* Minor 3rd (3 frets): The immortal riff of 'Seven Nation Army'. The jump from the first to the second note gives the riff its grit and aggression.\n* Perfect 4th (5 frets): The trumpet fanfare that opens the 'Star Wars' soundtrack. Projects heroism and announcement.\n* Tritone (6 frets): The first word in the opening song of 'The Simpsons'. A jump that sounds alien and bizarre.\n* Perfect 5th (7 frets): The heroic intro in the 'Superman' soundtrack. A clean leap to the sky.\n* Octave (12 frets): The first word in the song 'Somewhere Over the Rainbow'. Opening a new, exciting space."
        },
        {
          type: "paragraph",
          title: "Conclusion: The Master Key to Chords and Solos",
          content: "Everything in music, from campfire chords to virtuoso solos, is built from intervals. A chord is simply a series of intervals played at the same time (Root + Major 3rd + Perfect 5th = Major Chord). When you improvise a solo, you don't randomly pick notes from a scale, you choose intervals based on the emotion you want to convey to the listener. Want to sound gloomy? Play a minor third. Want to build tension before the chorus? Throw in a minor second or a tritone. Mastering these distances is absolute mastery over the logic of the guitar neck and your musical emotion."
        },
        {
          type: "interactive",
          content: "interval-explorer"
        }
      ]
    }
  },

  sight_reading: {
    id: "sight_reading",
    he: {
      title: "קריאת תווים: המטריקס של הסאונד",
      subtitle: "הפיזיקה של הנייר והשפה שתשחרר אותך מכבלי הטאבלטורה",
      tags: ["יסודות", "קריאת_תווים", "מאסטר-קלאס"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: האשליה של הטאבלטורה",
          content: "תעשיית הגיטרה העולמית מבוססת על סוד גלוי: כמעט כל נגני הגיטרה החובבים אינם יודעים לקרוא את שפת המוזיקה. כדי לעקוף את המכשול הזה, הומצאה הטאבלטורה. טאב הוא המצאה מבריקה, אך הוא טומן בחובו מלכודת דבש קטלנית להתפתחות המוזיקלית שלך. טאבלטורה היא רצף של הוראות הפעלה מכניות. היא אומרת לך להניח את האצבע השלישית על הסריג החמישי במיתר השני. היא אינה אומרת לך איזה צליל אתה מנגן, מהי הפונקציה ההרמונית שלו, והכי חמור הוא שהיא עיוורת לחלוטין לממד הזמן והקצב. לנגן מטאבים זה כמו להקליד מילה בסינית על ידי העתקת הציור שלה, מבלי להבין את המשמעות, את התחביר או את הטון.\n\nתווים סטנדרטיים (Standard Notation) לעומת זאת, הם שפה אוניברסלית של תדר וזמן. כשאתה קורא תווים, אתה חולק את אותו מוח עם הפסנתרן, נגן הסקסופון והזמרת. אתה מפסיק להיות מפעיל מכונה של גיטרה, ומתחיל להיות מוזיקאי שמשתמש בגיטרה ככלי ביטוי. בפרק זה נפרק את שפת המטריקס הזו לשני צירים: ציר הגובה (Pitch) וציר הזמן (Rhythm)."
        },
        {
          type: "highlight",
          title: "פרק 1: ציר ה-Y (המיפוי המתמטי של התדר)",
          content: "תחשוב על דף תווים כעל תרשים מתמטי. הציר האנכי מייצג את גובה הצליל: ככל שהסימון גבוה יותר על הדף, כך התדר (הצליל) שייווצר יהיה גבוה וחד יותר.\n\nהאדריכלות של החמשה (The Staff):\nהחמשה מורכבת מחמישה קווים אופקיים מקבילים, היוצרים ביניהם ארבעה רווחים. כל קו וכל רווח מייצג מדרגה אחת בסולם התווים הטבעי (A-B-C-D-E-F-G).\n\nמפתח סול (Treble Clef) כנקודת כיול:\nבתחילת כל שורת תווים לגיטרה יופיע סמל מסולסל הנקרא מפתח סול. המפתח הזה אינו עיטור גרפי, הוא מערכת כיול. אם תבחן אותו מקרוב, תראה שהעיגול הפנימי שלו נועל כמו כוונת את הקו השני מלמטה. זוהי הכרזה משפטית: כל תו שיושב על הקו השני מלמטה, הוא בדיוק התו סול (G). מנקודת העוגן הזו, היקום כולו מסתדר:\n* על הקו השני: G (סול)\n* ברווח שמעליו: A (לה)\n* על הקו השלישי: B (סי)\n* ברווח שמעליו: C (דו)\n\nכדי להימנע מספירה איטית, מוזיקאים משתמשים בעוגני זיכרון:\n* הקווים מלמטה למעלה: E-G-B-D-F (Every Good Boy Does Fine).\n* הרווחים מלמטה למעלה: F-A-C-E (היוצרים את המילה פנים באנגלית).\n\nהסוד המקצועי של הגיטרה (Transposition):\nלגיטרה יש טווח צלילים נמוך מאוד שמגיע עד לתו E (מיתר 6 פתוח). אם היינו כותבים את התווים בדיוק בתדר שבו הם נשמעים, היינו צריכים לצייר המון קווי עזר מתחת לחמשה, מה שהיה הופך את הקריאה לבלתי אפשרית. לכן, הגיטרה מוגדרת ככלי טרנספוזיציה של אוקטבה. כל מה שאתה רואה על דף התווים, נשמע במציאות אוקטבה אחת נמוך יותר."
        },
        {
          type: "interactive",
          content: "notation-visual-dictionary"
        },
        {
          type: "fretboard",
          title: "פרק 2: הקונפליקט של הפרטבורד (Timbre vs. Pitch)",
          content: "הגענו לסיבה האמיתית שבגללה גיטריסטים מפחדים מתווים. בפסנתר, יש יחס של אחד לאחד. אם מופיע 'דו אמצעי' על הדף, יש רק קליד אחד ספציפי על הפסנתר שמפיק אותו. אין אפשרויות אחרות.\n\nבגיטרה, המערכת היא רב-ממדית. את אותו תו 'מי' (E) שמופיע ברווח העליון של החמשה, ניתן לנגן במספר מיקומים בעלי תדר זהה לחלוטין:\n1. מיתר 1 פתוח.\n2. מיתר 2, סריג 5.\n3. מיתר 3, סריג 9.\n4. מיתר 4, סריג 14.\n\nאם התדר זהה, למה זה משנה היכן ננגן אותו? התשובה היא גוון הצליל (Timbre). מיתר עבה (כמו מיתר 4) ייצר צליל חם, עמוק, עשיר בתדרים נמוכים ועם הדהוד ארוך. מיתר דק (כמו מיתר 1 פתוח) ייצר צליל מבריק, צלול וחותך.\nקורא תווים מיומן אינו מחפש רק איפה התו נמצא. הוא מסתכל על המשפט המוזיקלי כולו, ומחליט באיזו פוזיציה לנגן אותו כדי להפיק את האופי והרגש המדויק שהמלחין התכוון אליו."
        },
        {
          type: "interactive",
          content: "note-to-fret-matrix"
        },
        {
          type: "paragraph",
          title: "פרק 3: ציר ה-X (הפיזיקה של הזמן)",
          content: "הציר האופקי על הנייר הוא ציר הזמן. הזמן מחולק לתיבות (Measures), המופרדות על ידי קווים אנכיים. בראש היצירה מופיע סימן המשקל (Time Signature), למשל 4/4. המספר העליון קובע כמה פעימות (Beats) ייכנסו בכל תיבה, והמספר התחתון קובע איזה תו ייחשב לפעימה אחת.\n\nהצורה הגרפית של התו אינה אקראית, היא נוסחה מתמטית מדויקת של יחסים:\n* תו שלם (Whole Note): עיגול חלול ללא מקל. משמעותו היא פריטה אחת הממשיכה להדהד במשך 4 פעימות שלמות. זהו הבסיס.\n* חצי תו (Half Note): הוספנו מקל לעיגול החלול. הזמן נחתך בחצי. התו יהדהד 2 פעימות.\n* תו רבע (Quarter Note): העיגול החלול מתמלא בצבע שחור. הזמן נחתך שוב בחצי. פעימה אחת בודדת כמו פעימת לב או תקתוק של שעון שניות.\n* תו שמינית (Eighth Note): הוספנו דגל או קו מחבר למקל. הזמן נחתך שוב. אנחנו מנגנים שני צלילים בתוך פעימת לב אחת.\n* חלקי 16 (Sixteenth Note): שני דגלים. ארבעה צלילים נדחסים לתוך פעימה אחת.\n\nהארכיטקטורה של השקט (Rests):\nמוזיקה ללא שקט היא פשוט רעש. לכל אורך של תו, קיים סימן הפסקה מקביל המורה לך להשתיק את המיתר במכוון. שליטה בהפסקות היא מה שמייצר גרוב. גיטריסט שמשאיר מיתרים מהדהדים בזמן הפסקה, הורס את המבנה הקצבי של השיר."
        },
        {
          type: "interactive",
          content: "rhythm-visualizer"
        },
        {
          type: "paragraph",
          title: "פרק 4: שריון המפתח (Key Signatures) והגיאומטריה של הסולם",
          content: "כפי שלמדנו בפרק האינטרוולים, המוזיקה אינה מוגבלת רק לתווים הטבעיים (הקלידים הלבנים). לפעמים עלינו לנגן את הצלילים שביניהם.\n* דיאז (#): מורה לנו להעלות את התו המודפס בחצי טון (בגיטרה: להזיז סריג אחד קדימה לכיוון הגוף).\n* במול (b): מורה לנו להוריד את התו המודפס בחצי טון (סריג אחד אחורה לכיוון מפתחות הכיוון).\n\nכדי לא לכתוב סימן דיאז ליד כל תו שני לאורך דפים שלמים, הומצא שריון המפתח. מיד אחרי מפתח סול בתחילת השורה, תראה לעיתים קבוצה של דיאזים או במולים. זהו קוד העל של השיר. אם מופיע סימן דיאז על הקו של התו פה (F), החוק קובע: כל תו פה שתראה אי פעם בשיר הזה, בכל אוקטבה שהיא, מנוגן אוטומטית כפה דיאז (F#), אלא אם מופיע סימן ביטול ספציפי לידו. קריאת השריון הזה היא הדרך שבה מוזיקאים יודעים באיזה סולם היצירה נכתבה."
        },
        {
          type: "example",
          title: "פרק 5: דינמיקה, ארטיקולציה והנשמה של הנגינה",
          content: "הגענו לסיבה העליונה שבגללה תווים הם שפת פרימיום. טאבים לעולם לא יספרו לך איך לנגן. דף תווים כולל שכבה שלמה של מידע רגשי וטכני:\n\nדינמיקה (עוצמה):\nסימונים כמו p (חלש ורך), או f (חזק ותקיף) מורים לך כמה כוח להפעיל בפריטה. סימן קרשנדו (Crescendo) דורש ממך להגביר את העוצמה בהדרגה, בונה מתח דרמטי לקראת שיא היצירה.\n\nארטיקולציה (מגע):\n* סטקטו (Staccato): נקודה קטנה מעל או מתחת לתו מורה לך לקטוע את הצליל מיד לאחר הפריטה, מה שמייצר תחושה קופצנית, מכנית ומדויקת.\n* ליגטו (Slur): קשת המחברת בין שני תווים בגבהים שונים מורה לך לנגן את שניהם בפריטה אחת בלבד על ידי שימוש בטכניקות של Hammer-on או Pull-off, מה שמייצר חיבור חלקי, זורם ואנושי במיוחד.\n\nכיווניות (הוראות ניווט):\nסימנים כמו סימני חזרה המורים לך לנגן קטע שוב, או המונח D.C. al Fine (מאיטלקית: מההתחלה ועד הסוף) החוסכים דפים מיותרים ויוצרים מבנה שיר הגיוני של בית, פזמון וגשר."
        },
        {
          type: "paragraph",
          title: "סיכום: שלב הפענוח ושלב השטף",
          content: "קריאת תווים לגיטרה היא מסע. בשבועות הראשונים, המוח שלך יעבוד במצב של תרגום עיוור. אתה תראה נקודה, תחשב את שמה, תחשב את המיקום בגיטרה, ואז תנגן. זה תהליך מתסכל שמרגיש כמו גמגום.\n\nאבל הפלא קורה לאחר חודשים של אימון עקבי: התרגום נעלם. המוח מתחיל לקשר ישירות בין הגירוי הוויזואלי שעל הדף לבין הפעולה המוטורית של האצבע, מבלי לעבור דרך שם התו. אתה רואה תבנית ויזואלית של טרצה, והאצבעות שלך מסתדרות אוטומטית בצורה של טרצה על הצוואר שאותה למדנו בפרק האינטרוולים.\n\nביום שבו אתה מתיישב מול יצירה שלא שמעת מעולם, והידיים שלך מנגנות אותה פשוט מתוך התבוננות בדף, ביום הזה רכשת את השפה האוניברסלית של המוזיקה לנצח."
        }
      ]
    },
    en: {
      title: "Reading Music: The Matrix of Sound",
      subtitle: "The Physics of Paper and the Language That Will Free You From Tablature",
      tags: ["Basics", "Sight_Reading", "Masterclass"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: The Illusion of Tablature",
          content: "The global guitar industry is based on an open secret: almost all amateur guitarists cannot read the language of music. To bypass this obstacle, tablature (Tabs) was invented. A tab is a brilliant invention, but it harbors a deadly trap for your musical development. Tablature is a sequence of mechanical operating instructions. It tells you to place your third finger on the fifth fret of the second string. It does not tell you what note you are playing, what its harmonic function is, and worst of all, it is completely blind to the dimension of time and rhythm. Playing from tabs is like typing a word in a foreign language by copying its drawing, without understanding the meaning, syntax, or tone.\n\nStandard notation on the other hand, is a universal language of frequency and time. When you read music, you share the exact same mind with the pianist, the saxophone player, and the singer. You stop being a machine operator of a guitar, and start being a musician who uses the guitar as a tool for expression. In this chapter, we will break down this matrix language into two axes: the vertical axis of Pitch and the horizontal axis of Rhythm."
        },
        {
          type: "highlight",
          title: "Chapter 1: The Y-Axis (Mathematical Mapping of Frequency)",
          content: "Think of sheet music as a mathematical chart. The vertical axis represents pitch: the higher the mark on the page, the higher and sharper the resulting frequency.\n\nThe Architecture of the Staff:\nThe staff consists of five parallel horizontal lines creating four spaces between them. Each line and each space represents one step in the natural musical scale (A-B-C-D-E-F-G).\n\nThe Treble Clef as a Calibration Point:\nAt the beginning of every guitar staff, you will see a curled symbol called the Treble Clef. This clef is not a graphic decoration, it is a calibration system. If you look closely, you will see that its inner circle locks onto the second line from the bottom like a crosshair. This is a legal declaration: any note sitting on the second line from the bottom is exactly the note G. From this anchor point, the whole universe aligns:\n* On the second line: G\n* In the space above it: A\n* On the third line: B\n* In the space above it: C\n\nTo avoid slow counting, musicians use memory anchors:\n* The lines from bottom to top: E-G-B-D-F (Every Good Boy Does Fine).\n* The spaces from bottom to top: F-A-C-E (spelling the word FACE).\n\nThe Guitar's Professional Secret (Transposition):\nThe guitar has a very low range reaching down to the note E (open 6th string). If we wrote the notes exactly at the frequency they sound, we would need to draw many ledger lines below the staff, making reading impossible. Therefore, the guitar is defined as an octave transposing instrument. Everything you see on the sheet music actually sounds one octave lower in reality."
        },
        {
          type: "interactive",
          content: "notation-visual-dictionary"
        },
        {
          type: "fretboard",
          title: "Chapter 2: The Fretboard Conflict (Timbre vs. Pitch)",
          content: "We have reached the real reason why guitarists fear sheet music. On the piano, there is a one-to-one ratio. If 'Middle C' appears on the page, there is only one specific key on the piano that produces it. There are no other options.\n\nOn the guitar, the system is multidimensional. The exact same note 'E' appearing in the top space of the staff can be played in multiple locations with identical frequency:\n1. Open 1st string.\n2. 2nd string, 5th fret.\n3. 3rd string, 9th fret.\n4. 4th string, 14th fret.\n\nIf the frequency is identical, why does it matter where we play it? The answer is Timbre. A thick string (like the 4th string) will produce a warm, deep sound rich in low frequencies with long sustain. A thin string (like the open 1st string) will produce a bright, clear, and cutting sound.\nA skilled sight-reader does not just look for where the note is. They look at the entire musical phrase and decide in which position to play it to produce the exact character and emotion the composer intended."
        },
        {
          type: "interactive",
          content: "note-to-fret-matrix"
        },
        {
          type: "paragraph",
          title: "Chapter 3: The X-Axis (The Physics of Time)",
          content: "The horizontal axis on paper is the axis of time. Time is divided into Measures, separated by vertical lines. At the top of the piece is the Time Signature, for example 4/4. The top number determines how many beats fit into each measure, and the bottom number determines which note counts as one beat.\n\nThe graphical shape of the note is a precise mathematical formula of proportions:\n* Whole Note: A hollow circle with no stem. It means a single pluck that continues to resonate for 4 full beats. This is the foundation.\n* Half Note: We added a stem to the hollow circle. The time is cut in half. The note will resonate for 2 beats.\n* Quarter Note: The hollow circle is filled with black ink. The time is cut in half again. A single beat just like a heartbeat or a ticking second hand.\n* Eighth Note: We added a flag or a connecting beam to the stem. The time is cut again. We play two sounds within a single heartbeat.\n* Sixteenth Note: Two flags. Four sounds are compressed into a single beat.\n\nThe Architecture of Silence (Rests):\nMusic without silence is simply noise. For every note duration, there is a corresponding Rest symbol instructing you to intentionally mute the string. Mastering rests is what creates a strong groove. A guitarist who leaves strings ringing during a rest destroys the rhythmic structure of the song."
        },
        {
          type: "interactive",
          content: "rhythm-visualizer"
        },
        {
          type: "paragraph",
          title: "Chapter 4: Key Signatures and the Geometry of the Scale",
          content: "As we learned in the intervals chapter, music is not limited to natural notes (the white keys). Sometimes we must play the sounds in between.\n* Sharp (#): Instructs us to raise the printed note by a half step (on guitar: move one fret forward towards the body).\n* Flat (b): Instructs us to lower the printed note by a half step (one fret back towards the tuning pegs).\n\nTo avoid writing a sharp sign next to every other note across entire pages, the Key Signature was invented. Right after the treble clef at the start of the line, you will sometimes see a group of sharps or flats. This is the master code of the song. If a sharp sign appears on the line for the note F, the rule states: every F note you ever see in this song, in any octave, is automatically played as F# (F sharp), unless a specific natural sign appears next to it. Reading this signature is how musicians know the scale in which the piece was written."
        },
        {
          type: "example",
          title: "Chapter 5: Dynamics, Articulation, and the Soul of Playing",
          content: "We have reached the ultimate reason why sheet music is a premium language. Tabs will never tell you how to play. Sheet music includes a whole layer of emotional and technical information:\n\nDynamics (Volume):\nMarkings like p (soft and gentle) or f (loud and assertive) tell you how much force to apply when plucking. A crescendo mark requires you to gradually increase the volume, building dramatic tension towards the climax of the piece.\n\nArticulation (Touch):\n* Staccato: A small dot above or below the note tells you to cut the sound immediately after plucking, creating a bouncy, mechanical, and precise feel.\n* Slur (Legato): A curved line connecting two notes of different pitches tells you to play both with a single pluck using Hammer-on or Pull-off techniques, creating a fluid and highly human connection.\n\nNavigation Instructions:\nSymbols like repeat signs telling you to play a section again, or the term D.C. al Fine (Italian for from the beginning to the end) which save unnecessary pages and create a logical song structure of verse, chorus, and bridge."
        },
        {
          type: "paragraph",
          title: "Conclusion: From Decoding to Fluency",
          content: "Reading sheet music for guitar is a journey. In the first few weeks, your brain will operate in blind translation mode. You will see a dot, calculate its name, calculate its location on the guitar, and then play. It is a frustrating process that feels like stuttering.\n\nBut the magic happens after months of consistent practice: the translation disappears. The brain begins to link directly between the visual stimulus on the page and the motor action of the finger, without passing through the note's name. You see a visual pattern of a third, and your fingers automatically arrange themselves into the shape of a third on the neck that we learned in the intervals chapter.\n\nThe day you sit down with a piece you have never heard before, and your hands play it simply by looking at the page, on that day you have acquired the universal language of music forever."
        }
      ]
    }
  },

  fretboard_matrix: {
    id: "fretboard_matrix",
    he: {
      title: "הפרטבורד",
      subtitle: "הגשר שבין התיאוריה המוזיקלית לארכיטקטורה של העץ",
      tags: ["יסודות", "פרטבורד", "מאסטר-קלאס"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: החרדה מהחושך שמעבר לסריג החמישי",
          content: "רוב הגיטריסטים מתחילים את דרכם באזור הנוחות הפרוס לאורך שלושת הסריגים הראשונים. שם נמצאים האקורדים הפתוחים, ושם הכל מרגיש מוכר ומנחם. אך ברגע שצריך לחצות את הסריג החמישי, צוואר הגיטרה הופך לארץ לא נודעת, חור שחור של נקודות מתכת ומיתרים שחוזרים על עצמם ללא היגיון נראה לעין. הגישה המסורתית ללימוד הפרטבורד היא שינון יבש. מורים אומרים לנו לשנן שפה זה C ופה זה F. הבעיה היא ששינון מכני קורס תחת לחץ, וכשהוא קורס בזמן אלתור או הופעה, הזיכרון בוגד בנו. אבל הגיטרה אינה אוסף מקרי של צלילים. היא ייצוג פיזי ודו-ממדי של כל התיאוריה המוזיקלית שלמדנו עד כה. בפרק זה לא נשנן שמות של תווים. במקום זאת, ניקח את חוקי הסולם המז'ורי, את הגיאומטריה של האינטרוולים ואת מבנה הטריאדות, ונראה כיצד הם נשפכים על הצוואר ויוצרים רשת אחת שלמה ומחוברת."
        },
        {
          type: "highlight",
          title: "פרק 1: תעלומת הכיוון (למה מיתר B תמיד הורס הכל?)",
          content: "כדי להבין את המגרש שעליו אנחנו משחקים, צריך לפצח את החוקיות שלפיה הוא נבנה. הכיוון הסטנדרטי בגיטרה מבוסס על הגיאומטריה שלמדנו בפרק האינטרוולים. רוב הגיטרה מכוונת במרווח של קוורטה זכה (Perfect 4th). המשמעות היא שהמרחק מכל מיתר למיתר שמתחתיו הוא בדיוק 5 סריגים (או 5 חצאי טונים). מיתר 6 (E) ועוד 5 סריגים מביא אותנו ל-A (מיתר 5). מיתר 5 (A) ועוד 5 סריגים מביא אותנו ל-D (מיתר 4). מיתר 4 (D) ועוד 5 סריגים מביא אותנו ל-G (מיתר 3). אך כאן, בדיוק בין מיתר 3 (G) למיתר 2 (B), הארכיטקטורה נשברת. המרחק ביניהם הוא של טרצה גדולה בלבד (4 סריגים במקום 5). החריגה הזו נעשתה היסטורית כדי לאפשר לנו לנגן אקורדים פתוחים בקלות עם היד, אך היא המחיר שאנחנו משלמים בניווט. החוק שעליך לחקוק בזיכרון: כל צורה גיאומטרית של אינטרוול, סולם או אקורד שחוצה את מיתר 3 בדרכה מטה למיתר 2, חייבת לקבל פיצוי של סריג אחד קדימה לכיוון גוף הגיטרה. הבנת נקודת השבר הזו מסירה 80 אחוזים מהבלבול על הצוואר."
        },
        {
          type: "interactive",
          content: "tuning-anomaly-visualizer"
        },
        {
          type: "fretboard",
          title: "פרק 2: הקרנת התיאוריה על העץ (אינטרוולים הלכה למעשה)",
          content: "בפרק האינטרוולים למדנו שהמוח מזהה מרחקים, לא תווים ספציפיים. הצוואר מאפשר לנו לראות את המרחקים האלה בעיניים. אם נבחר נקודה אקראית על מיתר 6 ונחליט שהיא השורש שלנו, נוכל מיד לייצר סביבה מערכת שמש שלמה של תיאוריה. מציאת הקווינטה ליציבות: הקווינטה הזכה (הגג של האקורד שלמדנו בפרק הטריאדות) תמיד תמתין לך מיתר אחד למטה, ושני סריגים קדימה. מתג הרגש (הטרצה): הטרצה הגדולה (מז'ור) תמיד נמצאת מיתר אחד למטה, וסריג אחד אחורה מהשורש. אם נרצה אקורד עצוב, נחליק את האצבע הזו עוד סריג אחד אחורה אל הטרצה הקטנה (מינור). בניית הסולם המז'ורי מבלי לחשוב: בפרק הראשון למדנו את נוסחת הסולם (טון, טון, חצי, טון, טון, טון, חצי). במקום לנגן את זה על מיתר אחד, הגיאומטריה מאפשרת לנו לחתוך למיתר שמתחת. התו הרביעי בסולם (הקוורטה) תמיד יהיה בדיוק מתחת לשורש באותו סריג. ברגע שאתה רואה אינטרוולים כמרחקים פיזיים, אתה מפסיק לחשוב איזה תו בא עכשיו בסולם מינור פנטטוני. אתה פשוט רואה שורש, ומושיט את האצבע למרחק המוכר של טרצה קטנה."
        },
        {
          type: "highlight",
          title: "פרק 3: רשת האוקטבות (מערכת הרדאר הפנימית)",
          content: "אם אינטרוולים הם הלבנים, האוקטבות הן הפיגומים שמחזיקים את כל הבניין. האוקטבה היא אותו התו בדיוק, בתדר כפול. במקום לנסות למצוא את התו פה (F) בכל מקום על הצוואר מחדש, הגיטריסט המקצועי מוצא אותו פעם אחת ומשתמש בקפיצות גיאומטריות קבועות כדי למצוא את כל השאר. 1. קפיצת שני מיתרים: מהשורש במיתר 6 או 5, דלג על מיתר אחד, והאוקטבה תמתין לך שני סריגים קדימה. 2. קפיצת שלושה מיתרים: אם השורש במיתר 6 ואתה מחפש את האוקטבה במיתר 3, אתה חוצה את נקודת השבר של מיתר B. לכן, הקפיצה תהיה של 3 סריגים קדימה. 3. מתנת הקצוות: מיתר 6 ומיתר 1 שניהם מיתרי E. כל תו שתמצא על מיתר 6 נמצא בדיוק באותו מקום גם על מיתר 1. המערכת הזו פורסת רשת של תחנות עוגן לאורך כל הצוואר."
        },
        {
          type: "interactive",
          content: "octave-constellation-map"
        },
        {
          type: "paragraph",
          title: "פרק 4: טריאדות בתנועה (לצאת מהאקורדים הסטטיים)",
          content: "בפרק הטריאדות בנינו בתים (שורש, טרצה, קווינטה). אבל אקורד לא חייב להיות מנוגן תמיד כשהשורש הוא הצליל הנמוך ביותר. על הפרטבורד, אנחנו יכולים לקחת את אותם 3 תווים, ולשחק עם הסדר שלהם (Inversions). במקום לקפוץ בטירוף מצד אחד של הצוואר לצד השני כדי להחליף מ-C ל-G, גיטריסט שרואה את המטריקס יישאר באותו אזור בצוואר. הוא ימצא טריאדה של C במצב יסודי על מיתרים 1-2-3, ולידה ממש, במרחק הזזת אצבע אחת או שתיים, ימצא היפוך של G. זוהי אמנות הובלת הקולות (Voice Leading). התיאוריה מפסיקה להיות מתמטיקה, והופכת לזרימה חלקה של הרמוניה."
        },
        {
          type: "interactive",
          content: "triad-inversion-navigator"
        },
        {
          type: "paragraph",
          title: "פרק 5: החיבור לדף התווים (Timbre Positions)",
          content: "בפרק קריאת התווים הבנו שהקושי הגדול בגיטרה הוא ריבוי האפשרויות. התו דו (Middle C) מופיע על הדף פעם אחת, אבל על הגיטרה אפשר לנגן אותו ב-5 מקומות שונים. כעת, כשאנחנו מבינים את הפרטבורד כמטריקס, החיסרון הזה הופך ליתרון הגדול ביותר שלנו. כשאנחנו קוראים תווים, אנחנו בוחרים את הפוזיציה (האזור על הצוואר) שבה ננגן לא רק לפי נוחות האצבעות, אלא לפי הצבע (Timbre). רוצה שהמלודיה תשמע חמה, עגולה וקרובה? נגן את התווים בסביבת סריג 9 על המיתרים העבים. רוצה שהמלודיה תחתוך את המיקס בבהירות? קח את אותם התווים בדיוק באותו הגובה, ונגן אותם בסביבת סריג 2 על המיתרים הדקים. הפרטבורד אינו מכונת כתיבה שבה לכל אות יש כפתור אחד. הוא פלטת צבעים."
        },
        {
          type: "paragraph",
          title: "סיכום: להיות הבעלים של הגיטרה",
          content: "המעבר משלב השינון לשלב ההבנה המרחבית הוא הרגע שבו הגיטרה הופכת ממכשיר שאתה מתפעל, לכלי שאתה שולט בו. הסולם המז'ורי, האינטרוולים, הטריאדות וקריאת התווים אינם נושאים נפרדים בתיאוריה. הם כולם שפות שונות המתארות את אותה האמת הגיאומטרית הפרוסה על ששת המיתרים שלך. כשאתה לומד לראות את הקשרים האלה, אין יותר שטחים מתים מעבר לסריג החמישי. יש רק רשת אינסופית של אפשרויות."
        }
      ]
    },
    en: {
      title: "The Fretboard",
      subtitle: "The Bridge Between Musical Theory and the Architecture of Wood",
      tags: ["Basics", "Fretboard", "Masterclass"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: The Fear of the Dark Beyond the Fifth Fret",
          content: "Most guitarists begin their journey in the comfort zone of the first three frets. There, the open chords live, and everything feels familiar and reassuring. But the moment one needs to cross the fifth fret, the guitar neck becomes an unknown land, a black hole of metal dots and strings that repeat without visible logic. The traditional approach to learning the fretboard is dry memorization. Teachers tell us to memorize that this is C and that is F. The problem is that mechanical memorization collapses under pressure, and when it fails during improvisation or a performance, memory betrays us. But the guitar is not a random collection of sounds. It is a physical, two-dimensional representation of all the musical theory we have learned so far. In this chapter, we will not memorize note names. Instead, we will take the rules of the Major Scale, the geometry of Intervals, and the structure of Triads, and see how they pour onto the neck to create one complete, connected web."
        },
        {
          type: "highlight",
          title: "Chapter 1: The Tuning Mystery (Why Does the B-String Always Ruin Everything?)",
          content: "To understand the field we are playing on, we first need to crack the logic by which it was built. Standard guitar tuning is based on the geometry we learned in the Intervals chapter. Most of the guitar is tuned in intervals of a Perfect 4th. This simply means that the distance from any string to the string below it is exactly 5 frets (or 5 half-steps). String 6 (E) plus 5 frets brings us to A (string 5). String 5 (A) plus 5 frets brings us to D (string 4). String 4 (D) plus 5 frets brings us to G (string 3). But here, exactly between string 3 (G) and string 2 (B), the architecture breaks. The distance between them is only a Major 3rd (4 frets instead of 5). This deviation was done historically to allow us to play open chords easily, but it is the price we pay in navigation. The rule you must engrave in your memory: any geometric shape of an interval, scale, or chord that crosses the 3rd string on its way down to the 2nd string must receive a compensation of one fret forward toward the guitar body. Understanding this breaking point removes 80 percent of the confusion on the neck."
        },
        {
          type: "interactive",
          content: "tuning-anomaly-visualizer"
        },
        {
          type: "fretboard",
          title: "Chapter 2: Projecting Theory onto Wood (Intervals in Action)",
          content: "In the Intervals chapter, we learned that the brain recognizes distances, not specific notes. The neck allows us to see these distances with our eyes. If we choose a random point on the 6th string and decide it is our root, we can immediately create an entire solar system of theory around it. Finding the Fifth for stability: the Perfect 5th (the roof of the chord we learned in the Triads chapter) will always wait for you one string down and two frets forward. The emotion switch (The Third): the Major 3rd always resides one string down and one fret behind the root. If we want a sad chord, we slide this finger one more fret back to the Minor 3rd. Building the Major Scale without thinking: in the first chapter, we learned the scale formula (Whole, Whole, Half, Whole, Whole, Whole, Half). Instead of playing it on one string, geometry allows us to cut to the string below. The fourth note in the scale (the Fourth) will always be exactly below the root at the same fret. Once you see intervals as physical distances, you stop thinking about which note comes next in a pentatonic scale. You simply see a root and reach for the familiar distance of a minor third."
        },
        {
          type: "highlight",
          title: "Chapter 3: The Octave Network (The Internal Radar System)",
          content: "If intervals are the bricks, octaves are the scaffolding that holds the entire building. An octave is the exact same note at double the frequency. Instead of trying to find the note F everywhere on the neck from scratch, the professional guitarist finds it once and uses fixed geometric jumps to find all the rest. 1. Two-string jump: from a root on string 6 or 5, skip one string, and the octave will wait for you two frets forward. 2. Three-string jump: if the root is on string 6 and you are looking for the octave on string 3, you cross the breaking point of the B-string. Therefore, the jump will be 3 frets forward. 3. The gift of the edges: string 6 and string 1 are both E strings. Any note you find on string 6 is in exactly the same place on string 1. This system spreads a network of anchor stations across the entire neck."
        },
        {
          type: "interactive",
          content: "octave-constellation-map"
        },
        {
          type: "paragraph",
          title: "Chapter 4: Triads in Motion (Moving Beyond Static Chords)",
          content: "In the Triads chapter, we built houses (Root, Third, Fifth). But a chord does not always have to be played with the root as the lowest note. On the fretboard, we can take those same 3 notes and play with their order (Inversions). Instead of jumping frantically from one side of the neck to the other to change from C to G, a guitarist who sees the matrix will stay in the same area. They will find a C triad in root position on strings 1-2-3, and right next to it, just a finger move away, find an inversion of G. This is the art of Voice Leading. Theory stops being mathematics and becomes a smooth flow of harmony."
        },
        {
          type: "interactive",
          content: "triad-inversion-navigator"
        },
        {
          type: "paragraph",
          title: "Chapter 5: Connection to Sight Reading (Timbre Positions)",
          content: "In the Sight Reading chapter, we understood that the great difficulty of the guitar is the multitude of choices. The note Middle C appears on the page once, but on the guitar, it can be played in 5 different places. Now that we understand the fretboard as a matrix, this disadvantage becomes our greatest advantage. When we read music, we choose the position on the neck not just based on finger comfort, but based on color (Timbre). Want the melody to sound warm, round, and close? Play the notes around the 9th fret on the thick strings. Want the melody to cut through the mix with clarity? Take those exact same notes at the same pitch and play them around the 2nd fret on the thin strings. The fretboard is not a typewriter where every letter has one button. It is a color palette."
        },
        {
          type: "paragraph",
          title: "Conclusion: Owning the Guitar",
          content: "The transition from memorization to spatial understanding is the moment the guitar transforms from a device you operate into an instrument you master. The Major Scale, Intervals, Triads, and Sight Reading are not separate subjects in theory. They are all different languages describing the same geometric truth spread across your six strings. When you learn to see these connections, there are no more blind spots beyond the fifth fret. There is only an infinite network of possibilities."
        }
      ]
    }
  },

  circle_of_fifths: {
    id: "circle_of_fifths",
    he: {
      title: "מעגל החמישיות",
      subtitle: "השעון הקוסמי של ההרמוניה והמפה הסודית של כותבי השירים",
      tags: ["מאסטר-קלאס", "הרמוניה", "כתיבת_שירים"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: הרבה יותר מטבלת שינון לגיקים של מוזיקה",
          content: "אחת התמונות המאיימות ביותר שגיטריסט מתחיל נתקל בהן היא תרשים של מעגל החמישיות. במבט ראשון זה נראה כמו טבלת יסודות כימיים ששמורה למוזיקאים קלאסיים או לסטודנטים באקדמיה. אבל בפועל, מעגל החמישיות הוא לא תיאוריה יבשה. הוא מערכת הניווט המוחלטת של המוזיקה המערבית. אם אינטרוולים הם חומרי הבניין הבסיסיים ואקורדים הם הבתים שהרכבנו מהם, מעגל החמישיות הוא מפת העיר השלמה. הוא מסביר מדוע אקורדים מסוימים נמשכים אחד לשני כמו מגנט, איך שירים מורכבים בנויים בצורה הגיונית, ואיך אפשר לנדוד מסולם אחד לסולם אחר מבלי שהמאזין ירגיש זיוף צורם. ברגע שתדע לקרוא את המפה הזו, כתיבת שירים והוצאת שירים משמיעה יהפכו ממשחק מתסכל של ניחושים להבנה של היגיון מתמטי גיאומטרי פשוט."
        },
        {
          type: "highlight",
          title: "פרק 1: שעון היד של המוזיקה וכוח המשיכה",
          content: "למה קוראים לזה מעגל החמישיות? בפרק על אינטרוולים למדנו שהמרחק העוצמתי והיציב ביותר במוזיקה הוא הקווינטה הזכה (המרחק החמישי בסולם, השווה לדילוג של 7 סריגים). בפיזיקה של הסאונד יש כוח משיכה טבעי ועצום בין אקורד מסוים לבין האקורד שנמצא קווינטה אחת מתחתיו. במעגל החמישיות לקחו את כל 12 הצלילים שקיימים במוזיקה המערבית וסידרו אותם בדיוק כמו שעות על שעון קיר. אבל במקום לסדר אותם לפי סדר אלפביתי עוקב כמו בקלידים של פסנתר, סידרו אותם בקפיצות קבועות של קווינטה. אם נציב את התו דו (C) בשעה 12 בדיוק, הקפיצה הבאה לשעה 1 תהיה אל התו סול (G) שנמצא במרחק של קווינטה מדו. השעה 2 תהיה התו רה (D) שהוא קווינטה מסול. אם תמשיך לקפוץ במרווחים של קווינטות סביב השעון, תעבור בדיוק דרך כל 12 הצלילים הקיימים ביקום המוזיקלי, עד שתסגור מעגל ותחזור בדיוק לנקודת ההתחלה. הסידור הזה לא נוצר במקרה, הוא משקף מעגל מושלם ואינסופי של מתח ופתרון מוזיקלי."
        },
        {
          type: "interactive",
          content: "circle-clock"
        },
        {
          type: "paragraph",
          title: "פרק 2: קיצור הדרך האולטימטיבי לכתיבת שירים (המז'ור)",
          content: "רוב הגיטריסטים לא קוראים תווים ולא מתעניינים במספר הדיאזים או הבמולים שיש בסולם. אז למה המעגל כל כך רלוונטי עבורנו? כי הוא מספק לנו באופן ויזואלי ומיידי את 'השכונה ההרמונית' של כל שיר בעולם. הכלל הוא מבריק בפשטותו: כל אקורד במעגל תמיד יהיה מוקף מיד בחברים הכי טובים שלו. בחר כל אקורד שתרצה במעגל החיצוני (למשל סול מז'ור). הוא השורש שלנו, הדרגה הראשונה. האקורד שנמצא משמאלו (דו) הוא הדרגה הרביעית, והאקורד שנמצא מימינו (רה) הוא הדרגה החמישית. קיבלת מיד את מהלך ה-1-4-5 המפורסם. אלו הם שלושת האקורדים המז'וריים היחידים ששייכים לאותו סולם, וביחד הם מרכיבים את השלד למיליוני שירים אופטימיים ושמחים. המעגל מגיש לך את התשובה הוודאית על מגש מבלי שתצטרך לחשב מרחקים בראש."
        },
        {
          type: "fretboard",
          title: "פרק 3: המעגל הפנימי והצל המינורי (סולמות יחסיים)",
          content: "דיברנו עד עכשיו על סולמות מז'וריים, שהם מאירים ושמחים. אבל לכל גיבור יש צל. אם תסתכל מקרוב על המעגל, תבחין שיש לו טבעת פנימית קטנה יותר. הטבעת הזו חושפת את אחד הסודות היפים ביותר בתיאוריה המוזיקלית: סולמות יחסיים. מתחת לכל סולם מז'ורי במעגל החיצוני יושב סולם מינורי במעגל הפנימי. לדוגמה, בדיוק מתחת לדו מז'ור (C Major) יושב לה מינור (Am). מה המשמעות של השכנות הזו? המשמעות היא ששני הסולמות הללו חולקים בדיוק את אותם התווים בדיוק. אם תיקח את כל התווים השמחים של סולם דו מז'ור, אבל פשוט תחליט להתחיל לנגן ולסיים אותם סביב התו 'לה', פתאום כל האווירה תשתנה בקיצוניות. המוזיקה תהפוך לאפלה ודרמטית, למרות שלא הוספת שום תו חדש לחומרי הגלם שלך. היכולת לקפוץ בין המעגל החיצוני לפנימי (למשל לעבור מבית מז'ורי לפזמון מינורי באותו שיר) היא הטריק העתיק והיעיל ביותר לייצר שינוי רגשי עמוק, והמעגל תמיד מראה לך מי בן הזוג הרגשי של הסולם שלך."
        },
        {
          type: "interactive",
          content: "neighborhood-finder"
        },
        {
          type: "highlight",
          title: "פרק 4: הבלוז, הדרמה והמתח המושלם (בניית מהלכים במינור)",
          content: "אם הבנת איך למצוא את מהלך ה-1-4-5 בשיר מז'ורי, אתה כבר יודע איך לעשות את זה במינור, כי החוקים הגיאומטריים של המעגל זהים לחלוטין. בחר לך אקורד שורש במעגל הפנימי, למשל לה מינור (Am). הוא הדרגה הראשונה שלך. השכן המיידי שלו משמאל במעגל הפנימי הוא הדרגה הרביעית שלך (Dm). השכן המיידי שלו מימין הוא הדרגה החמישית (Em). אם תנגן את שלושתם, קיבלת את מהלך ה-1-4-5 המינורי שהוא הבסיס הקלאסי לרוק, מטאל ובלוז. אבל כאן מסתתר אחד הסודות המקצועיים העוצמתיים ביותר בתיאוריה המוזיקלית: טריק הדרגה החמישית. האוזן האנושית מכורה למתח ופתרון. אנחנו אוהבים שהדרגה החמישית מייצרת מתח ענק שמושך אותנו חזק בחזרה הביתה אל השורש. הבעיה היא שאקורד מינורי (כמו Em) נשמע קצת רך מדי, והוא לא מייצר מספיק משיכה דרמטית כדי להחזיר אותנו ל-Am. הפתרון של מאות שנות כתיבת שירים הוא לשבור את החוקים של הסולם. כותבי שירים לוקחים את הדרגה החמישית המינורית (Em) והופכים אותה בכוח לאקורד מז'ורי (E) או לאקורד דומיננטה (E7). האקורד E7 לא שייך באופן טבעי לסולם לה מינור, אבל הצליל הצורם והמתוח שלו מייצר כוח משיכה מגנטי אדיר שדורש להיפתר בחזרה הביתה. המעגל מראה לך את זה בצורה מבריקה: כדי למצוא את האקורד המותח הזה, פשוט צא מהמשבצת של Em במעגל הפנימי, ושאל את האקורד E מהמעגל החיצוני שמעליו. הטריק הזה הוא ההבדל בין שיר שנשמע נחמד, לשיר שמעביר צמרמורת."
        },
        {
          type: "interactive",
          content: "dominant-trick-lab"
        },
        {
          type: "paragraph",
          title: "פרק 5: שבילי עפר למימדים אחרים (מודולציה והשאלות)",
          content: "לפעמים אתה כותב שיר ומרגיש שהוא תקוע. אתה מנגן את אותם אקורדים שוב ושוב והשעמום מתחיל להשתלט. כאן המעגל מראה לך אילו סולמות קרובים זה לזה הרמונית, ואילו סולמות רחוקים וזרים לחלוטין. אם אתה מנגן בסולם דו מז'ור, המעגל מראה לך שהסולם השכן מימין (סול מז'ור) חולק איתו כמעט את כל אותם התווים. המשמעות הפרקטית היא שאתה יכול לגנוב אקורד מהשכן שלך מבלי לייצר זיוף באוזן של המאזין. הפעולה הזו נקראת השאלת אקורדים. במקום להישאר כלוא באקורדים הבטוחים שלך, המפה חושפת את שבילי העפר הבטוחים אל הסולמות השכנים. זה מאפשר להוסיף צבעים הרמוניים מפתיעים ומרגשים. בנוסף, אם תרצה להעלות את השיר כולו לסולם אחר (מודולציה) כדי להגביר את האנרגיה בפזמון האחרון, המעגל יראה לך את המסלול החלק ביותר לעשות זאת ללא קפיצות גסות."
        },
        {
          type: "paragraph",
          title: "סיכום: המצפן של הגיטריסט",
          content: "הטעות הגדולה ביותר היא לנסות לשנן את מעגל החמישיות בעל פה כתמונה סטטית. במקום זאת, התייחס אליו כאל כלי עבודה שימושי בסטודיו שלך. בפעם הבאה שאתה מנסה לכתוב שיר, או להוציא שיר של להקה אהובה משמיעה, פתח את המעגל מול העיניים. הבט היכן האקורדים יושבים אחד ביחס לשני. אם תרצה לשיר שיר בסולם שיתאים יותר לקול שלך, פשוט קח את הצורה הגיאומטרית של המהלך על גבי המעגל, וסובב אותה כמה צעדים ימינה או שמאלה (טרנספוזיציה). מעגל החמישיות הוא לא תיאוריה אקדמית מעייפת, הוא המצפן שמאפשר לך לנווט באוקיינוס של הסאונד עם ביטחון מוחלט שאתה יודע בדיוק היכן אתה נמצא ולאן אתה מסוגל ללכת הלאה."
        }
      ]
    },
    en: {
      title: "The Circle of Fifths",
      subtitle: "The Cosmic Clock of Harmony and the Songwriter's Secret Map",
      tags: ["Masterclass", "Harmony", "Songwriting"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: Much More Than a Memorization Chart for Music Geeks",
          content: "One of the most intimidating images a beginner guitarist encounters is a diagram of the circle of fifths. At first glance, it looks like a periodic table of elements reserved for classical musicians or academy students. But in reality, the circle of fifths is not dry theory. It is the ultimate navigation system of Western music. If intervals are the basic building blocks and chords are the houses we built from them, the circle of fifths is the entire city map. It explains why certain chords are drawn to each other like magnets, how complex songs are logically constructed, and how you can travel from one scale to another without the listener feeling a jarring dissonance. Once you know how to read this map, songwriting and learning songs by ear will turn from a frustrating game of guessing into an understanding of simple geometric mathematical logic."
        },
        {
          type: "highlight",
          title: "Chapter 1: The Music's Wristwatch and the Force of Gravity",
          content: "Why is it called the circle of fifths? In the intervals chapter, we learned that the most powerful and stable distance in music is the perfect fifth (the fifth distance in the scale, equal to a jump of 7 frets). In the physics of sound, there is a natural and massive gravitational pull between a certain chord and the chord located one fifth below it. In the circle of fifths, they took all 12 notes that exist in Western music and arranged them exactly like hours on a wall clock. But instead of arranging them in consecutive alphabetical order like on piano keys, they arranged them in fixed jumps of a fifth. If we place the note C at exactly 12 o'clock, the next jump to 1 o'clock will be to the note G, which is a fifth away from C. 2 o'clock will be the note D, which is a fifth from G. If you continue to jump in intervals of fifths around the clock, you will pass exactly through all 12 notes existing in the musical universe, until you close the circle and return exactly to the starting point. This arrangement was not created by chance, it reflects a perfect and infinite circle of musical tension and resolution."
        },
        {
          type: "interactive",
          content: "circle-clock"
        },
        {
          type: "paragraph",
          title: "Chapter 2: The Ultimate Shortcut for Songwriting (The Major)",
          content: "Most guitarists do not read sheet music and are not interested in the number of sharps or flats in a scale. So why is the circle so relevant to us? Because it visually and immediately provides us with the 'harmonic neighborhood' of every song in the world. The rule is brilliantly simple: every chord on the circle will always be immediately surrounded by its best friends. Choose any chord you want on the outer circle (for example G Major). It is our root, the first degree. The chord to its left (C) is the fourth degree, and the chord to its right (D) is the fifth degree. You immediately get the famous 1-4-5 progression. These are the only three major chords that belong to the same scale, and together they form the skeleton for millions of optimistic and happy songs. The circle serves you the definitive answer on a silver platter without you having to calculate distances in your head."
        },
        {
          type: "fretboard",
          title: "Chapter 3: The Inner Circle and the Minor Shadow (Relative Scales)",
          content: "We have talked so far about major scales, which are bright and happy. But every hero has a shadow. If you look closely at the circle, you will notice that it has a smaller inner ring. This ring reveals one of the most beautiful secrets in musical theory: relative scales. Under every major scale in the outer circle sits a minor scale in the inner circle. For example, right under C Major sits A Minor (Am). What is the meaning of this proximity? The meaning is that these two scales share exactly the exact same notes. If you take all the happy notes of the C Major scale, but simply decide to start and end playing them around the note 'A', suddenly the whole atmosphere will change drastically. The music will become dark and dramatic, even though you haven't added a single new note to your raw materials. The ability to jump between the outer and inner circle (for example moving from a major verse to a minor chorus in the same song) is the oldest and most effective trick to produce a deep emotional change, and the circle always shows you who your scale's emotional partner is."
        },
        {
          type: "interactive",
          content: "neighborhood-finder"
        },
        {
          type: "highlight",
          title: "Chapter 4: Blues, Drama and the Perfect Tension (Building Minor Progressions)",
          content: "If you understand how to find the 1-4-5 progression in a major song, you already know how to do it in minor, because the geometric rules of the circle are completely identical. Choose a root chord in the inner circle, for example A Minor (Am). It is your first degree. Its immediate neighbor to the left in the inner circle is your fourth degree (Dm). Its immediate neighbor to the right is the fifth degree (Em). If you play all three, you get the minor 1-4-5 progression which is the classic basis for rock, metal and blues. But here lies one of the most powerful professional secrets in musical theory: The Fifth Degree Trick. The human ear is addicted to tension and resolution. We love that the fifth degree creates a huge tension that pulls us hard back home to the root. The problem is that a minor chord (like Em) sounds a bit too soft, and it does not generate enough dramatic pull to return us to Am. The solution of hundreds of years of songwriting is to break the rules of the scale. Songwriters take the minor fifth degree (Em) and force it into a major chord (E) or a dominant chord (E7). The E7 chord does not naturally belong to the A minor scale, but its jarring and tense sound creates a massive magnetic pull that demands to be resolved back home. The circle shows you this brilliantly: to find this tense chord, simply step out of the Em box in the inner circle, and borrow the E chord from the outer circle above it. This trick is the difference between a song that sounds nice, and a song that gives you chills."
        },
        {
          type: "interactive",
          content: "dominant-trick-lab"
        },
        {
          type: "paragraph",
          title: "Chapter 5: Dirt Roads to Other Dimensions (Modulation and Borrowing)",
          content: "Sometimes you write a song and feel it's stuck. You play the same chords over and over again and boredom starts to take over. Here the circle shows you which scales are harmonically close to each other, and which scales are far and completely foreign. If you play in the C Major scale, the circle shows you that the neighboring scale to the right (G Major) shares almost all the exact same notes with it. The practical meaning is that you can borrow a chord from your neighbor without producing a dissonance in the listener's ear. This action is called borrowing chords. Instead of staying locked in your safe chords, the map reveals the safe dirt roads to the neighboring scales. This allows you to add surprising and exciting harmonic colors. In addition, if you want to transpose the entire song to another scale (modulation) to increase the energy in the final chorus, the circle will show you the smoothest route to do so without rough jumps."
        },
        {
          type: "paragraph",
          title: "Conclusion: The Guitarist's Compass",
          content: "The biggest mistake is trying to memorize the circle of fifths by heart as a static picture. Instead, treat it as a useful tool in your studio. The next time you try to write a song, or learn a song by a favorite band by ear, open the circle in front of your eyes. Look at where the chords sit relative to each other. If you want to sing a song in a scale that better suits your voice, simply take the geometric shape of the progression on the circle, and rotate it a few steps right or left (transposition). The circle of fifths is not tiring academic theory, it is the compass that allows you to navigate the ocean of sound with absolute certainty that you know exactly where you are and where you are capable of going next."
        }
      ]
    }
  }
};
