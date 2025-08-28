# "בין הדפים" — מסמך Technical Documentation (Front‑End Only, Next.js)

> גרסה: 1.0 • תאריך: 21 באוגוסט 2025  
> מחבר: צוות מוצר ופיתוח

---

## 1) תקציר מנהלים (Executive Summary)

**"בין הדפים"** הוא אתר תכנים לחובבי ספרים ולסופרים, המבוסס על Front‑End בלבד עם Next.js (App Router). מטרתו לספק חוויית גלישה מהירה, נגישה ומודרנית, עם נגיעות קלאסיות—המלצות קריאה, ביקורות, רשימות קריאה נושאיות ומאמרים על סוגות שונות של סיפורת.  
המערכת תיבנה ללא שרת ייעודי או בסיס נתונים: התכנים יישמרו כ‑MDX/Markdown ו/או JSON בגיט, ייקראו בזמן Build (SSG) ויטענו בצד‑לקוח לחיפוש וסינון. אפשרות לשדרוג עתידי ל‑ISR/Headless CMS נשמרת בתכנון.

**יעדים עיקריים**

- חוויית קריאה ממוקדת ואלגנטית, נטולת הסחות.
- SEO גבוה (Schema.org + Open Graph), מהירות טעינה מעולה (CWV).
- תהליך הפקה פשוט לתוכן: כתיבה ב‑MDX עם רכיבי React ייעודיים.
- חיפוש לקוח (Client‑Side) מהיר + פילטרים לפי סוגה/מחבר/תגיות.
- עיצוב מודרני‑נקי עם נגיעה קלאסית המתבססת על פלטת צבעי הלוגו.

---

## 2) חזון ויעדים

- **קהילה של קוראים וסופרים**: תוכן איכותי, קביעות פרסומים, שיח סביב ספרים.
- **אמינות ואוצרות**: המלצות ערוכות‑ידנית + ביקורות מעמיקות.
- **התפתחות הדרגתית**: MVP Front‑End בלבד, הרחבות בהמשך (תגובות, פרופילים, CMS).

**KPI ראשיים**

- זמן טעינה ל‑LCP: ≤ 2.5s בדסקטופ/≤ 3.0s במובייל.
- CLS ≤ 0.1, INP ≤ 200ms.
- זמן עד תוצאה ראשונה בחיפוש: ≤ 150ms (מדד לקוח).

---

## 3) קהל יעד ופרסונות

1. **קוראת/קורא פעילים** (20–55): מחפשים המלצות קצרות וברורות, רשימות קריאה, ניווט קל לפי סוגות.
2. **סופרת/סופר**: מעוניינים בחשיפה, קריאת ביקורות איכותיות, אפשרות להבלטה במדורים.
3. **מבקר/ת ספרות**: יצירת תוכן ביקורתי שיטתי עם כלים טיפוגרפיים נוחים.

צרכים משותפים: מהירות, קריאות גבוהה (טיפוגרפיה), ניווט אינטואיטיבי, נגישות מלאה, שמירת רשימות אישיות (בעתיד).

---

## 4) היקף (Scope)

### במסגרת ה‑MVP

- עמוד בית עם **המלצות נבחרות**, כותרות אחרונות ובאנר/קטגוריות מובילות.
- עמודי **ספר** (`/books/[slug]`) עם מידע, תקציר, ציטוטים, תגים ורשימות קשורות.
- עמודי **מחבר** (`/authors/[slug]`) עם ביוגרפיה ורשימת ספרים קשורים.
- עמודי **סוגה/תג** (`/genres/[slug]`, `/tag/[slug]`) עם איסוף חכם של תוכן.
- עמודי **ביקורת** ו**מאמר** (MDX) עם טיפוגרפיה איכותית ופירורי לחם.
- **חיפוש לקוח** עם אוטו‑השלמה וסינונים (סוגה/שנה/מחבר/תג).
- עמוד **אודות** ועמוד **צור קשר** (שליחת מייל פתיחת לקוח מקומי).
- SEO & Sharing (Open Graph, Twitter Cards), מפת אתר ו‑robots.txt.
- **תהליך כתיבה/Build**: מחזור עבודה ברור לכותבים, בדיקות תוכן אוטומטיות.

