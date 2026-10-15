/**
 * 두더지 게임 결과 저장 및 Top 10 랭킹 조회 Google Apps Script
 * 스프레드시트 ID: 1MfUyqmmcKHAFCsP_MbTV7qTPhWGTu3MRPRxazKaY9pM
 * 
 * [컬럼 구조]
 * A열 (timestamp): 날짜 시간 타입, 기록 일시
 * B열 (name): 문자열, 플레이어 닉네임
 * C열 (score): 정수, 최종점수
 * D열 (hits): 정수, 맞힌 두더지 수
 * E열 (accuracy): 백분율/실수, 명중률
 * F열 (max_combo): 정수, 최대 콤보수
 */

var SPREADSHEET_ID = "1MfUyqmmcKHAFCsP_MbTV7qTPhWGTu3MRPRxazKaY9pM";

function getTargetSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getActiveSheet();
}

// 1. 게임 정상 종료 시 결과 자동 저장 (doPost)
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 동시 저장 시 충돌 방지 락

  try {
    var sheet = getTargetSheet();
    var data = JSON.parse(e.postData.contents);

    // 컬럼 스펙에 맞춘 필드 바인딩
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
    var name = String(data.name || data.nickname || "익명");
    var score = Number(data.score) || 0;
    var hits = Number(data.hits) || 0;
    var accuracy = data.accuracy !== undefined ? String(data.accuracy).replace('%', '') + "%" : "0%";
    var max_combo = Number(data.max_combo !== undefined ? data.max_combo : data.maxCombo) || 0;

    // 시트 마지막 행에 데이터 기록
    sheet.appendRow([timestamp, name, score, hits, accuracy, max_combo]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "게임 결과가 성공적으로 저장되었습니다." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 2. 상위 10위 랭킹 조회 (doGet)
function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var rows = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, rankings: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var dataRows = rows.slice(1); // 1행(헤더) 제외
    var list = dataRows.map(function(row) {
      return {
        timestamp: String(row[0]),
        nickname: String(row[1]),
        name: String(row[1]),
        score: Number(row[2]) || 0,
        hits: Number(row[3]) || 0,
        accuracy: String(row[4]),
        maxCombo: Number(row[5]) || 0
      };
    });

    // 점수 내림차순 정렬 후 상위 10개 추출
    list.sort(function(a, b) {
      return b.score - a.score;
    });

    var top10 = list.slice(0, 10).map(function(item, index) {
      item.rank = index + 1;
      return item;
    });

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rankings: top10 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
