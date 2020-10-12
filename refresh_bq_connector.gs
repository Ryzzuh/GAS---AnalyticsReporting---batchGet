function refreshSfGaExtract() {
  //SpreadsheetApp. ui i stuff
  var spreadsheet = SpreadsheetApp.getActive();
  //var spreadsheet = SpreadsheetApp.openById("1Gb6ylO-hJ8uRT1wQRpmAlsXup3AJsvv8kOZIk8Uhpc4")
  var sheet = spreadsheet.getSheetByName('combine_sf_ga.extract');
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('combine_sf_ga.extract'), true);
  SpreadsheetApp.enableAllDataSourcesExecution();
  const dataSourceTable = spreadsheet.getCurrentCell().getDataSourceTables()[0]
  dataSourceTable.refreshData()
  /////
    // TEST WAITFOREXEUCTIONCOMPLETION FIRST THING BEFORE REFRESHING i.e WITHOUT A CACHE
  /////
  
  const executionStatus = dataSourceTable.getDataSource().waitForAllDataExecutionsCompletion(60);
  Logger.log(dataSourceTable.getStatus().getExecutionState())
  while (dataSourceTable.getStatus().getExecutionState() == 'RUNNING'){
    Logger.log(dataSourceTable.getDataSource().waitForAllDataExecutionsCompletion(60))
    Logger.log(dataSourceTable.getStatus().getExecutionState())
    Logger.log('************')
  }
  Logger.log(executionStatus)
  var ui = SpreadsheetApp.getUi()
  ui.alert(dataSourceTable.getStatus().getExecutionState())
  
 main()
};

const bqRefreshCallBack = () => {
  return
}