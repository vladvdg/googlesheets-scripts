function tabColor() //Function by trigger Monday
{
  //SET WEEK NUMBER, TODAY WEEK NUMBER
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));         
  var weekNumber = Math.ceil(days / 7);  
  
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  for(var i=0; i<sheets.length; i++) // Check all the sheets and if the day is like the tab name make that sheet 'green'
  {
    var nameSheet = sheets[i].getName(); // Get the name of all the sheets
    var nameTab = ss.getSheetByName(nameSheet);

    var nameUsed = "";
    nameUsed = nameSheet.substring(14, 12); // (0.2)

    if(nameUsed == weekNumber)
    {
      nameTab.setTabColor("#4cc441"); // Color code
      nameTab.activate();
      SpreadsheetApp.getActiveSpreadsheet().moveActiveSheet(2); // Position of the sheet after execution of the code
    }
    else if (weekNumber > 1) // Change the color only for the day before
      {
        var temporary = weekNumber - 1;
        if(nameUsed == temporary)
        {
          nameTab.setTabColor("#808080"); // Color code
        }
      }
  }
}
