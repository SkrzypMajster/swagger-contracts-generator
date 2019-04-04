const fs = require("fs");

const excludedFiles = [
    "enums.ts",
    "sub-type-factory.ts",
    "index.ts"
];

function collapseContractFiles(contractsDirectory) {
    return new Promise( (resolve, reject) => {
        try {
            const contractFiles = fs.readdirSync(contractsDirectory).filter((fileName) => {
                return !excludedFiles.includes(fileName);
            });

            if (contractFiles.length > 0) {
                const contractsFilePath = `${contractsDirectory}/../contracts.ts`;
                const enumsFilePath = `${contractsDirectory}/enums.ts`;
                const findInterfacesInFile = require("./find-interfaces-in-file");
                
                // first load enums from file
                fs.readFile(enumsFilePath, "utf-8", (err, enumsFileData) => {
                    if (err) {
                        fs.writeFileSync(contractsFilePath, "");
                    } else {
                        const findEnumsInFile = require('./find-enums-in-file');
                        const enums = findEnumsInFile(enumsFileData) + "\n\n";
                        fs.writeFileSync(contractsFilePath, enums);
                    }

                    contractFiles.forEach((file, index) => {
                        const fileData = fs.readFileSync(`${contractsDirectory}/${file}`, "utf-8");

                        const interfaceString = findInterfacesInFile(fileData) +
                            ((index < contractFiles.length - 1) ? "\n\n" : "\n");
    
                        fs.appendFileSync(contractsFilePath, interfaceString);

                        fs.unlinkSync(`${contractsDirectory}/${file}`);
                    });

                    excludedFiles.forEach( (fileName) => {
                        const filePath = `${contractsDirectory}/${fileName}`;
                        
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    });
        
                    fs.rmdirSync(contractsDirectory);
        
                    resolve();
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = collapseContractFiles;
