const linkRegex = /^(http|https):\/\/([a-z0-9.-]*)(:\d+)?(\/.*)$/;

function matchSwaggerObjectPath(path) {
    const matchObject = linkRegex.exec(path);

    if (matchObject) {
        return {
            protocol: matchObject[1],
            host: matchObject[2],
            portMatch: matchObject[3],
            endpoint: matchObject[4]
        }
    } else {
        throw Error(`Invalid Swagger object path: ${path}`);
    }
}

module.exports = matchSwaggerObjectPath;