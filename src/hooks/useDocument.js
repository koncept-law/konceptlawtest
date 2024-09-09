import { useState } from "react";

import * as XLSX from "xlsx";
import mammoth from "mammoth";
import JSZip from "jszip";

const useDocument = () => {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);

    /**
     * @param {'single' | 'multiple'} type - Determines if single or multiple files can be uploaded.
     */
    const upload = (type = "single") => {
        const input = document.createElement("input");
        input.type = "file";

        if (type === "multiple") {
            input.multiple = true;
        }

        input.onchange = (event) => {
            const selectedFiles = Array.from(event.target.files);

            if (type === "single") {
                setFile(selectedFiles[0]); // Set the single selected file
                setFiles(selectedFiles); // Set the array of selected files
            } else if (type === "multiple") {
                setFiles(selectedFiles); // Set the array of selected files
            }
        };

        // Programmatically trigger the file input
        input.click();
    };


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
     * @param {*} data - Array Form
     * @param {*} filename filename - string
     * @install xlsx - npm i xlsx
     * @example
     * const docs = useDocument();
        <Button
          onClick={() => docs.downloadXLSX(data, filename)}
          color="purple"
          className="capitalize"
        >
          Export
        </Button>
     */
    function downloadXLSX(data, filename) {
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

    /** 
     * @param fileData - Single XLSE File
     * @output JSON Format Data
     */
    const readXLSX = (fileData = null) => {
        return new Promise((resolve, reject) => {
            if (!fileData) {
                fileData = file;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Assuming you're working with the first sheet
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    // Convert the worksheet to JSON with headers as keys
                    const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (jsonSheet.length === 0) {
                        throw new Error('No data found in the sheet');
                    }

                    // Extract headers (first row of the sheet)
                    const headers = jsonSheet[0];

                    // Convert the rest of the rows into objects with headers as keys
                    const rows = jsonSheet.slice(1).map(row => {
                        const rowData = {};
                        headers.forEach((header, index) => {
                            rowData[header] = row[index];
                        });
                        return rowData;
                    });

                    // Resolve the promise with the rows data
                    resolve(rows);
                } catch (error) {
                    reject('Error processing the file:', error);
                }
            };

            reader.onerror = (error) => {
                reject('FileReader error:', error);
            };

            reader.readAsArrayBuffer(fileData);
        });
    };

    /** 
     * @param find = string value for find headers
     * @output boolean true | false
     */
    const findHeaderXLSX = async (find = null, fileData = null) => {
        if (!fileData) {
            fileData = file;
        }
        let read = await readXLSX(fileData);
        let findData = false;
        let headers = Object.keys(read[0]);

        if (Array.isArray(find)) {
            findData = find.every(item => headers.includes(item));
        } else {
            findData = headers.includes(find);
        }

        return findData ? true : false;
    }

    /** 
     * @param header = string => find all cells data to header name
     * @output [] -> Array all Cells data
     */
    const cellsXLSX = async (header = "", fileData = null) => {
        if (!fileData) {
            fileData = file;
        }
        let read = await readXLSX(fileData);
        return read?.map((item) => item[header])
    }

    /**
     * @param readData - Array of objects read from an XLSX file
     * @example
     * let read = await docs.readXLSX(file);
     * console.log(read); // [{a: "1", b: "x"}, {a: "2", b: "y"}, {a: "3", b: "z"}]
     * let format = docs.formatXLSX(read);
     * console.log(format); // {a: ["1", "2", "3"], b: ["x", "y", "z"]}
     */
    const formatXLSX = (readData = []) => {
        if (!Array.isArray(readData) || readData.length === 0) {
            console.error("Invalid data: Must be a non-empty array");
            return {};
        }

        // Initialize an object to hold the formatted data
        const formattedData = {};

        // Iterate over each object in the array
        readData.forEach(row => {
            // For each key in the object
            Object.keys(row).forEach(key => {
                // If the key is not already in the formattedData, initialize it as an empty array
                if (!formattedData[key]) {
                    formattedData[key] = [];
                }

                // Push the value to the corresponding key's array
                formattedData[key].push(row[key]);
            });
        });

        return formattedData;
    };

    /**
     * Converts a formatted data object back into an array of objects.
     * Handles arrays of different lengths.
     * @param formatData - Object where keys map to arrays of values
     * @example
     * let format = {a: ["1", "2", "3"], b: ["x", "y", "z", "0"]};
     * let convert = docs.formatConvertXLSX(format);
     * console.log(convert); // [{a: "1", b: "x"}, {a: "2", b: "y"}, {a: "3", b: "z"}, {b: "0"}]
     */
    const formatConvertXLSX = (formatData = {}) => {
        if (typeof formatData !== 'object' || formatData === null) {
            console.error("Invalid data: Must be a non-null object");
            return [];
        }

        // Get the array of keys (headers) from the formatted data
        const keys = Object.keys(formatData);
        // Get the maximum length of the arrays
        const maxLength = Math.max(...keys.map(key => formatData[key].length));

        // Convert the formatted data back into an array of objects
        const convertedData = Array.from({ length: maxLength }, (_, index) => {
            const row = {};
            keys.forEach(key => {
                // Assign the value if it exists, otherwise set it as undefined
                row[key] = formatData[key][index] !== undefined ? formatData[key][index] : "";
            });
            return row;
        });

        return convertedData;
    };

    /**
    * Replaces cells in the Excel data with the provided values for specified headers.
    * Merges new values with existing values for each header.
    * @param headers - Array of headers to replace
    * @param values - Array of arrays of values corresponding to each header
    * @param fileData - Optional file data to use, otherwise falls back to a global `file`
    * @returns - The modified Excel data as an array of objects
    * @example
    *  let replace1 = await docs.replaceCellsToHeaderXLSX(["Category"], [['1', '2']]);
    console.log("replace1", replace1);
    let replaceData = await docs.replaceCellsToHeaderXLSX(["Category", "Category1"], [["1", "2", "3", "4"], ["a", "b"]]);
    console.log("replace data", replaceData);
    */
    const replaceCellsToHeaderXLSX = async (headers = [], values = [], fileData = null) => {
        if (!fileData) {
            fileData = file; // Ensure `file` is defined in the relevant scope
        }
        if (Array.isArray(headers) && Array.isArray(values) && headers.length === values.length) {
            let read = await readXLSX(fileData);
            let format = formatXLSX(read);

            headers.forEach((header, index) => {
                if (Array.isArray(values[index])) {
                    // Get existing values or initialize with empty array if header not present
                    let existingValues = format[header] || [];

                    // Update the existing values with the new values
                    for (let i = 0; i < values[index].length; i++) {
                        if (i < existingValues.length) {
                            existingValues[i] = values[index][i];
                        } else {
                            existingValues.push(values[index][i]);
                        }
                    }

                    format[header] = existingValues;
                } else {
                    console.error(`Error: Value for header '${header}' is not an array.`);
                }
            });

            let convert = formatConvertXLSX(format);
            // console.log("convert", convert);
            return convert; // Return the modified data
        } else {
            console.error("Error: Headers and values must be arrays of the same length.");
            return [];
        }
    }

    /**
     * 
     * @param {*} header - String
     * @param {*} value - Array
     * @param {*} fileData - file data
     * @returns - insert Excel Data
     */
    const insertRowXLSX = async (header = "", value = [], fileData = null) => {
        if (!fileData) {
            fileData = file;
        }
        let read = await readXLSX(fileData);
        let format = formatXLSX(read);
        format = {
            ...format,
            [header]: value,
        }
        let convert = formatConvertXLSX(format);
        return convert;
    }

    // reset selected file/files
    const reset = () => {
        setFile(null);
        setFiles([]);
    }

    const download = (blob = null, fileName = "") => {
        if (!blob) {
            blob = file;
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * @example
     *   const converter = async () => {
    console.log(docs.file)
    const html = await docs.docxConvertHtml([docs.file]); // docs.files 
    // without file
    // const html = await docs.docxConvertHtml();
    console.log("html", html)
  }
     */
    const docxConvertHtml = async (fileData = null) => {
        if (!fileData) {
            // console.log(file, files);
            fileData = files;
        }
        // console.log(fileData);
        const conversions = Array.from(fileData).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            return await mammoth.convertToHtml({ arrayBuffer });
        });

        try {
            const results = await Promise.all(conversions);
            // results.forEach((result, index) => {
            //     console.log(`File ${index + 1} HTML:`, result.value);
            // });
            return results.map(result => result.value);
        } catch (error) {
            console.error('Error converting multiple files:', error);
        }
    }

    const downloadDocx = () => {

    }

    /**
     * 
     * @example
     *  let longLinks = unqiueAccountNoData?.map(({longLink}) => ({link: longLink}));
        // console.log(longLinks);
        docs.downloadPdf("filterAccountPdfs", longLinks)
     */
    const downloadPdf = async (folderName = "", campaignFilesLink = []) => {
        let currentBatchSize = 0;
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        let batchNumber = 1;
        let zip = new JSZip();
        let filesFolder = zip.folder(`${folderName}${batchNumber}`);

        const totalFiles = campaignFilesLink.length;

        for (let i = 0; i < totalFiles; i++) {
            const fileLink = campaignFilesLink[i]?.link;
            const fileName = campaignFilesLink[i]?.name || `file${i + 1}.pdf`;

            if (fileLink) {
                const fileUrl = `${fileLink}?t=${Date.now()}`;

                try {

                    const response = await fetch(fileUrl);
                    if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

                    const fileBlob = await response.blob();

                    const fileSize = fileBlob.size;

                    if (currentBatchSize + fileSize > maxSize) {
                        // Generate and download the current batch's zip file
                        const content = await zip.generateAsync({ type: "blob" });
                        saveAs(content, `${folderName}${batchNumber}.zip`);

                        // Reset for next batch
                        batchNumber++;
                        zip = new JSZip();
                        filesFolder = zip.folder(`${folderName}${batchNumber}`);
                        currentBatchSize = 0;
                    }

                    // Add PDF to the current batch
                    filesFolder.file(fileName, fileBlob);
                    currentBatchSize += fileSize;
                } catch (error) {
                    console.error(`Failed to fetch or process file: ${fileName}`, error);
                }
            } else {
                console.warn(`Skipping invalid or empty file link at index ${i}`);
            }
        }

        // Download remaining files in the last batch
        if (currentBatchSize > 0) {
            try {
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, `${folderName}${batchNumber}.zip`);
            } catch (error) {
                console.error(`Failed to generate zip file: ${error}`);
            }
        }
    };


    return {
        upload,
        file,  // Expose the single file (if single mode is used)
        files, // Expose the array of files (if multiple mode is used)
        downloadXLSX,
        readXLSX,
        reset,
        download,
        findHeaderXLSX,
        cellsXLSX,
        replaceCellsToHeaderXLSX,
        formatXLSX,
        formatConvertXLSX,
        insertRowXLSX,
        docxConvertHtml,
        downloadDocx,
        downloadPdf,
    };
};

export default useDocument;
