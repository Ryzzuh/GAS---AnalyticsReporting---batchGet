const onOpen = () => {
  let ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('**Data**')
      .addItem('send hits for all fbclid', 'main')
      .addItem('send hit to facebook', 'POST_fbPostBack')
      .addToUi();
}