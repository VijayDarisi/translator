const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const { convertToJsonPaths } = require("../config");

// Path to the Excel file
const excelFilePath = convertToJsonPaths.excelFilePath;
if (excelFilePath ===""){
  console.log("Excel file path not provided");
  return
}

if(convertToJsonPaths.ouputJsonFileName == ""){
  console.log("Output Json file name not provided");
  return
}

// Function to create directories recursively
const mkdirRecursiveSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Read the Excel file
const workbook = XLSX.readFile(excelFilePath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Extract headers and data rows
const headers = data[0];
const rows = data.slice(1);

// Defining the final object
const translations = {};

// Iterates over rows to build the translations object
rows.forEach((row) => {
  const [sNo, key, ...translationsArray] = row;
  headers.slice(2).forEach((header, index) => {
    const [country, lang] = header.split("-");
    if (!translations[country]) translations[country] = {};
    if (!translations[country][lang]) translations[country][lang] = {};
    translations[country][lang][key] = translationsArray[index] || "";
  });
});


const outputPath = convertToJsonPaths.outputDirPath === "" ? "./locales": convertToJsonPaths.outputDirPath
const outputJsonFileName = convertToJsonPaths.ouputJsonFileName === "" ? "common" : convertToJsonPaths.ouputJsonFileName

// Create the locale folders and write the fileName.json files
for (const country in translations) {
  for (const lang in translations[country]) {
    const dirPath = path.join(outputPath, `${country}-${lang}`);
    mkdirRecursiveSync(dirPath);
    const filePath = path.join(dirPath, `${outputJsonFileName}.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify(translations[country][lang], null, 2),
      "utf8"
    );
  }
}

console.log("Locale folders and JSON files created successfully.");