### מחוץ להיקף ה‑MVP (ל‑vNext)

- חשבונות משתמש, שמירת מועדפים, תגובות.
- Headless CMS (למשל Contentful/Sanity) + ISR.
- מנוע המלצות חכם (למידה/אלגוריתמים מתקדמים).
- רספונסיביות מתקדמת לטאבלטים עם Layoutים ייעודיים (Beyond MVP).

---

## 5) חוויית משתמש (UX) וזרימות מפתח

### ניווט ראשי

- בית • ספרים • מחברים • סוגות • ביקורות • רשימות • חיפוש • אודות
- Header דביק, חיפוש זמין תמיד, Breadcrumbs פנימי בעמודי תוכן.

### דפי תוכן

- **ספר**: עטיפה, שם, מחבר, תאריך פרסום, הוצאה, סוגה, תגים, תקציר, ציטוטים, “דומים/מומלצים”.
- **מחבר**: פורטרט, ביוגרפיה קצרה, ספרים בינארכיה כרונולוגית/פופולרית.
- **ביקורת**: כותרת, תקציר Meta, גוף MDX, ציון (אופציונלי), קישורים לספר/מחבר.

### חיפוש וסינון

- תיבת חיפוש עם אוטו‑השלמה; תוצאות חיות; פילטרים דביקים (סוגה/תגים/מחבר).
- Zero‑State ידידותי (הצעות פופולריות), Empty‑State עם כיווני חיפוש אלטרנטיביים.

---

## 6) עיצוב ומיתוג

- **סגנון**: מודרני ונקי עם נגיעות קלאסיות (מסגרות דקיקות, ראשי‑פרקים סריפיים).
- **טיפוגרפיה**: UI — Inter/Assistant; טקסט ארוך — Merriweather/Cardo (סריפי).
- **פלטת צבעים**: ניגזרת מצבעי הלוגו (לא מסופקים בקובץ זה). נגדיר משתני CSS:
  ```css
  :root {
    --brand-50:  ;
    --brand-100: ;
    --brand-500: ;
    --brand-700: ;
    --ink: #0f172a; /* טקסט ראשי */
    --paper: #ffffff; /* רקע */
    --sepia: #f6f1e9; /* רקע קריאה רך */
    --accent: var(--brand-500);
  }
  ```
- **Dark Mode**: באמצעות `prefers-color-scheme`, הדגשת טקסט גבוהה, קונטרסט AA.

**הנחיית מיתוג**: חילוץ פלטה מהלוגו (למשל עם ColorThief/SVG), הגדרת scales, ושמירה על יחס ניגודיות ≥ AA.

---

## 7) ארכיטקטורה (Front‑End Only)

- **Framework**: Next.js (App Router).
- **Render Strategy**: SSG מלא מן הריפו (MDX/JSON).
  - חיפוש/סינון: Client‑Side (אינדקס JSON/NDJSON דחוס).
  - הפניות (Redirects) ו‑Rewrites: בקובץ `next.config.js` בלבד.
- **תוכן**:
  - **MDX** לביקורות/מאמרים/רשימות.
  - **YAML/JSON** לישויות ספר/מחבר/סוגה (Data Layer סטטי).
  - **Contentlayer** (אופציונלי) לבנייה טיפוסית והפקת Types אוטומטית.
- **מדיה**: Next/Image, תמונות ב‑WebP/AVIF, ספרייט לאייקונים.
- **State Management**: דק — React Server Components + Client hooks מקומיים.
- **חיפוש**: Fuse.js לקליינט (פאזי), אינדקס נבנה בזמן Build.
- **אנליטיקה**: Plausible/GA4 דרך טקסט‑טאג בלבד (ללא עיבוד שרת).
- **אבטחה/תאימות**: CSP מחמיר, Subresource Integrity ל‑CDN, תלותים נעולות.

**מבנה ספריה מוצע**

