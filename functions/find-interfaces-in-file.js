const findInterfaceRegex = /export interface \w*\s{(?:\s*[^}]*)*}/g;

function findInterfacesInFile(fileData) {
    let resultString = "";
    const dataMatchArray = fileData.match(findInterfaceRegex);

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

module.exports = findInterfacesInFile;
