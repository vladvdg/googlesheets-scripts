function dataReport()
{
  var sourceSpreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // Source Spreadsheet
  var sourceSheet = sourceSpreadsheet.getActiveSheet(); // Source sheet
  
  // SETTING THE WEEK NUMBER
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));         
  var weekNumber = Math.ceil(days / 7); // Return the Week Number

  // DETAILS DATA REPORT
  var dd = String(currentDate.getDate()).padStart(2, '0');
  var mm = String(currentDate.getMonth() + 1 ).padStart(2, '0'); //January is 0!
  var yyyy = currentDate.getFullYear();  
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayName = days[currentDate.getDay()];
  var today = dayName + " - " + dd + "." + mm + "." + yyyy;

  // SET TARGET DOCUMENT
  var targetDoc = SpreadsheetApp.openById('1QvseN9zZlBEtr6aplaAoq_etoPjHj0NEjSrPwCs8g7I'); 
  var targetSheet = targetDoc.getSheetByName("week number " + weekNumber); // Target sheet
  
  // USER AND TIME FOR REPORT
  var user = Session.getActiveUser().getEmail().split("@")[0];
  var time = Utilities.formatDate(currentDate, "GMT+3", "HH:mm");  
  
  for(var rowSheet = 4; rowSheet < 110; rowSheet++)
  {
    var reasonRange = sourceSheet.getRange(rowSheet, 3).getValue(); // Get Value to Send

    if((reasonRange.toString().length > 0)) // !variable.isBlank() | if the cell content is > than 2, then...
    {
      var values = [[sourceSheet.getRange(rowSheet, 2).getValue(), reasonRange, today, user, time]];  // Get Reason & Details 

      var Avals = targetSheet.getRange("A1:A").getValues();
      var lastRowTarget = Avals.filter(String).length;
      
      targetSheet.getRange(lastRowTarget+1, 1, 1, 5).setValues(values); // Write the values in the Target Sheet

      sourceSheet.getRange(rowSheet, 3).clearContent();
    }
  }
  sourceSheet.getRange(1,1).activate();
}