```
/app
  /(site)/
    page.tsx
    layout.tsx
    books/[slug]/page.tsx
    authors/[slug]/page.tsx
    genres/[slug]/page.tsx
    reviews/[slug]/page.tsx
    lists/[slug]/page.tsx
    search/page.tsx
  /(static)/about/page.tsx
  sitemap.ts
  robots.ts
/content
  /books/*.json        # ישויות ספר
  /authors/*.json
  /genres/*.json
  /tags.json
  /reviews/*.mdx
  /articles/*.mdx
  /lists/*.mdx
/public
  /images/covers/
/lib
  content.ts           # טענת תוכן/אינדקסים
  search.ts            # Fuse.js wrapper
  seo.ts               # Meta/Schema
/components
  ui/*                 # כפתורים, כרטיסים, טיפוגרפיה
  blocks/*             # בלוקים ל‑MDX (ציטוטים, קופסאות)
/styles
  globals.css
```

---

## 8) מודל נתונים (סטטי)

### Book (`/content/books/*.json`)

```json
{
  "slug": "the-great-book",
  "title": "The Great Book",
  "subtitle": "A Journey",
  "authors": ["author-jdoe"],
  "publisher": "Example House",
  "publishedYear": 2019,
  "genres": ["literary-fiction"],
  "tags": ["אהבה", "מסע"],
  "isbn": "978-…",
  "cover": "/images/covers/the-great-book.jpg",
  "summary": "תקציר קצר…",
  "quotes": ["ציטוט בולט…"],
  "related": ["another-book-slug"]
}
```

### Author (`/content/authors/*.json`)

```json
{
  "slug": "author-jdoe",
  "name": "Jane Doe",
  "bio": "ביוגרפיה קצרה…",
  "photo": "/images/authors/jdoe.jpg",
  "links": { "site": "https://…" },
  "books": ["the-great-book"]
}
```

### Review / Article / List (MDX Frontmatter)

```md
---
slug: 'review-the-great-book'
title: 'ביקורת: הספר הגדול'
date: '2025-08-01'
excerpt: 'למה הספר מרגש וחשוב…'
tags: ['ביקורת', 'ספרות-מקור']
book: 'the-great-book' # אופציונלי
authorRef: 'author-jdoe' # אופציונלי
cover: '/images/covers/the-great-book.jpg'
---
```

---

## 9) SEO ו‑Schema

- **Meta Tags** לכל עמוד + OG/Twitter.
- **Structured Data (JSON‑LD)**: `Book`, `Review`, `Article`, `BreadcrumbList`.
- **Sitemap** דינמי בזמן Build; `robots.txt` עם כללי זחילה.
- כתובות SEO‑Friendly, סלאג בעברית מותר אך מומלץ ASCII עם `slugify`.

