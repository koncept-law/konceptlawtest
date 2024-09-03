import * as XLSX from "xlsx";

function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if (typeof ob[i] == "object" && ob[i] !== null && !Array.isArray(ob[i])) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function serializeObjectForCell(obj) {
  return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join(", ");
}

/**
 * 
 * @param {*} data - array form data
 * @param {*} filename filename - string
 * @install xlsx - npm i xlsx
 * @example
    <Button
      onClick={() => downloadXLSX(data, filename)}
      color="purple"
      className="capitalize"
    >
      Export
    </Button>
 */
function DownloadXLSX(data, filename) {
  const processedData = data.map(item => {
    let mutableItem = JSON.parse(JSON.stringify(item));

    // Automatically handle fields that are  arrays of objects
    Object.keys(mutableItem).forEach(key => {
      if (Array.isArray(mutableItem[key])) {
        mutableItem[key].forEach((subItem, index) => {
          mutableItem[`${key}[${index}]`] = serializeObjectForCell(subItem);
        });
        delete mutableItem[key];  // Remove the original array to simplify the result
      }
    });

    return flattenObject(mutableItem);
  });

  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export default DownloadXLSX;
