const myFunction = () => {
//  const dateOfConverion = '15/09/2020'
//  Logger.log(new Date( dateOfConverion ) )
//  const dateOfConverion2 = '2020/09/15'
//  Logger.log(new Date( dateOfConverion2 ) )
  
 Logger.log('*************************')
 /*
   Conversion as is from the sheet
 */
 
 const dateOfConverion3 = SpreadsheetApp.getActive().getSheetByName('Sheet8').getRange(3,1).getValue()
 const convDate = new Date( dateOfConverion3 ).setHours(0,0,0,0) 
  const test = dateOfConverion3.setHours(0,0,0,0)
  console.log(test)
 //const oneWeekAgo = new Date((new Date).setHours(0,0,0,0) - (1000*60*60*24*6))/1
 const oneWeekAgo = (new Date).setHours(0,0,0,0) - (1000*60*60*24*6)
 Logger.log(oneWeekAgo)
 Logger.log(new Date(oneWeekAgo))
 Logger.log(oneWeekAgo/1 == new Date(oneWeekAgo)/1)
 
 //const oneWeekAgoEpoch = () => {}
  //const convDateZeroEpoch = (date) => 
 Logger.log(convDate)
 Logger.log(oneWeekAgo)
  
  Logger.log(convDate==oneWeekAgo)
  Logger.log(test==oneWeekAgo)
  x = convDate==oneWeekAgo
 const allDatesOfConverion = SpreadsheetApp.getActive().getSheetByName('Sheet8').getRange(1,1,4).getValues()
 Logger.log(allDatesOfConverion)
   Logger.log('*************************')
  allDatesOfConverion.forEach(x=>{
    console.log(x[0].setHours(0,0,0,0))
    console.log(oneWeekAgo)
    Logger.log( x[0].setHours(0,0,0,0) <= oneWeekAgo )
    var cnvDate = x[0].setHours(0,0,0,0) <= oneWeekAgo ? oneWeekAgo.setHours(x[0].getHours(),0,0,0) : x[0]
})
  
  
  // 15th is the last date!
  
}