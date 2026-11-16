/*
 * ===== הגדרות האתר – פעוטון בית וגן =====
 *
 * לאן יישלחו פרטי ההרשמה מהטופס?
 *
 * FORM_ENDPOINT:
 *   - השאירו ריק ('')  → הטופס יפתח וואטסאפ עם כל הפרטים מוכנים לשליחה לאילנה.
 *   - כתובת Google Apps Script  → הפרטים יישמרו אוטומטית בגיליון Google Sheets
 *     (ואפשר גם לקבל מייל על כל פנייה). הוראות מלאות בקובץ README.md
 *     ובקובץ google-apps-script/Code.gs
 *   - כתובת Formspree (https://formspree.io/f/xxxx) → הפרטים יישלחו למייל.
 *
 * FORM_TYPE: 'google-sheets' או 'formspree'
 *
 * ALSO_OFFER_WHATSAPP: האם להציג אחרי שליחה מוצלחת גם כפתור "שליחה בוואטסאפ".
 */
window.SITE_CONFIG = {
  FORM_ENDPOINT: '',
  FORM_TYPE: 'google-sheets',
  WHATSAPP_NUMBER: '972522640423',
  ALSO_OFFER_WHATSAPP: true,
};
