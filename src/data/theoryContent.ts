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
  }
};
