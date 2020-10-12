/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const main = () => {
  // cd is for "candidate"
  const cdSheet = SpreadsheetApp.getActive().getSheetByName(
    'combine_sf_ga.extract'
  );
  const cds = cdSheet
    .getRange(2, 1, cdSheet.getLastRow()-1, cdSheet.getLastColumn())
    .getValues();
  const cdsListDict = cds.map((x) => ({
    timeCreated: x[0], // epoch time
    fbclid: x[1],
    clientId: x[2],
    status: x[3],
    postStatus: x[5],
    }))
    .filter(x=>x.timeCreated!=0);

  cdsListDict.forEach((entry) => {
    if (entry.postStatus != 'complete' && entry.status.toLowerCase() == 'qualified') { // change according to event type
      const postResponse = POST_fbPostBack(entry); // pbResponse.getAllHeaders())
      const pingLogSheet = SpreadsheetApp
        .getActive()
        .getSheetByName(
        'ping_log'
        );
      pingLogSheet
        .getRange(pingLogSheet.getLastRow() + 1, 1, 1, 3)
        .setValues([[entry.fbclid, new Date(nowEpoch()), postResponse]]);
    }
  });
};

/*
  get the options needed for the postback and stringify
  create url and do POST
*/
const POST_fbPostBack = (options) => {
  // example {{user_data.fbc}} fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890 example
  const fbPostData = JSON.stringify(
    DATA_fbPostBack(options) //|| SpreadsheetApp.getActive().getActiveCell().getValue()
  );
  // example WITH user data city [{"event_name":"test_sf","event_time":1599441635,"user_data":{"fbc":"fb.1.1596641005.IwAR0JeWk6zYY_-kzPJl982VnBwE8FKkGvdlNaIqXyLAgU3Iea7WMsn3Zz4z4","ct":"42ec47ad8f9d1234f0b45f35eec1a952a105c1d2829edbb530c4acfd43566ceb"},"custom_data":{"content_name":"enroled"}}]
  // example {{url}} "https://graph.facebook.com/v7.0/1636358889940801/events?data=%5B%7B%22event_name%22%3A%22test_sf%22%2C%22event_time%22%3A1598510682%2C%22user_data%22%3A%7B%22fbc%22%3A%22fb.1.1596641005.IwAR0JeWk6zYY_-kzPJl982VnBwE8FKkGvdlNaIqXyLAgU3Iea7WMsn3Zz4z4%22%7D%2C%22custom_data%22%3A%7B%22content_name%22%3A%22enroled%22%7D%7D%5D&access_token=abc123"
  const url = `https://graph.facebook.com/v7.0/1636358889940801/events?data=${encodeURIComponent(fbPostData)}&access_token=${getAccessToken()}` // &test_event_code=TEST58601`; // <= for testing only
  Logger.log(url)
  const response = UrlFetchApp.fetch(url, { method: 'post' });
  return response;
};


/*
  return the options needed for the postback
  TODO: change now to be the earliest possible time within 7 day margin
*/
let DATA_fbPostBack = (options) => {
  //const now = nowEpoch(); // e.g 1598511682 https://www.epochconverter.com/
  //const oneWeekAgo = (new Date).setHours(0,0,0,0) - (1000*60*60*24*6)
  const now = new Date
  const oneWeekAgo = now - (1000*60*60*24*7) // now minus 7 days + 5 seconds
  //const sevenDaysAgo = new Date(new Date - (1000*60*60*24*7)).setHours(0,0,0,0)
  const timeCreated = options.timeCreated
  /* set the conversion time to 7 days ago if conversion actual date was prior to that */
  const cnvTime = timeCreated
  .setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()) 
  <= oneWeekAgo 
  ?
  new Date(oneWeekAgo).setHours(now.getHours(), now.getMinutes()+5, now.getSeconds(), now.getMilliseconds()) 
  :
  timeCreated
  //const timeCreated = options.timeCreated < sevenDaysAgo ? (new Date - (1000*60*60*24*7))/1000 + 600 : options.timeCreated + 36001000 + 980000 // is the time created within the last 7 days?
  //// PROBLEM: IF THE DATE IS THE SAME DAY SEVEN DAYS AGO MAKE SURE TO MAKE THE TIME LATER THAN NOW. TRY 30 MINS TO START
  return [
    {
      event_name: 'sf_qualified_finalv2', // change according to event type
      event_time: Math.round(cnvTime/1000), // could be the converion datetime from SF
      user_data: { fbc: `fb.1.${Math.round(cnvTime/1000)}.${options.fbclid}`, ct: 'e8032604447171cc6e65cfb98ff38ccbf9f5f9113e0cb63060533ed86ad0032e'},
      custom_data: { content_name: 'enroled' },
   }
  ];
};


// ///////////////////////////////////////////
// ////////////// UTILITIES //////////////////
// ///////////////////////////////////////////

const GET_fbTrace = (traceId) => {
  const url = `https://graph.facebook.com/v7.0/${traceId}&access_token=${getAccessToken()}`;
  const response = UrlFetchApp.fetch(url);
  return response;
};

const nowEpoch = () => {
  const today = new Date();
  return Math.floor(today/1);
};




// ///////////////////////////////////////////
// ////////////// TESTS //////////////////
// ///////////////////////////////////////////

const test_nowEpoch= () => {
  Logger.log(nowEpoch())
}
  
const test_dates = () => {
  const dt = SpreadsheetApp.getActive().getSheetByName('combine_sf_ga.extract').getRange(76,1).getValue()
  const options_timeCreated = datetoEpoch(dt)
  const now = nowEpoch(); // e.g 1598511682 https://www.epochconverter.com/
  const sevenDaysAgo = new Date(new Date - (1000*60*60*24*7)).setHours(0,0,0,0)/1000
  const timeCreated = options_timeCreated < sevenDaysAgo ? (new Date - (1000*60*60*24*7))/1000 + 600 : options_timeCreated // is the time created within the last 7 days?
  const timeCreated2 = options_timeCreated > sevenDaysAgo ? (new Date - (1000*60*60*24*7))/1000 + 600 : options_timeCreated
  Logger.log(dt)
  Logger.log(now)
  Logger.log(options_timeCreated)
  Logger.log(sevenDaysAgo)
  Logger.log(options_timeCreated < sevenDaysAgo)
  Logger.log(options_timeCreated > sevenDaysAgo)
  Logger.log(timeCreated)
  Logger.log(timeCreated2)
}


// ///////////////////////////////////////////
// ////////////// DEPRECATED //////////////////
// ///////////////////////////////////////////


const test_stringDatetoEpoch = () => {
  Logger.log(stringDatetoEpoch('06/04/1904'))
}
  
const stringDatetoEpoch = (dateString) => {
  const dateParts = dateString.split("/");
  return new Date(dateParts[2], dateParts[1]-1, dateParts[0]); 
}

  const datetoEpoch = (date) => {
  //return Math.floor(date / 1000)
  return Math.floor(date/1)
}
  
const test_datetoEpoch = () => {
  const dt = SpreadsheetApp.getActive().getSheetByName('combine_sf_ga.extract').getRange(75,1).getValue()
  Logger.log(datetoEpoch(dt))
}