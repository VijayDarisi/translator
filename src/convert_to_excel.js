const XLSX = require("xlsx");
const { convertToExcelPaths } = require("../config");
const { gatherTranslations } = require("./utils");

if (convertToExcelPaths.baseDirPath ==""){
  console.log("Directory (Say locales) path not provided");
  return
}

if (convertToExcelPaths.jsonFileName == ""){
  console.log("Json file name not provided");
  return
}
// Gather all translations from the locales directory
const translations = gatherTranslations(
  convertToExcelPaths.jsonFileName,
  convertToExcelPaths.baseDirPath
);

// Prepare data for the sheet
let data = [];
let keys = Object.keys(
  translations[Object.keys(translations)[0]][
    Object.keys(translations[Object.keys(translations)[0]])[0]
  ]
);

// Create headers
let columns = ["S.No", "Key"];
for (let country in translations) {
  for (let lang in translations[country]) {
    columns.push(`${country}-${lang}`);
  }
}
data.push(columns);

// Fill the data rows
keys.forEach((key, index) => {
  let row = [index + 1, key];
  for (let country in translations) {
    for (let lang in translations[country]) {
      row.push(translations[country][lang][key] || "");
    }
  }
  data.push(row);
});

// Convert data to worksheet
let worksheet = XLSX.utils.aoa_to_sheet(data);

// Create a new workbook
let workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Translations");

const outputPath = convertToExcelPaths.outputExcelPath;
const excelFileName = convertToExcelPaths.excelFileName === ""? "translations": convertToExcelPaths.excelFileName;


if (outputPath === "") {
  XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
} else {
  XLSX.writeFile(workbook, `${outputPath}/${excelFileName}.xlsx`);
}
// Write to Excel file

console.log("Excel file created successfully.");
