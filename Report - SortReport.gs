function sortReport() 
{
  SpreadsheetApp.getActiveSheet().getRange("A2:D600").sort(1); // Sorting by the first culumn
}