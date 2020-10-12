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
        
        
const todaysDate = () => {
  const today = new Date();
  return Utilities.formatDate(today, 'Australia/Sydney', 'yyyy-MM-dd');
};