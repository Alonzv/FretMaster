export interface ArticleSection {
  type: 'paragraph' | 'highlight' | 'example' | 'fretboard';
  title?: string;
  content: string;
}

export interface ArticleLang {
  title: string;
  subtitle: string;
  tags: string[];
  sections: ArticleSection[];
}

export interface TheoryArticle {
  id: string;
  he: ArticleLang;
  en: ArticleLang;
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
      subtitle: "השפה הסודית של המוזיקה והקואורדינטות של הפרטבורד",
      tags: ["יסודות", "מרחקים", "אימון_שמיעה"],
      sections: [
        {
          type: "paragraph",
          title: "הקדמה: למה לא אכפת לנו משמות התווים?",
          content: "תחשוב על אינטרוולים כמו על קואורדינטות ב-GPS. כשאנחנו מאזינים למוזיקה, המוח האנושי כמעט ולא מזהה תווים ספציפיים כמו 'פה דיאז' או 'מי במול'. מה שהמוח שלנו כן מזהה, ובצורה מושלמת, זה את המרחק בין הצלילים. אינטרוול הוא פשוט המרחק הפיזי והתדרי בין שני תווים. ההבנה של אינטרוולים היא קו ההפרדה בין גיטריסטים שמנגנים מהזיכרון, לבין מוזיקאים שבאמת מבינים מה הם עושים. ברגע שאתה מבין אינטרוולים, אתה יכול לקחת כל ריף, סולו או מהלך אקורדים, ולהזיז אותו לכל מקום על צוואר הגיטרה. אתה מפסיק לחשוב 'איזה תו בא עכשיו?' ומתחיל לחשוב 'איזה מרחק בא עכשיו?'"
        },
        {
          type: "highlight",
          title: "פרק 1: מילון האינטרוולים (המרחקים בסריגים)",
          content: "בגיטרה, כל סריג שווה ל'חצי טון'. כדי לחשב אינטרוול, אנחנו בוחרים נקודת התחלה (השורש), ופשוט סופרים כמה סריגים אנחנו זזים ממנו:\n• סקונדה קטנה (סריג 1): המרווח הקטן ביותר. נשמע מותח ואפל.\n• סקונדה גדולה (2 סריגים): מרחק של טון שלם.\n• טרצה קטנה (3 סריגים): ה-DNA של העצב. המרווח שקובע שאקורד הוא מינורי.\n• טרצה גדולה (4 סריגים): ה-DNA של השמחה. המרווח שקובע שאקורד הוא מז'ורי.\n• קוורטה זכה (5 סריגים): מרווח פתוח ויציב.\n• טריטון (6 סריגים): 'מרווח השטן'. נשמע מרושע ולא פתור.\n• קווינטה זכה (7 סריגים): הבסיס לכל אקורדי הכוח (Power Chords).\n• ספטימה קטנה (10 סריגים): התבלין של הבלוז והפאנק.\n• אוקטבה (12 סריגים): חזרה לאותו צליל בתדר כפול."
        },
        {
          type: "fretboard",
          title: "פרק 2: אינטרוולים כיצירות גיאומטריות",
          content: "הגיטרה היא כלי גיאומטרי. אינטרוולים מתורגמים על הצוואר לצורות קבועות שלא משתנות:\n- קווינטה זכה (Perfect 5th): שורש במיתר השישי, הקווינטה תהיה במיתר שמתחתיו, שני סריגים קדימה.\n- אוקטבה: שורש במיתר השישי, דילוג על מיתר, אצבע במיתר הרביעי שני סריגים קדימה.\n- טרצה גדולה (Major 3rd): מיתר אחד למטה, סריג אחד אחורה מהשורש.\nברגע שהידיים לומדות את הצורות האלה, הפרטבורד הופך לרשת ברורה של מרחקים."
        },
        {
          type: "example",
          title: "פרק 3: טריק השירים (אימון שמיעה)",
          content: "הדרך הטובה ביותר לזהות אינטרוולים היא לחבר אליהם שיר מוכר:\n• סקונדה קטנה (סריג 1): נעימת הסרט 'מלתעות' (Jaws).\n• טרצה קטנה (3 סריגים): הפתיח של Seven Nation Army.\n• קוורטה זכה (5 סריגים): נעימת 'מלחמת הכוכבים'.\n• טריטון (6 סריגים): הפתיח של 'משפחת סימפסון'.\n• קווינטה זכה (7 סריגים): הפסקול של 'סופרמן'.\n• אוקטבה (12 סריגים): Somewhere Over the Rainbow."
        },
        {
          type: "paragraph",
          title: "סיכום: מאבני בניין לאקורדים",
          content: "אינטרוולים הם אבני הלגו של המוזיקה. ברגע שאתה מזהה אותם ויודע למצוא אותם על הגיטרה, בניית אקורדים הופכת למשימה פשוטה. למשל, אקורד מז'ורי הוא בסך הכל שורש, אליו הוספנו טרצה גדולה, ואליה הוספנו קווינטה זכה. אקורד מינורי הוא פשוט שורש, אליו הוספנו טרצה קטנה (שעושה אותו עצוב), ואליה הוספנו קווינטה זכה. השליטה בגיאומטריה הזו היא המפתח לאלתור חופשי על כל הצוואר."
        }
      ]
    },
    en: {
      title: "Intervals",
      subtitle: "The Secret Language of Music and the Coordinates of the Fretboard",
      tags: ["Basics", "Distances", "Ear_Training"],
      sections: [
        {
          type: "paragraph",
          title: "Introduction: Why Note Names Don't Matter",
          content: "Think of intervals like GPS coordinates. When we listen to music, the human brain rarely identifies specific notes like 'F sharp' or 'E flat'. What our brain does recognize, and perfectly so, is the distance between the notes. An interval is simply the physical and frequency distance between two notes. Understanding intervals is the dividing line between guitarists who play from memory and musicians who truly understand what they are doing. Once you understand intervals, you can take any riff, solo, or chord progression and move it anywhere on the guitar neck. You stop thinking 'what note comes next?' and start thinking 'what distance comes next?'"
        },
        {
          type: "highlight",
          title: "Chapter 1: The Interval Dictionary (Distances in Frets)",
          content: "On the guitar, every fret equals a 'Half Step'. To calculate an interval, we choose a starting point (the root), and simply count how many frets we move from it:\n• Minor 2nd (1 fret): The smallest interval. Sounds tense and dark.\n• Major 2nd (2 frets): A distance of a whole step.\n• Minor 3rd (3 frets): The DNA of sadness. Determines a chord is minor.\n• Major 3rd (4 frets): The DNA of happiness. Determines a chord is major.\n• Perfect 4th (5 frets): An open and stable interval.\n• Tritone (6 frets): The 'Devil's Interval'. Sounds evil and unresolved.\n• Perfect 5th (7 frets): The foundation for Power Chords.\n• Minor 7th (10 frets): The spice of blues and funk.\n• Octave (12 frets): A return to the exact same note at double the frequency."
        },
        {
          type: "fretboard",
          title: "Chapter 2: Intervals as Geometric Shapes",
          content: "The guitar is a geometric instrument. Intervals translate on the neck to fixed shapes that do not change:\n- Perfect 5th: Root on the 6th string, its 5th will be on the string below, two frets ahead.\n- Octave: Root on the 6th string, skip a string, finger on the 4th string two frets ahead.\n- Major 3rd: One string down, one fret behind your root.\nOnce your hands learn these shapes, the fretboard becomes a clear grid of distances."
        },
        {
          type: "example",
          title: "Chapter 3: The Song Trick (Ear Training)",
          content: "The best way to recognize intervals is to associate them with a famous song:\n• Minor 2nd (1 fret): The 'Jaws' theme.\n• Minor 3rd (3 frets): Seven Nation Army riff.\n• Perfect 4th (5 frets): Star Wars theme.\n• Tritone (6 frets): The Simpsons opening.\n• Perfect 5th (7 frets): Superman soundtrack.\n• Octave (12 frets): Somewhere Over the Rainbow."
        },
        {
          type: "paragraph",
          title: "Conclusion: From Building Blocks to Chords",
          content: "Intervals are the Lego blocks of music. Once you recognize them and know how to find them on the guitar, building chords becomes a simple task. For example, a major chord is simply a root, to which we added a major third, and to which we added a perfect fifth. A minor chord is simply a root, to which we added a minor third (which makes it sad), and to which we added a perfect fifth. Mastering this geometry is the key to free improvisation all over the neck."
        }
      ]
    }
  }
};
