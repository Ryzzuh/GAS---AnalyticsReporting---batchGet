/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let POST_fbPostBack = (fbclid) => {
  // example {{user_data.fbc}} fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890 example
  const fbPostData = JSON.stringify(
    DATA_fbPostBackOptions(
      'IwAR0JeWk6zYY_-kzPJl982VnBwE8FKkGvdlNaIqXyLAgU3Iea7WMsn3Zz4z4'
    )
  );
  // change this!!!!
  // const fbPostData = JSON.stringify(DATA_fbPostBackOptions(fbclid))
  // example {{url}} "https://graph.facebook.com/v7.0/1636358889940801/events?data=%5B%7B%22event_name%22%3A%22test_sf%22%2C%22event_time%22%3A1598510682%2C%22user_data%22%3A%7B%22fbc%22%3A%22fb.1.1596641005.IwAR0JeWk6zYY_-kzPJl982VnBwE8FKkGvdlNaIqXyLAgU3Iea7WMsn3Zz4z4%22%7D%2C%22custom_data%22%3A%7B%22content_name%22%3A%22enroled%22%7D%7D%5D&access_token=abc123"
  const url = `https://graph.facebook.com/v7.0/1636358889940801/events?data=${encodeURIComponent(
    fbPostData
  )}&access_token=${getAccessToken()}`; //&test_event_code=TEST1461`
  const response = UrlFetchApp.fetch(url, { method: 'post' });
  return response;
};

const main = () => {
  // cd is for "candidate"
  const cdSheet = SpreadsheetApp.getActive().getSheetByName(
    'combine_sf_ga.extract'
  );
  const cds = cdSheet
    .getRange(2, 1, cdSheet.getLastRow()-1, cdSheet.getLastColumn())
    .getValues();
  const cdsListDict = cds.map((x) => ({
    clientId: x[0],
    fbclid: x[1],
    status: x[2],
  }));

  cdsListDict.forEach((entry) => {
    if (entry.status != 'complete') {
      const pbResponse = POST_fbPostBack(entry.fbclid); // pbResponse.getAllHeaders())
      const pbResponseJson = JSON.parse(pbResponse);
      //  const fbTrace = GET_fbTrace(pbResponseJson.fbtrace_id)
      const pingLogSheet = SpreadsheetApp.getActive().getSheetByName(
        'ping_log'
      );
      pingLogSheet
        .getRange(pingLogSheet.getLastRow() + 1, 1, 1, 3)
        .setValues([[entry.fbclid, nowEpoch(), pbResponse]]);
    }
  });
};

let GET_fbTrace = (traceId) => {
  const url = `https://graph.facebook.com/v7.0/${traceId}&access_token=${getAccessToken()}`;
  const response = UrlFetchApp.fetch(url);
  //  Logger.log(response.geta);
  return response;
};

let GET_gaReportData = () => {
  const result = AnalyticsReporting.Reports.batchGet(DATA_reportMetaData());
  return result.reports[0].data.rows;
};

let PUT_gaReportData = () => {
  const dimensions = GET_gaReportData().map((r) => r.dimensions);
  SpreadsheetApp.getActive()
    .getSheetByName('GA_customDimension14')
    .clear()
    .getRange(1, 1, dimensions.length)
    .setValues(dimensions);
};

// ///////////////////////////////////////////
// ///////////////  META DATA ////////////////
// ///////////////////////////////////////////
let DATA_reportMetaData = () => ({
  reportRequests: [
    {
      viewId: '120267364',
      dateRanges: [
        {
          startDate: todaysDate(), // i.e. '2020-06-10', //should we use date from bigquery or SF?
          endDate: todaysDate(),
        },
      ],
      samplingLevel: 'DEFAULT',
      dimensions: [{ name: 'ga:dimension14' }],
      metrics: [
        {
          expression: 'ga:users',
          // "alias": string,
          formattingType: 'INTEGER',
        },
      ],
      // ,
      //  "pageToken": string,
      //  "pageSize": number,
      //  "includeEmptyRows": boolean,
      //  "hideTotals": boolean,
      //  "hideValueRanges": boolean
    },
  ],
  useResourceQuotas: true,
});

let DATA_fbPostBackOptions = (fbclid) => {
  const now = nowEpoch(); // e.g 1598511682 https://www.epochconverter.com/
  return [
    {
      event_name: 'test_sf',
      event_time: now, // could be the converion datetime from SF
      user_data: { fbc: `fb.1.${now}.${fbclid}` },
      custom_data: { content_name: 'enroled' },
    },
  ];
};

// /////////////////
// //// TESTS //////
// /////////////////
let TEST_ = () => {};

// ///////////////////////////////////////////
// ////////////// UTILITIES //////////////////
// ///////////////////////////////////////////
let todaysDate = () => {
  const today = new Date();
  return Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
};

let nowEpoch = () => {
  const today = new Date();
  // Logger.log(Math.floor( today / 1000 ))
  return Math.floor(today / 1000);
};