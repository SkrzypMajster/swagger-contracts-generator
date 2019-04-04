const findEnumRegex = /export enum \w*\s{(?:\s*[^}]*)*}/g;

function findEnumsInFile(fileData) {
    let resultString = "";
    const dataMatchArray = fileData.match(findEnumRegex);

    if (dataMatchArray) {
        dataMatchArray.forEach( (element, index) => {
            resultString += element;

            if (index < dataMatchArray.length - 1) {
                resultString += "\n\n";
            }
        });
    }

    return resultString;
}

module.exports = findEnumsInFile;
