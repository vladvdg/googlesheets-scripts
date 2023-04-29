function addWeeks() //Function by week Monday
{
  var source = SpreadsheetApp.getActiveSpreadsheet();
  
  var sourceTemplate = SpreadsheetApp.openById('SHEET_ID');
  var sheetTemplate = sourceTemplate.getSheetByName('TemplateReportIT');

  //WEEK NUMBER
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));         
  var weekNumber = Math.ceil(days / 7);

  for (weekNumber; weekNumber < 53; weekNumber++)
  {    
    sheetTemplate.copyTo(source).setName("week number " + weekNumber); // Copy the template and set the name of the tab
    //source.getSheetByName("week number " + weekNumber); // Mark each tab with white color
  }
}
