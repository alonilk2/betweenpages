import { PullQuote, Note } from '../../../components';

export default function TypographyShowcase() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-ink mb-8">
          טיפוגרפיה ורכיבי MDX
        </h1>

        <div className="prose prose-lg font-reading">
          <p className="text-xl text-ink-light mb-12 leading-relaxed">
            דף זה מציג את רכיבי הטיפוגרפיה והMDX שיעמדו לרשות הכותבים באתר
            &ldquo;בין הדפים&rdquo;. הרכיבים מותאמים לקריאה ארוכה וחוויית משתמש
            מיטבית בעברית.
          </p>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
            כותרות וטקסט
          </h2>

          <h1 className="mb-4">כותרת H1 - הכותרת הראשית של העמוד</h1>
          <h2 className="mb-4">כותרת H2 - כותרות פרקים עיקריים</h2>
          <h3 className="mb-4">כותרת H3 - כותרות תתי פרקים</h3>
          <h4 className="mb-4">כותרת H4 - כותרות סעיפים</h4>

          <p>
            זהו פסקה רגילה המדגימה את הטיפוגרפיה הבסיסית לקריאה. הפונט Cardo
            נבחר במיוחד להיכולת הקריאה הטובה שלו בעברית, הניגודיות הגבוהה
            והנוחות בטקסטים ארוכים. הרווח בין השורות מותאם ל-1.7 לחוויית קריאה
            אידיאלית.
          </p>

          <p>
            <strong>טקסט מודגש</strong> משמש להדגשות חשובות, בעוד{' '}
            <em>טקסט נטוי</em> משמש להדגשות עדינות יותר. <a href="#">קישורים</a>{' '}
            מעוצבים בצבע הקורל המזמין מהלוגו.
          </p>

          <blockquote className="bg-sepia border-r-4 border-primary p-6 rounded-lg my-8">
            <p className="mb-4">
              זהו ציטוט רגיל המשתמש ב-blockquote הסטנדרטי. הוא מעוצב ברקע קרמי
              עדין עם קו קורל מימין להדגשה.
            </p>
            <footer className="text-ink-light">— מחבר הדוגמה</footer>
          </blockquote>

          <PullQuote author="עמוס עוז" source="סיפור על אהבה וחושך">
            כל סיפור הוא סיפור אהבה, וכל סיפור אהבה הוא בסופו של דבר סיפור על
            אובדן.
          </PullQuote>

          <p>
            רכיב ה-PullQuote למעלה מיועד לציטוטים חשובים מתוך הספרים או מדברי
            המחברים. הוא בולט יותר מציטוט רגיל וכולל אפשרות לציון מחבר ומקור.
          </p>

          <Note title="טיפ לקוראים">
            רכיב ההערה הזה מיועד למידע נוסף, טיפים או הסברים שמשלימים את הטקסט
            העיקרי מבלי להפריע לזרימת הקריאה.
          </Note>

          <Note type="info" title="מידע שימושי">
            הערה מסוג &ldquo;info&rdquo; מתאימה למידע עובדתי או הקשרי שקשור
            לנושא הנדון.
          </Note>

          <Note type="warning" title="שימו לב">
            הערת אזהרה או התראה למידע חשוב שצריך תשומת לב מיוחדת.
          </Note>

          <Note type="tip" title="המלצה">
            הערת טיפ או המלצה לקוראים המעוניינים להעמיק בנושא.
          </Note>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
            רשימות ומבנה
          </h2>

          <h3>רשימה לא ממוספרת:</h3>
          <ul className="mb-6">
            <li>פריט ראשון ברשימה</li>
            <li>
              פריט שני עם <strong>הדגשה</strong>
            </li>
            <li>
              פריט שלישי עם <a href="#">קישור</a>
            </li>
            <li>
              פריט רביעי ארוך יותר המדגים איך הטקסט עוטף לשורה הבאה ונראה עדיין
              טוב ומסודר
            </li>
          </ul>

          <h3>רשימה ממוספרת:</h3>
          <ol className="mb-6">
            <li>שלב ראשון בתהליך</li>
            <li>שלב שני עם פירוט נוסף</li>
            <li>שלב שלישי והאחרון</li>
          </ol>

          <h2 className="text-3xl font-bold text-ink mt-12 mb-6">מדדי איכות</h2>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-sepia p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-sage-700">נגישות</h3>
              <ul className="space-y-2 text-sm">
                <li>• יחס ניגודיות ≥ 4.5:1</li>
                <li>• תמיכה בקוראי מסך</li>
                <li>• ניווט במקלדת</li>
                <li>• טקסט ברור וקריא</li>
              </ul>
            </div>

            <div className="bg-sepia p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-sage-700">ביצועים</h3>
              <ul className="space-y-2 text-sm">
                <li>• טעינת פונטים אופטימלית</li>
                <li>• CSS משוכפל למינימום</li>
                <li>• תמיכה במכשירים שונים</li>
                <li>• זמני טעינה מהירים</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-coral-50 to-lavender-50 rounded-lg border border-coral-200">
            <h3 className="text-xl font-bold mb-4 text-sage-700">
              עיצוב מבוסס לוגו
            </h3>
            <p className="leading-relaxed">
              כל הצבעים והרכיבים הטיפוגרפיים נגזרו מהלוגו המקורי של &ldquo;בין
              הדפים&rdquo;. הקורל החם, הלבנדר העדין והחכם הרגוע יוצרים פלטה
              הרמונית המשדרת חמימות ספרותית ומזמינה לקריאה.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
