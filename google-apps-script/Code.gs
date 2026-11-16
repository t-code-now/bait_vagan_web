/**
 * פעוטון בית וגן – קליטת פניות הרשמה לגיליון Google Sheets + מייל התראה
 *
 * הוראות התקנה (פעם אחת, כ-5 דקות):
 * 1. צרו גיליון חדש ב-Google Sheets (למשל "הרשמות בית וגן").
 * 2. בתפריט: הרחבות (Extensions) → Apps Script.
 * 3. מחקו את הקוד הקיים והדביקו את כל הקוד מהקובץ הזה. שמרו.
 * 4. (לא חובה) כתבו למטה ב-NOTIFY_EMAIL את המייל שאליו תישלח התראה על כל פנייה.
 * 5. לחצו "פריסה" (Deploy) → "פריסה חדשה" (New deployment) → סוג: "אפליקציית אינטרנט" (Web app)
 *      - Execute as: Me (אני)
 *      - Who has access: Anyone (כל אחד)
 *    לחצו Deploy ואשרו את ההרשאות.
 * 6. העתיקו את כתובת ה-Web app (מסתיימת ב-/exec) והדביקו אותה בקובץ js/config.js
 *    בשדה FORM_ENDPOINT.
 */

var NOTIFY_EMAIL = ''; // לדוגמה: 'ilana@example.com' – השאירו ריק אם לא צריך מייל

var FIELDS = [
  ['submittedAt', 'תאריך פנייה'],
  ['parentName', 'שם ההורה'],
  ['phone', 'טלפון'],
  ['email', 'אימייל'],
  ['childName', 'שם הילד/ה'],
  ['birthDate', 'תאריך לידה'],
  ['childAge', 'גיל'],
  ['group', 'קבוצה מבוקשת'],
  ['startDate', 'מועד כניסה'],
  ['notes', 'הערות'],
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(FIELDS.map(function (f) { return f[1]; }));
      sheet.setRightToLeft(true);
      sheet.getRange(1, 1, 1, FIELDS.length).setFontWeight('bold').setBackground('#ffe0ef');
      sheet.setFrozenRows(1);
    }
    var p = e.parameter || {};
    // prefix with ' so Sheets keeps leading zeros in phone numbers
    var row = FIELDS.map(function (f) { var v = p[f[0]] || ''; return f[0] === 'phone' ? "'" + v : v; });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      var body = FIELDS.map(function (f) { return f[1] + ': ' + (p[f[0]] || '-'); }).join('\n');
      MailApp.sendEmail(NOTIFY_EMAIL, 'פנייה חדשה להרשמה – ' + (p.childName || ''), body);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
