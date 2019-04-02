const fs = require('fs');

const allEnumObjectRegex = /export enum (\w*)\s{(?:\s*[^}]*)*}/g;
const enumItemRegex = /(\w*\s=\s)<any>"\w*"/;
const fileFormat = "utf-8";

function representEnumsAsNumbers(enumsFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(enumsFilePath, fileFormat, (errorObject, data) => {
            if (errorObject) {
                reject(errorObject);
            }

            const enumObjects = data.match(allEnumObjectRegex);

            enumObjects.forEach(enumCode => {
                const oldEnumCode = enumCode;
                let counter = 1;
    
                while (enumCode.match(enumItemRegex)) {
                    enumCode = enumCode.replace(enumItemRegex, `$1${counter}`);
                    counter++;
                }
    
                data = data.replace(oldEnumCode, enumCode);
            });

            fs.writeFileSync(enumsFilePath, data);

            resolve();
        });
    });
}

module.exports = representEnumsAsNumbers;