**דוגמת Schema — Review**

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": { "@type": "Book", "name": "The Great Book" },
  "author": { "@type": "Person", "name": "שם הכותב/ת" },
  "datePublished": "2025-08-01",
  "reviewBody": "…",
  "inLanguage": "he",
  "publisher": { "@type": "Organization", "name": "בין הדפים" }
}
```

---

## 10) ביצועים (Performance) ו‑CWV

- **Performance Budget**: ג'אווהסקריפט ≤ 160KB gzip ב‑MVP; תמונות ל‑LCP ≤ 120KB.
- **טכניקות**: RSC להפחתת JS ללקוח, טעינה דחויה (lazy), prefetch חכם, `next/font`.
- **תמונות**: responsive + placeholders (blur), פורמטים AVIF/WebP.
- **בדיקות**: Lighthouse CI ב‑PR, WebPageTest פרידיקטיבי, Bundle Analyzer.

---

## 11) נגישות (A11y)

- יעד WCAG 2.2 AA: יחס ניגודיות, פוקוס גלוי, מקלדת מלאה, ARIA תקין.
- Skip links, כותרות היררכיות, alt לכל תמונה, שפה (`lang="he"`), RTL תקין.
- בדיקות: axe‑core אינטגרציה, Playwright‑a11y smoke.

---

## 12) אנליטיקה ומדדים

- Plausible/GA4 באמצעות סקריפט קל; אירועים: חיפוש, קליקים על כותרים, Scroll Depth.
- איסוף פופולריות ל‑“טרנדיים” בצד‑לקוח (Local Aggregation + Sampling).

---

## 13) חיפוש והמלצות

- **חיפוש**: Fuse.js עם אינדקס שנבנה בזמן Build (כותרת/מחבר/תגיות/תקציר).
- **המלצות (MVP)**:
  - _Editorial Picks_: שדה `featured=true` ב‑Frontmatter.
  - _Related_: התאמת סוגה/תגים/מחבר + cosine על embedding פשוט (אופציונלי, Client‑Side).
  - _Trending_: על בסיס קליקים/זמן‑דף (אנליטיקה קליינט; רשימה נשמרת מקומית/נבנית ב‑Build הבא).

---

## 14) איכות, אבטחה ותפעול

- **איכות קוד**: TypeScript Strict, ESLint, Prettier, Husky + lint‑staged.
- **בדיקות**: Vitest + React Testing Library; Playwright E2E למסלולי קריאה קריטיים.
- **אבטחה**: תלותים נעולות (`pnpm lockfile`), Dependabot, SRI, CSP, `X-Frame-Options`/`COEP`/`CORP` (במידת האפשר בקבצי סטטיק).
- **פרטיות וקוקיז**: ללא PII; באנר Cookie רק אם GA4/Tracking חודרני.

---

## 15) תהליך יצירת תוכן (Editorial Workflow)

1. הכותב יוצר קובץ **MDX**/JSON לפי תבנית.
2. PR עם CI: בדיקת סכמות, בניית אינדקס חיפוש, Lighthouse CI.
3. Review תוכן + עיצוב, Merge ל‑main → Build & Deploy.

**ולידציה אוטומטית**

- Zod/Yup לסכמות JSON + בדיקות Frontmatter.
- בדיקת קישורים שבורים (internal link checker) בזמן CI.

---

## 16) תשתיות, Build & Deploy (Frontend‑Only)

- **ניהול חבילות**: pnpm.
- **Build**: `next build` (SSG מלא).
- **Deploy**: Vercel/Netlify/Static Hosting.
- **Caching**: headers סטטיים לתמונות/פונטים; immutable assets עם hash.
- **ללא שרת**: אין DB, אין API פנימי. אינטגרציות עתידיות ישולבו כ‑Edge/ISR (vNext).

---

## 17) מפת דרכים

### MVP (שבועות 1–4)

- שלד פרויקט, Theme + טיפוגרפיה, סכמות תוכן, עמודי ליבה, חיפוש לקוח, SEO בסיסי, Lighthouse ≥ 90.

### vNext (5–10)

- רשימות חכמות, דפי מחבר מתקדמים, עורך תוכן נוח ב‑MDX (בלוקים), ניסוי המלצות קליינט.

### עתידי

- ISR + CMS, פרופילים/תגובות, שיתופי ציבור, המלצות מבוססות למידה.

---

## 18) סיכונים ותלותים

- גידול נפח אינדקס → לשמור על paginated index/שבירה לפי סוג.
- SEO לעברית/RTL → בדיקות ידניות כפולות.
- ללא CMS → חיכוך לכותבים לא‑טכניים (פתרון: Git‑based GUI בהמשך).

---

## 19) נספחים

### דוגמת Frontmatter ל‑ביקורת

```md
---
slug: 'review-book-slug'
title: 'ביקורת: שם הספר'
date: '2025-08-01'
excerpt: 'תקציר קצר…'
tags: ['ביקורת', 'סיפורת']
book: 'book-slug'
authorRef: 'author-slug'
cover: '/images/covers/book.jpg'
featured: true
---
```

### קומפוננטות MDX שימושיות

- `<PullQuote>` לציטוט מודגש, `<Note>` להערות צד, `<BookCard>` להצגת ספר.

### בדיקות Lighthouse (יעדים)

- Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## 20) רישיון ותודות

- קוד המקור MIT (אופציונלי). תמונות עטיפות — בהתאם לזכויות/מדיניות הוצאה.
- תודה לקהילת Next.js ולכותבות/כותבים על תרומתם התוכנית והעריכתית.
