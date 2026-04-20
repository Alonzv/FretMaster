// Expert-level bilingual genre theory content for FretMaster.
// Each entry provides rich educational material about scales, chords, progressions,
// techniques, and the emotional character of a guitar genre.

export interface GenreEntry {
  id: string
  titleHe: string
  titleEn: string
  emojiIcon: string
  colorHex: string
  hookHe: string
  hookEn: string
  paragraphsHe: string[]
  paragraphsEn: string[]
}

export const GENRE_CONTENT: Record<string, GenreEntry> = {

  blues: {
    id: 'blues',
    titleHe: 'בלוז',
    titleEn: 'Blues',
    emojiIcon: '🎷',
    colorHex: '#1a4a7a',
    hookHe: 'הבלוז הוא שפה של כאב שהפכה לשמחה — שבע תווים שמספרים הכל.',
    hookEn: 'Blues is a language of pain turned joy — seven notes that say everything.',
    paragraphsHe: [
      'הסולם המרכזי בבלוז הוא סולם הבלוז — פנטטוני מינור (דרגות 1, b3, 4, 5, b7) בתוספת ה-"blue note", הטריטון (b5). שישה תווים בלבד, אבל כוחם עצום: ה-b3 וה-b7 יוצרים מתח נגד אקורדי הדומיננט הגדולים, וה-b5 מוסיף גוון מינים חריף שמיד מזוהה כבלוז. בגיטרה, הסולם הזה מתנגן לרוב ב-Box Position אחד שניתן להזיז לכל טוניקה, מה שנתן לגיטריסטי בלוז כמו B.B. King ו-SRV ניידות אינסופית על הצוואר.',
      'הפרוגרסיה האיקונית של הבלוז היא ה-12-Bar Blues: I7 – IV7 – V7. מה שמיוחד בה הוא שכל שלושת האקורדים הם דומיננט שביעי — I7, IV7, V7 — דבר שלא קיים בסולם מז׳ור רגיל. האקורד I שבדרך כלל הוא מג׳ור הפך לדומיננט שביעי, ובכך כל הפרוגרסיה "כהה" יותר וטעונה מתח. ה-Quick Change (מעבר ל-IV בטקט השני) ו-Turnaround (V-IV-I בשלוש הטקטים האחרונות) הם חוקים שכדאי לשנן בעל-פה.',
      'שאלה ותגובה (Call and Response) היא העקרון המבני הגדול ביותר של הבלוז. הגיטרה "שואלת" פרזה קצרה ואז "עונה" לעצמה — חיקוי של סגנון שירת הבלוז הוקאלי. הטכניקה שמממשת את זה בגיטרה היא ה-Bend: מתיחת מיתר כלפי מעלה כדי להגיע לתו שלא נמצא ממש על הסריג. ה-Whole-Step Bend (מתיחה של טון שלם) מ-b3 ל-Major 3rd הוא ה-"גניחה" האייקונית של הבלוז. SRV השתמש בטיפול מיתר כבד (13) שהפך את ה-bend לאפילו יותר דרמטי.',
      'בלוז הוא בסיס לכל מוזיקת גיטרה מודרנית. ג׳ז, רוק, R&B — כולם בנויים על היסודות שלו. להבין את ה-12-Bar ואת סולם הבלוז זה כמו ללמוד את האלפבית של הגיטרה. גיטריסטים כמו B.B. King שלטו באמנות המקסימום רגשי ממינימום תווים — לא כמה תווים אתה מנגן, אלא איך אתה מנגן אותם. Vibrato, slides, hammer-ons ו-pull-offs — כל אלה מגיעים מהאוצר הטכני של הבלוז.',
    ],
    paragraphsEn: [
      'The central scale in blues is the blues scale — a minor pentatonic (degrees 1, b3, 4, 5, b7) with the added "blue note," the tritone (b5). Only six notes, but enormously powerful: the b3 and b7 create tension against the major dominant chords, and the b5 adds a biting chromatic flavor instantly recognizable as blues. On guitar, this scale is typically played in a single Box Position that can be shifted to any tonic, giving players like B.B. King and SRV endless mobility along the neck.',
      'The iconic blues progression is the 12-Bar Blues: I7 – IV7 – V7. What makes it unique is that all three chords are dominant sevenths — I7, IV7, V7 — something that does not exist in a standard major key. The I chord, normally a pure major, becomes a dominant seventh, making the entire progression darker and more tension-laden. The Quick Change (moving to IV in bar 2) and the Turnaround (V-IV-I in the final three bars) are formulas worth internalizing by ear.',
      'Call and Response is the greatest structural principle in blues. The guitar "asks" a short phrase and then "answers" itself — mimicking the vocal style of blues singing. The technique that realizes this on guitar is the bend: stretching a string upward to reach a pitch not found directly on the fret. The whole-step bend from b3 up to the major 3rd is the iconic blues "cry." SRV used heavy strings (13s) that made every bend even more dramatic and expressive.',
      'Blues is the foundation of all modern guitar music. Jazz, rock, R&B — all are built on its fundamentals. Understanding the 12-Bar and the blues scale is like learning the alphabet of guitar. Players like B.B. King mastered the art of maximum emotion from minimum notes — it is not how many notes you play, but how you play them. Vibrato, slides, hammer-ons and pull-offs all come from the blues technical vocabulary.',
    ],
  },

  rock: {
    id: 'rock',
    titleHe: 'רוק',
    titleEn: 'Rock',
    emojiIcon: '🎸',
    colorHex: '#7a1a1a',
    hookHe: 'פאוור קורד אחד, ופתאום כל הבמה רועדת — זה הרוק.',
    hookEn: 'One power chord, and suddenly the whole stage shakes — that is rock.',
    paragraphsHe: [
      'הסולם האחד שמגדיר את הרוק הוא הפנטטוני מינור. חמישה תווים בלבד (1, b3, 4, 5, b7), אך הם יוצרים את הסאונד הכי זיהויי בגיטרה החשמלית. כששמים דיסטורשן על גיטרה ומנגנים פנטטוני מינור, נולד הרוק. Jimmy Page, Eric Clapton, Slash — כולם שלטו בחמשת התווים האלה. ה-Natural Minor (אאולי) מוסיף עוד שני תווים (b2 וb6) ומעניק צבע אפל יותר שמתאים למטאל ופוסט-גראנג׳.',
      'האקורד האייקוני של הרוק הוא ה-Power Chord (קווינטה): שורש + קווינטה (לפעמים אוקטבה), בלי טרצה. ללא טרצה, האקורד הוא "נייטרלי" — לא מז׳ור ולא מינור — מה שהופך אותו לבוטה ועוצמתי בדיסטורשן. הפרוגרסיות הקלאסיות: I-IV-V (רוק׳נ׳רול), I-bVII-IV (הפרוגרסיה של Led Zeppelin ו-Hendrix — "Hey Joe", "What Is And What Should Never Be"), vi-IV-I-V (הפרוגרסיה הנפוצה ביותר בפופ-רוק). ה-bVII מגיע מהסולם המיקסולידי (מז׳ור עם b7), ונותן לרוק את תחושת הריחוף שלו.',
      'טכניקות הגיטרה שהגדירו את הרוק: Chuck Berry פיתח את ה-Duck Walk ו-Double Stops שהפכו לבסיס הרוק׳נ׳רול. Hendrix הוסיף Whammy Bar, Feedback מבוקרת, ו-Octave Shapes. Slash ו-Page הוסיפו Legato Runs — Hammer-ons ו-Pull-offs מהירים שיוצרים זרימה חלקה בלי לנגן כל תו בפיק. בפוסט-גראנג׳, ה-Drop D Tuning (מיתר 6 מ-E ל-D) אפשר פאוור קורדים בבאר אחת — Kurt Cobain, Eddie Vedder.',
      'הרוק מדבר בניגודים: ה-Verse בדרך כלל שקט (אקורדים נקיים או קלינים), וה-Chorus מתפוצץ בדיסטורשן. זה מייצר דרמה. השימוש ב-Guitar Solo באמצע השיר הוא המסורת הגדולה של הרוק — שלושים שניות שגיטריסט ה"מדבר" עם הסולם הפנטטוני מעל לפרוגרסיה. הדינמיקה הזאת — שקט→רעש, נקי→מועווה — היא הלב של הרוק.',
    ],
    paragraphsEn: [
      'The one scale that defines rock is the minor pentatonic. Only five notes (1, b3, 4, 5, b7), yet they create the most recognizable sound on electric guitar. Add distortion to a guitar and play minor pentatonic, and rock is born. Jimmy Page, Eric Clapton, Slash — all mastered these five notes. The natural minor (Aeolian) adds two more tones (b6 and b2) for a darker color suited to metal and post-grunge.',
      'The iconic chord in rock is the power chord (perfect fifth): root + fifth (sometimes octave), with no third. Without a third, the chord is "neutral" — neither major nor minor — making it blunt and powerful under distortion. Classic progressions: I-IV-V (rock \'n\' roll), I-bVII-IV (the Led Zeppelin and Hendrix progression — "Hey Joe," "What Is And What Should Never Be"), vi-IV-I-V (the most common pop-rock progression). The bVII comes from the Mixolydian mode (major with b7) and gives rock its hovering, anthemic feel.',
      'Guitar techniques that defined rock: Chuck Berry pioneered the Duck Walk and double stops that became the foundation of rock \'n\' roll. Hendrix added whammy bar, controlled feedback, and thumb-over-the-neck chord shapes. Slash and Page added legato runs — fast hammer-ons and pull-offs that create smooth flow without picking every note. In post-grunge, Drop D tuning (dropping string 6 from E to D) allowed power chords in a single barre — Kurt Cobain, Eddie Vedder.',
      'Rock speaks in contrasts: the verse is usually quiet (clean or lightly overdriven), and the chorus explodes with distortion. This creates drama. The guitar solo in the middle of the song is rock\'s great tradition — thirty seconds of a guitarist "speaking" with the pentatonic scale over the progression. This dynamic — quiet to loud, clean to overdriven — is the heart of rock.',
    ],
  },

  jazz: {
    id: 'jazz',
    titleHe: 'ג׳אז',
    titleEn: 'Jazz',
    emojiIcon: '🎩',
    colorHex: '#2a1a5a',
    hookHe: 'בג׳אז, הצליל שאתה לא מנגן חשוב כמו זה שכן — הרמוניה כשפה חיה.',
    hookEn: 'In jazz, the note you do not play matters as much as the one you do — harmony as a living language.',
    paragraphsHe: [
      'הבסיס ההרמוני של הג׳אז הוא תנועת ii-V-I: אקורד מינור שביעי על הדרגה השנייה, אקורד דומיננט שביעי על הדרגה החמישית, ואקורד מג׳ור שביעי (או מינור 7) על הטוניקה. הסיבה שזה עובד כל כך טוב היא תנועת הבאס ב-Fourths (קוורטה יורדת, או קווינטה עולה), וה-Leading Tone שנמצא בדרגה השביעית של V7 ונמשך טבעית ל-I. בג׳אז, ii-V-I הוא כמו משפט הרמוני שלם — כל שיר מורכב משורה של "משפטים" כאלה, לפעמים עם Tonicizations (מעברים לטוניקות זמניות).',
      'סולמות הג׳אז: מעל אקורד ii הגיטרה מנגנת בדרך כלל דוריאן (מינור עם Major 6th — 1,2,b3,4,5,6,b7). מעל V7 משתמשים במיקסולידי (מז׳ור עם b7) או ב-Altered Scale (Super Locrian, עשיר בטרציות שטוחות ומחודדות). מעל I Maj7 — Lydian (עם #4) לצבע "ריחף". ה-Bebop Scale (מז׳ור עם passing tone חצי-טוני) נותן את ה-swing האייקוני כי מניח את תווי האקורד תמיד על הזמנים החזקים.',
      'הרחבת אקורדים היא לב הג׳אז: 7th, 9th, 11th, 13th. אקורד C7 בסיסי הוא C-E-G-Bb. הוספת D היא ה-9th, F ה-11th, A ה-13th. ג׳אז גיטריסטים נוהגים לדלג על תווים "מיותרים" (בדרך כלל ה-Root וה-Fifth) ולהשמיע רק את Shell Tones: 3rd וה-7th — שהם האחראים לאיכות האקורד. אקורד עם 3 ו-7 בלבד כבר "נשמע" ג׳אז. ה-Tritone Substitution הוא טכניקה מתקדמת: מחליפים V7 באקורד שנמצא בטריטון ממנו — לדוגמה, C7 מוחלף ב-F#7, כי שניהם חולקים את אותו טריטון פנימי (E-Bb).',
      'Comping בג׳אז — ליווי — הוא אמנות בפני עצמה. הגיטריסט משתמש ב-Chord Shells ובמקצבים Syncopated (סינקופות) כדי ל"שוחח" עם הנגן המוביל מבלי לעצבן. Chord Melody הוא שיטה שבה הגיטרה מנגנת את המלודיה ואת ההרמוניה בו-זמנית — טכניקה שגיטריסטים כמו Joe Pass ו-Wes Montgomery שלטו בה במופת. להבין ג׳אז זה ללמוד שהרמוניה היא לא "רקע" אלא שפה פעילה.',
    ],
    paragraphsEn: [
      'The harmonic foundation of jazz is the ii-V-I movement: a minor seventh chord on the second degree, a dominant seventh on the fifth, and a major seventh (or minor 7) on the tonic. The reason it works so well is the bass motion in fourths (descending fourth, or ascending fifth), and the leading tone found in the seventh degree of V7 that naturally resolves to I. In jazz, ii-V-I is like a complete harmonic sentence — every song is built from a series of such "sentences," sometimes with tonicizations (temporary tonic shifts).',
      'Jazz scales: over a ii chord, the guitar typically plays Dorian (minor with major 6th — 1,2,b3,4,5,6,b7). Over V7, Mixolydian (major with b7) or the Altered Scale (Super Locrian, rich in flat and sharp tensions) are used. Over I Maj7 — Lydian (with #4) for a "floating" color. The Bebop Scale (major with a chromatic passing tone) produces the iconic swing feel because it places chord tones on the strong beats of every bar.',
      'Chord extensions are the heart of jazz: 7th, 9th, 11th, 13th. A basic C7 is C-E-G-Bb. Adding D gives the 9th, F the 11th, A the 13th. Jazz guitarists typically omit "superfluous" tones (usually the root and fifth) and voice only shell tones: the 3rd and 7th — these are responsible for chord quality. A chord with just 3rd and 7th already "sounds" like jazz. Tritone substitution is an advanced technique: replace V7 with a chord a tritone away — for example, C7 is replaced by F#7, because both share the same internal tritone (E and Bb).',
      'Comping in jazz — accompaniment — is an art form unto itself. The guitarist uses chord shells and syncopated rhythms to "converse" with the lead player without getting in the way. Chord melody is a method where the guitar plays the melody and harmony simultaneously — a technique mastered by Joe Pass and Wes Montgomery. Understanding jazz means learning that harmony is not "background" but an active language.',
    ],
  },

  country: {
    id: 'country',
    titleHe: 'קאנטרי',
    titleEn: 'Country',
    emojiIcon: '🤠',
    colorHex: '#5a3a00',
    hookHe: 'קאנטרי הוא הסיפור האמריקאי — ניגון פשוט שמוביל ישר ללב.',
    hookEn: 'Country is the American story — simple playing that goes straight to the heart.',
    paragraphsHe: [
      'הסולם המרכזי של הקאנטרי הוא הפנטטוני מג׳ור — חמישה תווים בלבד (1, 2, 3, 5, 6) שנשמעים "שמחים" ומלאי אור. בניגוד לבלוז שמשתמש בפנטטוני מינור (שנשמע עצוב יותר), הפנטטוני המז׳ורי של הקאנטרי מרגיש כמו שדות פתוחים וסיפורים טובים. עם זאת, גיטריסטי קאנטרי לא נמנעים מ-Chromatic Passing Notes — שימוש זמני בתווים מחוץ לסולם כדי לגשר בין תווים, מה שנותן את ה"curl" האייקוני של הקאנטרי.',
      'הרמוניה בקאנטרי מבוססת על אקורדים פתוחים (Open Chords) — G, C, D, A, E, Am — שמנוגנים ב-First Position ומנצלים מיתרים פתוחים ש"מצלצלים". השיטה הנאשוויל (Nashville Number System) ממספרת אקורדים לפי דרגות (1, 4, 5 במקום G, C, D) ומאפשרת לנגנים לתקשר מהר בלי לדון בטוניקה. Capo הוא כלי חיוני — בלחיצת Capo על הסריג 2, G, C, D הופכים ל-A, D, E בלי ללמוד תוויות חדשות. הדומיננט (V7) הוא הנפוץ ביותר — I-IV-V7 הוא ה-DNA של הקאנטרי.',
      'Hybrid Picking (פיקינג היברידי) הוא הטכניקה המגדירה של הקאנטרי: מנגנים בפיק ובאצבע (middle/ring) בו-זמנית. זה מאפשר Banjo Rolls, Pedal Steel Licks (חיקוי גיטרה פדל-סטיל), ו-Double Stops בקצב מהיר. Chicken Pickin׳ הוא סגנון מיוחד שבו מושכים את המיתר עם האצבע ומיד מחסמים (muting) — נשמע כמו "pik" חד שמחקה את צליל ה-Dobro. טכניקת ה-Telecaster עם נגן כמו Brad Paisley היא ביטוי מושלם לסאונד הקאנטרי.',
      'השפעת הפדל-סטיל על גיטרת הקאנטרי אינה מוגזמת — היא עיצבה את כל השפה. ה-Pedal Steel גלאיד מ-Note ל-Note בצורה שאי אפשר לחקות בגיטרה רגילה... אבל גיטריסטים ניסו: Oblique Bends (מתיחת מיתר אחד בזמן שהשני נשאר), Double-Stop Bends, וה-Steel Guitar Lick הקלאסי (b3 ל-3 עם כופל). הסאונד הזה הוא הקול של הגעגוע, של "home" — הסיבה שהקאנטרי כל כך נוגע בלב.',
    ],
    paragraphsEn: [
      'The central scale of country is the major pentatonic — just five notes (1, 2, 3, 5, 6) that sound "happy" and full of light. Unlike blues which uses the minor pentatonic (darker in feeling), country\'s major pentatonic feels like open fields and good stories. However, country guitarists are not shy about chromatic passing notes — briefly touching notes outside the scale to bridge between scale tones, creating the iconic "curl" of country phrasing.',
      'Harmony in country is built on open chords — G, C, D, A, E, Am — played in first position, exploiting open strings that "ring." The Nashville Number System numbers chords by degree (1, 4, 5 instead of G, C, D), allowing players to communicate quickly without discussing the tonic. A capo is an essential tool — place a capo at fret 2 and G, C, D become A, D, E without learning new shapes. The dominant (V7) is extremely common — I-IV-V7 is the DNA of country.',
      'Hybrid picking is the defining technique of country: playing with the pick and finger (middle or ring) simultaneously. This enables banjo rolls, pedal steel licks (imitating the pedal steel guitar), and fast double stops. Chicken pickin\' is a specialized style where the string is popped with a finger and immediately muted — producing a sharp "pik" sound that mimics the Dobro. Telecaster technique as heard in Brad Paisley\'s playing is the perfect expression of the country sound.',
      'The influence of the pedal steel guitar on country guitar cannot be overstated — it shaped the entire language. The pedal steel glides from note to note in ways impossible to replicate on a standard guitar... but guitarists have tried: oblique bends (bending one string while an adjacent one stays), double-stop bends, and the classic steel guitar lick (b3 to 3 with a double). That sound is the voice of longing, of "home" — the reason country touches the heart so deeply.',
    ],
  },

  metal: {
    id: 'metal',
    titleHe: 'מטאל',
    titleEn: 'Metal',
    emojiIcon: '🤘',
    colorHex: '#1a1a1a',
    hookHe: 'מטאל הוא הרמוניה קלאסית ושחורה — הרבה יותר תיאוריה ממה שחושבים.',
    hookEn: 'Metal is classical harmony gone dark — far more theory than people think.',
    paragraphsHe: [
      'המטאל בנוי על שני סולמות עיקריים: המינור ההרמוני (Harmonic Minor) והפריגי (Phrygian). המינור ההרמוני (1, 2, b3, 4, 5, b6, 7) מכיל את המרווח האייקוני של ה-Augmented Second בין ה-b6 ל-7 — צעד וחצי שנשמע "מזרחי" ואפל. זה מה שאתה שומע ב-Dio, ב-Maiden ב-Judas Priest. הפריגי (1, b2, b3, 4, 5, b6, b7) נותן את הצבע ה"ספרדי-אפל" — ה-b2 הוא הצליל הכי דיסוננטי ביחס לטוניקה, ומייצר מיד תחושה מאיימת. Slayer, Pantera, Sepultura — כולם חיים בפריגי.',
      'הטריטון (b5/augmented 4th) — ה-Diabolus in Musica שהיה אסור בימי הביניים — הוא ה"חתימה" ההרמונית של המטאל. מ-Black Sabbath ("Black Sabbath" הפותח עם טריטון) ועד Metallica ו-Slayer, הטריטון מייצר חוסר-יציבות קיצונית שלא נפתרת. Drop Tunings (Drop D, Drop C, Drop B) מאפשרים פאוור קורדים בבאר אחת על מיתר עבה — הם גם מנמיכים את ה-range ומוסיפים "weight". ה-Palm Mute (כיבוי חלקי של מיתרים בכף היד) יוצר את ה-"chug" — הדופק הקצבי שמגדיר ריפים מטאליים.',
      'Sweep Picking הוא טכניקת פיקינג שבה הפיק "מטאטא" דרך מיתרים רצופים בתנועה אחת. זה מה שמאפשר ל-Arpeggio לרוץ על 5-6 מיתרים במהירות אדירה — הסאונד של Yngwie Malmsteen ו-Dimebag Darrell. Economy Picking, Alternate Picking בטמפו גבוה, ו-Tapping (Eddie Van Halen → Steve Vai → Paul Gilbert) — אלה הטכניקות שהפכו את הסולו המטאלי לשדה הניתוח הטכני. ולא לשכוח: ה-Pinch Harmonic (הארמוניק שנוצר עם הבוהן על המיתר אחרי הפיק) — הצריחה שמזוהה עם Zakk Wylde.',
      'המטאל לקח השראה ישירה ממוזיקה קלאסית — במיוחד מ-Bach, Paganini ו-Beethoven. Metallica, Megadeth ו-Iron Maiden השתמשו ב-Counterpoint (קונטרפונקט — שני קולות עצמאיים שרצים בו-זמנית). Harmonized Guitar (שתי גיטרות בהרמוניה, לרוב בטרצות מינוריות או מז׳וריות) הוא ה-DNA של ה-Twin Lead שפיתחו Thin Lizzy ו-Iron Maiden. מבחינה מוזיקלית, מטאל טוב הוא מוזיקה קלאסית עם גיטרה מועווה.',
    ],
    paragraphsEn: [
      'Metal is built on two primary scales: the harmonic minor and the Phrygian. The harmonic minor (1, 2, b3, 4, 5, b6, 7) contains the iconic augmented second interval between the b6 and the major 7th — a step and a half that sounds "Eastern" and dark. This is what you hear in Dio, Iron Maiden, and Judas Priest. The Phrygian mode (1, b2, b3, 4, 5, b6, b7) delivers the "dark Spanish" color — the b2 is the most dissonant note against the tonic, immediately creating a menacing feel. Slayer, Pantera, Sepultura — all live in Phrygian.',
      'The tritone (b5/augmented 4th) — the Diabolus in Musica, banned in medieval church music — is the harmonic "signature" of metal. From Black Sabbath (the opening riff of "Black Sabbath" built on a tritone) to Metallica and Slayer, the tritone creates extreme instability that refuses to resolve. Drop tunings (Drop D, Drop C, Drop B) allow power chords in a single finger bar on a thick string — they also lower the range and add "weight." Palm muting (partially silencing strings with the heel of the picking hand) creates the "chug" — the rhythmic pulse that defines metal riffs.',
      'Sweep picking is a picking technique where the pick "sweeps" across consecutive strings in a single motion. This allows arpeggios to run across 5-6 strings at tremendous speed — the sound of Yngwie Malmsteen and Dimebag Darrell. Economy picking, high-tempo alternate picking, and tapping (Eddie Van Halen → Steve Vai → Paul Gilbert) are the techniques that turned the metal solo into a field of technical study. And never forget: the pinch harmonic (a harmonic produced by touching the thumb to the string just after the pick attack) — the squeal associated with Zakk Wylde.',
      'Metal drew direct inspiration from classical music — especially Bach, Paganini, and Beethoven. Metallica, Megadeth, and Iron Maiden used counterpoint (two independent melodic voices running simultaneously). Harmonized guitar (two guitars in harmony, typically in minor or major thirds) is the DNA of the twin lead guitar sound pioneered by Thin Lizzy and Iron Maiden. Musically, great metal is classical music on a distorted guitar.',
    ],
  },

  folk: {
    id: 'folk',
    titleHe: 'פולק',

    titleEn: 'Folk',
    emojiIcon: '🪕',
    colorHex: '#2a4a1a',
    hookHe: 'פולק הוא המוזיקה של האנשים — סיפור שמגיע מהאדמה.',
    hookEn: 'Folk is the music of the people — a story rising from the earth.',
    paragraphsHe: [
      'הפולק השתמש תמיד בסולמות מודליים — עוד לפני שהמינור והמז׳ור שלטו במוזיקה המערבית. הדוריאן (1, 2, b3, 4, 5, 6, b7) הוא ה"סולם העתיק" שמשמש בפולק קלטי ואירי: הוא מינור אבל עם Major 6th שנותן טעם "מיוחד" שאי אפשר לבלבל עם מינור רגיל. "Scarborough Fair" הוא דוגמה קלאסית. המיקסולידי (מז׳ור עם b7) נפוץ בפולק אמריקאי ובלוגראס — נותן את התחושה של "כמעט מז׳ור אבל עם משהו פתוח". Drone Notes (תווים שנשמרים ממושכות) הם עיקרון בסיסי — חיקוי של כלי-נגינה עתיקים כמו בגפייפ.',
      'כיוון DADGAD הוא אחת הדרכים הכי מעניינות לנגן פולק. בכיוון זה (D-A-D-G-A-D מ-6 ל-1), כל המיתרים הפתוחים יחד נשמעים כמו אקורד Dsus4 — לא מז׳ור, לא מינור, אלא "מרחפים". זה מאפשר Drone Bass על מיתרי הבס בזמן שהמלודיה משוחקת בחלק הגבוה. Davey Graham ו-Bert Jansch פיתחו את הסגנון הזה בשנות ה-60, ו-Jimmy Page שאל ממנו ב-"Kashmir".',
      'Travis Picking הוא טכניקת ניגון מורכבת שבה האגודל מנגן ביט בס סדיר (לסירוגין בין שני מיתרי בס) בזמן שהאצבעות מנגנות מלודיה. התוצאה היא שהגיטרה נשמעת כאילו שני נגנים מנגנים — Chet Atkins פיתח את זה לשלמות בקאנטרי, אבל הפולק ירש ממנו. Fingerstyle בכלל מאפשר טקסטורה עשירה בלי פיק — ניתן להנגין בס, הרמוניה ומלודיה בו-זמנית. זה הסאונד של Simon & Garfunkel, James Taylor, Nick Drake.',
      'הפולק הוא לפני הכל עניין של סיפור. Storytelling שמחייב חזרות (Verses וChorus), Modality שיוצרת מרחב, ואינטימיות — כלי נגינה אקוסטי בלבד, בלי הגברה. ה-Open Chords בפולק מנצלים את ה-Resonance של המיתרים הפתוחים כדי לייצר גוון מלא ועשיר. Capo מאפשר לשנות טוניקה ולהישאר ב-Open Chord Shapes. הפולק לימד אותנו שמוזיקה לא צריכה להיות מסובכת כדי להיות עמוקה.',
    ],
    paragraphsEn: [
      'Folk has always used modal scales — long before major and minor dominated Western music. Dorian (1, 2, b3, 4, 5, 6, b7) is the "ancient scale" used in Celtic and Irish folk: it is minor but with a major 6th that gives a distinctive flavor impossible to confuse with regular minor. "Scarborough Fair" is a classic example. Mixolydian (major with b7) is common in American folk and bluegrass — it sounds like "almost major but with something unresolved." Drone notes (tones sustained beneath a melody) are a foundational principle — mimicking ancient instruments like the bagpipe.',
      'DADGAD tuning is one of the most interesting ways to approach folk guitar. In this tuning (D-A-D-G-A-D from string 6 to 1), all open strings together sound like a Dsus4 chord — not major, not minor, but "hovering." This allows a drone bass on the bass strings while the melody plays higher up. Davey Graham and Bert Jansch developed this style in the 1960s, and Jimmy Page borrowed from it for "Kashmir."',
      'Travis picking is a complex fingerpicking technique where the thumb plays a steady alternating bass (alternating between two bass strings) while the fingers play the melody. The result is that the guitar sounds like two players — Chet Atkins perfected this in country, but folk inherited it. Fingerstyle in general allows a rich texture without a pick — bass, harmony, and melody can all be played simultaneously. This is the sound of Simon and Garfunkel, James Taylor, and Nick Drake.',
      'Folk is above all a storytelling art. Storytelling demands repetition (verses and chorus), modality creates space, and intimacy — acoustic instrument only, no amplification. Open chords in folk exploit the resonance of open strings to produce a full, rich tone. A capo lets you change the tonic while staying with open chord shapes. Folk taught us that music does not need to be complicated to be profound.',
    ],
  },

  funk: {
    id: 'funk',
    titleHe: 'פאנק',
    titleEn: 'Funk',
    emojiIcon: '🕺',
    colorHex: '#4a1a7a',
    hookHe: 'פאנק הוא לא מה שאתה מנגן — זה הרגע הבין-התווים שאתה לא מנגן.',
    hookEn: 'Funk is not what you play — it is the space between the notes you do not play.',
    paragraphsHe: [
      'הסולם של הפאנק הוא הדוריאן — ה"סולם הפאנק". D Dorian (D-E-F-G-A-B-C) שמשמש על אקורד Dm7 הוא בסיס עצום לג׳אמים פאנקיים. ה-Major 6th של הדוריאן (ה-B) יוצר מתח עדין על רקע ה-b7 — זה נשמע "גדול ואפל" בו-זמנית. James Brown, Sly Stone ו-Parliament-Funkadelic בנו עליו כל קריירה. Mixolydian גם שכיח — על אקורד דומיננט 7 (E7, G7), שנותן את ה"ריצה" ה-Funky.',
      'אקורד ה-Dominant 9th הוא ה-Funk Chord בהגדרה: שורש, 3rd, 5th, b7, 9th. E9 (E-G#-B-D-F#) נשמע מלא, מסוגנן ו"groovy". ה-7#9 — "אקורד ה-Hendrix" — הוא הכי אייקוני: E7#9 (E-G#-B-D-G) כולל גם 3rd מז׳ורי (G#) וגם 3rd מינורי (G מוגבה), מה שיוצר פוליהרמוניה עוצמתית. הצליל הכי בולט ב-"Purple Haze". הפאנק לא מפחד מהרמוניה מורכבת — הוא מחפש טעם חריף.',
      'הקצב הוא המלך בפאנק. ה-16th-Note Strumming (ניגון ב-16 תנועות לטקט — שתי "שמיניות" לכל בייט) הוא הבסיס הקצבי. אבל הסוד הגדול: רוב ה-16 הוא שתיקה. Ghost Notes (תווים "רוחניים") הם תנועות ידניות שרק נוגעות במיתרים מחסומים — נשמעות כמו "tch" קצבי. הם ממלאים את החלל בין ה-notes האמיתיים. James Brown אמר: "ה-ONE" — כל הדגש הוא על זמן 1 של כל טקט, וכל שאר הקצב "מתכונן" אליו.',
      'Wah-Wah הוא אפקט הפאנק הגדול: דוושה שמזיזה נקודת תהודה בין 350-2000Hz. כשמנגנים עם Wah פתוח-סגור לפי הקצב, הגיטרה "מדברת". Jimi Hendrix, Frank Zappa, ולאחר מכן Nile Rodgers (Chic) ו-Prince — כולם הפכו את ה-Wah לכלי הבעה. Nile Rodgers פיתח את ה-"Chucking" — ניגון קצר ונחתך של אקורדים מהוסטים בקצב, Staccato לחלוטין. העיקרון: ה-Rhythm Guitar בפאנק היא כלי קצב, לא הרמוני.',
    ],
    paragraphsEn: [
      'The scale of funk is the Dorian mode — the "funk scale." D Dorian (D-E-F-G-A-B-C) used over a Dm7 chord is an enormous basis for funky jams. The major 6th of Dorian (B in D Dorian) creates a subtle brightness against the b7 — it sounds both "big and dark" simultaneously. James Brown, Sly Stone, and Parliament-Funkadelic built entire careers on it. Mixolydian is also common — over a dominant 7th chord (E7, G7), giving the funky "run" feeling.',
      'The dominant 9th chord is the Funk Chord by definition: root, 3rd, 5th, b7, 9th. E9 (E-G#-B-D-F#) sounds full, stylish and groovy. The 7#9 — the "Hendrix chord" — is the most iconic: E7#9 (E-G#-B-D-G) contains both a major 3rd (G#) and an augmented minor 3rd (Gnatural), creating a powerful polyharmony. The most prominent sound in "Purple Haze." Funk is not afraid of complex harmony — it seeks a sharp, biting taste.',
      'Rhythm is king in funk. 16th-note strumming (playing with 16 hand movements per bar — two "eighths" per beat) is the rhythmic foundation. But the great secret: most of those 16th notes are silence. Ghost notes are hand movements that only touch muted strings — they sound like a rhythmic "tch." They fill the space between real notes. James Brown said: "The ONE" — all emphasis is on beat 1 of every bar, and the rest of the rhythm "prepares" for it.',
      'Wah-wah is the great funk effect: a pedal that sweeps a resonant frequency between 350 and 2000Hz. When played open-close in time with the rhythm, the guitar "talks." Jimi Hendrix, Frank Zappa, and later Nile Rodgers (Chic) and Prince all turned the wah into an expressive instrument. Nile Rodgers developed "chucking" — short, clipped strumming of muted chord shapes in rhythm, completely staccato. The principle: the rhythm guitar in funk is a percussion instrument, not a harmonic one.',
    ],
  },
}
