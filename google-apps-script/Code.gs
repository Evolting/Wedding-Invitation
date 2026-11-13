/**
 * Google Apps Script Web App — nhận RSVP từ Vercel Function, ghi vào Sheet.
 *
 * CÀI ĐẶT:
 * 1. Mở Google Sheet riêng tư, tạo sheet tên "RSVP".
 * 2. Extensions > Apps Script, dán file này.
 * 3. Đặt SHARED_SECRET khớp với APPS_SCRIPT_SHARED_SECRET bên Vercel.
 * 4. Deploy > New deployment > type Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy URL /exec -> đặt làm APPS_SCRIPT_WEB_APP_URL bên Vercel.
 *
 * Bảo mật: "Anyone" là bắt buộc để server Vercel gọi được, nhưng mỗi request
 * phải kèm đúng SHARED_SECRET mới được ghi.
 */

var SHARED_SECRET = 'DAN_CHUOI_BI_MAT_O_DAY'; // phải khớp bên Vercel
var SHEET_NAME = 'RSVP';
var TZ = 'Asia/Ho_Chi_Minh';
var MAX_GUESTS = 10;

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return json({ success: false });
    }

    var fullName = sanitize(trimStr(body.fullName, 100));
    var attendance = body.attendance === 'yes' ? 'yes' : (body.attendance === 'no' ? 'no' : '');
    var message = sanitize(trimStr(body.message, 500));
    var submissionId = trimStr(body.submissionId, 64);

    var guestCount = 0;
    if (attendance === 'yes') {
      guestCount = Math.floor(Number(body.guestCount));
      if (!(guestCount >= 1 && guestCount <= MAX_GUESTS)) return json({ success: false });
    }

    if (!fullName || !attendance || !submissionId) return json({ success: false });

    // Khóa để tránh race condition khi 2 request vào cùng lúc.
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);

      // Chống ghi trùng theo submissionId (cột F).
      if (submissionId && isDuplicate(sheet, submissionId)) {
        return json({ success: true }); // đã ghi trước đó -> coi như thành công
      }

      var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
      sheet.appendRow([now, fullName, attendance, guestCount, message, submissionId]);
    } finally {
      lock.releaseLock();
    }

    return json({ success: true });
  } catch (err) {
    return json({ success: false });
  }
}

function isDuplicate(sheet, submissionId) {
  var last = sheet.getLastRow();
  if (last < 1) return false;
  var ids = sheet.getRange(1, 6, last, 1).getValues(); // cột F
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === submissionId) return true;
  }
  return false;
}

function trimStr(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

// Chống formula injection: giá trị mở đầu bằng = + - @ thì thêm dấu ' phía trước.
function sanitize(v) {
  if (v && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
