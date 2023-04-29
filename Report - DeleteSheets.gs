function deleteSheets() 
{
  var source = SpreadsheetApp.getActiveSpreadsheet();

  var today = new Date();
  var lastDayOfMonth = new Date(today.getFullYear() , today.getMonth(), 0); // +1 or n/a for past month
  var todayMax = lastDayOfMonth.getDate(); // Return the last day of the month

  var daySheet;

  var monthSheet = lastDayOfMonth.getMonth()+1;
  var yearSheet = lastDayOfMonth.getFullYear();
  //var shortYearSheet = yearSheet.toString();
  //shortYearSheet = shortYearSheet.substring(2, 4); // Return year

  if(monthSheet.toString().length == 1)
  {
    var monthSheet = '0'+monthSheet;
  }
  
  var dayTempo = todayMax;
  var i = 1;

  for(i; i < todayMax+1; i++) // todayMax + 1
  {
    if(dayTempo.toString().length == 1)
    {
    var daySheet = '0'+dayTempo; // Day become 01, 02, 03...
    }
    else
    {
      daySheet = dayTempo;
    }

    var nameSheets = daySheet + "." + monthSheet; // + "." + shortYearSheet;
    var sheet1 = source.getSheetByName(nameSheets);

    if(sheet1 != null)
    {
      source.deleteSheet(sheet1);
      dayTempo--;
    }
    else
    {
      dayTempo--;
    }
  }
}
