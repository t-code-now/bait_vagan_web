# פעוטון בית וגן – אתר

אתר תדמית והרשמה לפעוטון "בית וגן" בניהולה של אילנה מידני, הנביאים 4 מודיעין.

נבנה ב-HTML, CSS (Tailwind מקומפל מראש) ו-JavaScript בלבד, בלי שרת. לכן אפשר להעלות אותו כמו שהוא ל-GitHub Pages.

## מבנה הקבצים

```
index.html               ← העמוד הראשי (כל התוכן והטקסטים)
css/style.css            ← העיצוב המותאם (אנימציות, כרטיסים, טופס)
css/tailwind.css         ← Tailwind מקומפל (נוצר אוטומטית, לא לערוך ידנית)
js/config.js             ← הגדרות: לאן נשלחים פרטי ההרשמה
js/main.js               ← תפריט, גלריה, אנימציות, בדיקת הטופס ושליחה
assets/img/              ← לוגו, באנר ותמונות מהגן (נלקחו מהסרטון)
assets/video/tour.mp4    ← סרטון הסיור בגן (מכווץ)
google-apps-script/Code.gs ← קוד לשמירת הפניות בגיליון Google Sheets
```

## העלאה ל-GitHub Pages

1. ב-GitHub נכנסים לריפו, ואז **Settings → Pages**.
2. תחת **Build and deployment** בוחרים: Source = **Deploy from a branch**.
3. בוחרים את הענף (למשל `main`) ואת התיקייה `/ (root)` ולוחצים **Save**.
4. אחרי דקה או שתיים האתר זמין בכתובת `https://<שם-המשתמש>.github.io/bait_vagan_web/`.

הקובץ `.nojekyll` כבר נמצא בריפו, כך ש-GitHub מגיש את הקבצים כמו שהם.

## איסוף פרטי המתעניינים (טופס ההרשמה)

אפשר לבחור אחת משלוש אפשרויות. מגדירים אותה בקובץ `js/config.js`.

### אפשרות 1: וואטסאפ (ברירת המחדל, לא צריך להגדיר כלום)
כש-`FORM_ENDPOINT` ריק, שליחת הטופס פותחת וואטסאפ עם כל הפרטים מוכנים, וההורה רק לוחץ "שליחה" לאילנה.

### אפשרות 2 (מומלצת): Google Sheets, וגם מייל אם רוצים
כל פנייה נשמרת כשורה בגיליון, ואם רוצים נשלח גם מייל על כל פנייה.
1. יוצרים גיליון חדש ב-Google Sheets.
2. בתפריט בוחרים **הרחבות → Apps Script**, ומדביקים את התוכן של `google-apps-script/Code.gs`.
3. אם רוצים לקבל מייל על כל פנייה, ממלאים את `NOTIFY_EMAIL`.
4. בוחרים **פריסה → פריסה חדשה → אפליקציית אינטרנט**, עם Execute as: *Me* ו-Who has access: *Anyone*.
5. מעתיקים את הכתובת שמסתיימת ב-`/exec` ומדביקים אותה ב-`js/config.js`:
   ```js
   FORM_ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',
   FORM_TYPE: 'google-sheets',
   ```

### אפשרות 3: Formspree (שליחה למייל)
1. נרשמים ב-formspree.io ויוצרים טופס חדש.
2. מעתיקים את הכתובת שלו ומגדירים:
   ```js
   FORM_ENDPOINT: 'https://formspree.io/f/xxxxxx',
   FORM_TYPE: 'formspree',
   ```

## עריכת תוכן

- **טקסטים, שעות וקבוצות:** עורכים ישירות ב-`index.html`.
- **תמונה של אילנה:** שומרים את התמונה בשם `assets/img/ilana.jpg`, ואז ב-`index.html` מחפשים את `manager-img` ומחליפים את ה-`src`.
- **תמונות לגלריה:** מחליפים את הקבצים `assets/img/gallery-XX.jpg`.

### אם השתמשתם ב-class חדש של Tailwind
אחרי שינוי מחלקות Tailwind ב-HTML צריך לקמפל מחדש (נדרש Node.js):
```bash
npm install
npm run build
```

## בדיקה מקומית
```bash
python3 -m http.server 8000
```
ואז פותחים בדפדפן את http://localhost:8000
