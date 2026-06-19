function doPost(e) {
  try {
    const sheetName = e.parameter.sheet;
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(sheetName);

    // Auto-generate sheet and headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      if (sheetName === 'RSVP') {
        sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Guests', 'Attendance', 'Dietary Restrictions']);
      } else if (sheetName === 'WISH') {
        sheet.appendRow(['Timestamp', 'Name', 'Message']);
      } else {
        // Fallback for unknown sheets
        sheet.appendRow(['Timestamp', 'Data']);
      }
      
      // Style the header row
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const timestamp = new Date();
    let rowData = [];

    if (sheetName === 'RSVP') {
      rowData = [
        timestamp,
        e.parameter.name || '',
        e.parameter.phone || '',
        e.parameter.guests || '',
        e.parameter.attendance || '',
        e.parameter.dietaryRestrictions || ''
      ];
    } else if (sheetName === 'WISH') {
      rowData = [
        timestamp,
        e.parameter.name || '',
        e.parameter.message || ''
      ];
    } else {
      rowData = [timestamp, JSON.stringify(e.parameter)];
    }

    // Append the data
    if (rowData.length > 0) {
      sheet.appendRow(rowData);
    }

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET request handler for testing if the web app is live
function doGet(e) {
  return ContentService.createTextOutput("Web App is running successfully!");
}
