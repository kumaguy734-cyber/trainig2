/**
 * CORE & RUN — トレーニング記録クラウド同期用 Google Apps Script
 * ================================================================
 * このファイルは GitHub Pages にはアップロードしません。
 * script.google.com 側に貼り付けて「ウェブアプリ」としてデプロイしてください。
 *
 * — セットアップ手順 —
 * 1. https://script.google.com/ を開き、「新しいプロジェクト」を作成
 * 2. デフォルトの Code.gs の中身をすべて削除し、このファイルの内容を貼り付ける
 * 3. 画面右上の「デプロイ」→「新しいデプロイ」をクリック
 *    - 種類の選択（歯車アイコン）で「ウェブアプリ」を選ぶ
 *    - 説明：任意（例：core-run-sync）
 *    - 次のユーザーとして実行：自分
 *    - アクセスできるユーザー：全員 ← ここを必ず「全員」にする
 *      （「自分のみ」のままだとブラウザからアクセスした時に
 *        Googleのログイン画面(HTML)が返り、
 *        「Unexpected token '<', "<!DOCTYPE "... is not valid JSON」
 *        というエラーの原因になります）
 * 4. 「デプロイ」をクリックし、初回は権限の承認（自分のGoogleアカウントで許可）を行う
 * 5. 発行された「ウェブアプリのURL」（.../exec で終わるもの）をコピーする
 *    ※ 似た形の「.../dev」で終わるURLは開発者本人しかアクセスできないので使わないこと
 * 6. そのURLを script.js の CLOUD_SYNC_URL に貼り付ける
 *
 * — コードを修正した場合 —
 * 「デプロイ」→「デプロイを管理」→ 編集(鉛筆アイコン)→ バージョン「新バージョン」を選んで
 * 再デプロイしないと、URLの中身が更新されません（これも同期エラーのよくある原因です）。
 *
 * データの保存先：
 * このスクリプト専用の新しいスプレッドシート「CoreRun History」が自動作成され、
 * その中の「History」シートに記録が1行ずつ保存されます。
 */

const SHEET_NAME = 'History';
const HEADERS = [
  'id', 'date', 'themeKey', 'themeTitle', 'themeEmoji',
  'levelTitle', 'durationLabel', 'totalExercises', 'exercisesDone',
  'estMinutes', 'actualMinutes', 'completed',
];

/** スプレッドシートとシートを取得（なければ自動作成） */
function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('SPREADSHEET_ID');
  let ss;

  if (ssId) {
    ss = SpreadsheetApp.openById(ssId);
  } else {
    ss = SpreadsheetApp.create('CoreRun History');
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** GET：保存されている全記録をJSON配列で返す */
function doGet(e) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || HEADERS;

  const records = values
    .filter((row) => row[0] !== '') // 空行を除外
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });

  return jsonOut_(records);
}

/** POST：1件の記録を受け取り、同じidがあれば上書き、なければ追加 */
function doPost(e) {
  try {
    const record = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();

    let rowIndex = -1; // 1始まりのシート上の行番号
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(record.id)) {
        rowIndex = i + 1;
        break;
      }
    }

    const row = HEADERS.map((h) => (record[h] !== undefined ? record[h] : ''));

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return jsonOut_({ status: 'ok' });
  } catch (err) {
    return jsonOut_({ status: 'error', message: String(err) });
  }
}
