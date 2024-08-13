const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const countryLanguageMapping = {
  ca: ["fr", "bg"],
  ie: ["fr", "es", "te"],
  cz: ["cs"],
};

// Translation of Json files configuration
/**
 * @var inputPath - Input file path should be containing input JSON file for translation.
 * If input file path is not provided, defaultly sets to ./input.json
 *
 * @var outputPath - If OutputPath is not provided defaultly creates locales folder and all mapping folder are created.
 * Else all the files are created in given output path
 *
 * @var outputJsonFileName - Used for creating or updating output json file name
 *
 * @var isExcelSheetNeeded - 'true' if you need excel sheet or default set to false
 *
 * @var outputExcelPath - Creates excel file of all translations, if  not provided creates excel file in the same folder.
 */
const paths = {
  inputPath: "./input.json",
  outputPath: "",
  outputJsonFileName: "common",
  isExcelSheetNeeded: false,
  outputExcelPath: "",
};


// Converts Json files to Excel sheet configuration
/**
 * @var baseDirPath - Directory of translation folders path.
 *
 * @var jsonFileName - Json file name that need to be converted.
 *
 * @var outputExcelPath - Path where excel sheet to be created. default : at the same folder
 *
 * @var excelFileName - Name of the excel sheet name that need to be created, default : translations
 *
 */

const convertToExcelPaths = {
  baseDirPath: "", // compulsory
  jsonFileName: "", // compulsory
  outputExcelPath: "",
  excelFileName: "",
};

// Converts Excel sheet to Json files configuration
/**
 * @var excelFilePath - Path of the excel sheet that need to be converted to Json files.
 *
 * @var outputDirPath - Path of the folder, where Json files to be created. default : creates locales folder in it.
 *
 * @var ouputJsonFileName - Name of the Json file that need to be created. default : common
 *
 */
const convertToJsonPaths = {
  excelFilePath: "", // Compulsory
  outputDirPath: "",
  ouputJsonFileName: "", //Compulsory
};

/**
 * 
 */
const convertToLanguages = {
  inputPath: "",
  languages: [
    "lt",
    "ru",
    "fr",
    "sv",
    "tr",
    "es",
    "sl",
    "sk",
    "sr",
    "ro",
    "pt",
    "no",
  ],
  outputPath: "",
};

module.exports = {
  generationConfig,
  countryLanguageMapping,
  paths,
  convertToExcelPaths,
  convertToJsonPaths,
  convertToLanguages,
};
