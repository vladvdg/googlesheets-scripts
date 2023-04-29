function newDay() 
{
  var thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceTemplate = SpreadsheetApp.openById('184uNOl-hOqQOgl0s3Acqw1prJWyb1z-d1J-aIMI2MKA');
  var sheetTemplate = sourceTemplate.getSheetByName('TemplateReasonIT');

  // SETTING THE WEEK NUMBER
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));         
  var weekNumber = Math.ceil(days / 7); // Return the Week Number

  // SETTING CURRENT DAY
  var dateNow = new Date();
  var start = new Date(dateNow.getFullYear(), 0, 0);
  var diff = dateNow - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);

  // NAME SHEET
  sheetTemplate.copyTo(thisSpreadsheet).setName("Day_" + day);
  thisSpreadsheet.getSheetByName("Day_" + day).setTabColor("#32CD32");

  // DATA MONITOR FROM REPORT
  var sheetNew = thisSpreadsheet.getSheetByName("Day_" + day);
  var data1 = '=IMPORTRANGE("https://docs.google.com/spreadsheets/d/1QvseN9zZlBEtr6aplaAoq_etoPjHj0NEjSrPwCs8g7I/edit#gid=1090831486", "';
  var data2 = "week number ";
  var data3 = weekNumber;
  var data4 = '!G1:G12")';
  sheetNew.getRange(1, 5).setValue(data1 + data2 + data3 + data4);
  
  // DELETE OLD SHEET
  var dayString = day.toString();
  var dayBefore = dayString - 1;
  var oldName = thisSpreadsheet.getSheetByName("Day_" + dayBefore);
  thisSpreadsheet.deleteSheet(oldName);

  // RANGE PROTECTION
  var range1 = sheetNew.getRange('A1:A103'); // 'A' Column
    
  var range2 = sheetNew.getRange('B1:B23'); // 'B' Column
  var range3 = sheetNew.getRange('B25:C25');  
  var range4 = sheetNew.getRange('B27:B41');
  var range5 = sheetNew.getRange('B43:C43');
  var range6 = sheetNew.getRange('B45:B51');
  var range7 = sheetNew.getRange('B53:B64');
  var range8 = sheetNew.getRange('B66:C66');
  var range9 = sheetNew.getRange('B68:B72');
  var range10 = sheetNew.getRange('B74:C74');
  var range11 = sheetNew.getRange('B76:B81');
  var range12 = sheetNew.getRange('B83:C83');
  var range13 = sheetNew.getRange('B85:C85');
  var range14 = sheetNew.getRange('B87:C87');
  var range15 = sheetNew.getRange('B89:C89');
  var range16 = sheetNew.getRange('B91:B103');

  var range17 = sheetNew.getRange('E1:E12'); // 'E' Column

  var ranges = [range1, range2, range3, range4, range5, range6, range7, range8, range9, range10, range11, range12, range13, range14, range15, range16, range17];

  for (var j=0; j<ranges.length; j++)
  {
    var protection = ranges[j].protect().setDescription('Proteced Cell!');

    var me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());

    if (protection.canDomainEdit())
    {
      protection.setDomainEdit(false);
    }
  }
}





















