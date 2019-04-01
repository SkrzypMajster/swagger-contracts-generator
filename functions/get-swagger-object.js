const http = require('http');
const https = require('https');
const matchSwaggerObjectPath = require('./match-swagger-object-path')

async function getSwaggerObject(path) {
    return new Promise((resolve, reject) => {
        try {
            const pathMatchObject = matchSwaggerObjectPath(path);

            const requestConfig = (pathMatchObject.portMatch) ?
                {
                    host: pathMatchObject.host,
                    path: pathMatchObject.endpoint,
                    port: parseInt(pathMatchObject.portMatch.slice(1))
                } : {
                    host: pathMatchObject.host,
                    path: pathMatchObject.endpoint
                }

            switch (pathMatchObject.protocol) {
                case 'http':
                case 'https':
                    const request = (pathMatchObject.protocol === 'https') ?
                        https.request(requestConfig, res => {
                            resourceCallback(res)
                                .then((swaggerObject) => resolve(swaggerObject))
                        }) :
                        http.request(requestConfig, res => resourceCallback(res));

                    request.on('error', error => {
                        let errorObject; 
                        
                        switch (error.errno) {
                            case "ECONNREFUSED":
                                errorObject = Error(`Cannot GET Swagger object from ${error.address}:${error.port} - Connection refused`)
                            break;

                            default:
                                errorObject = Error("Undefinded error");
                        }

                        reject(errorObject);
                    });

                    request.end();
                    break;

                default:
                    throw Error(`Unsupported protocol: ${pathMatchObject.protocol}`);
            }
        } catch (error) {
            reject(error);
        }
    });
}

function resourceCallback(res) {
    return new Promise((resolve, reject) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
        res.on('error', (error) => reject(error));
    });
}

module.exports = getSwaggerObject;
