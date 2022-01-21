const JSON5 = require('json5');
const FileManager = require('./FileManager');
const HttpRequest = require('../utils/HttpRequest');

module.exports = class Deploy {
    constructor(filename) {
        this.uri = '/buckets/blip_portal:';
        this.filePath = FileManager.getFilePath(filename);
        this.init();
    }

    init() {
        this.setConfigs();
        this.startDeploy();
    }

    setConfigs() {
        this.configs = JSON5.parse(FileManager.getFile(`${__dirname}/../config.jsonc`));
    }

    getJSON() {
        let json;

        try {
            const content = FileManager.getFile(this.filePath);

            switch (FileManager.getFileExtension(this.filePath)) {
                case '.json':
                    json = JSON.parse(content);
                    break;
                case '.jsonc':
                    json = JSON5.parse(content);
                    break;
                default:
                    json = false;
                    break;
            }

            return json;
        } catch {
            return false;
        }
    }

    startDeploy() {
        const content = this.getJSON(this.filePath);

        if (!content) {
            this.debugMessage('Arquivo não encontrado ou o formato do arquivo é incompatível');
            return;
        }

        // eslint-disable-next-line
        Object.entries(content).forEach(([i, row]) => {
            const destination = row[this.configs.destinationIndex] || false;
            const source = row[this.configs.sourceIndex] || false;

            if (source && destination) this.Deploy({ destination, source });
        });
    }

    Deploy(json = {}) {
        const keys = {
            document: '',
            destination: json.destination,
            source: json.source
        };
        this.configs.documentKeys.forEach((documentKey) => {
            this.getDocument(json.source, documentKey)
                .then((sourceContent) => {
                    if (sourceContent.success) {
                        this.setDocument(json.destination, documentKey, sourceContent)
                            .then((response) => {
                                keys.document = documentKey;
                                this.debugMessage({ keys }, response.status);
                            })
                            .catch((e) => {
                                keys.document = documentKey;
                                this.debugMessage({ message: e, keys });
                            });
                    } else {
                        keys.document = documentKey;
                        this.debugMessage({ message: sourceContent.message, keys });
                    }
                })
                .catch((e) => {
                    keys.document = documentKey;
                    this.debugMessage({ message: e, keys });
                });
        });
    }

    debugMessage(response, status = 'error') {
        // eslint-disable-next-line
        if (this.configs.debug) console.log({ status, response });
    }

    getDefaultJSON(botKey, documentKey, sourceContent = false) {
        const json = {
            body: {
                id: `${Date.now()}-automatic_deploy-${Math.random()
                    .toString(16)
                    .replace('0.', '')}`,
                method: 'GET',
                uri: `${this.uri}${documentKey}`
            },
            header: [
                {
                    key: 'Authorization',
                    value: botKey
                },
                {
                    key: 'Content-Type',
                    value: 'application/json'
                }
            ]
        };

        if (sourceContent) {
            json.body.method = 'set';
            Object.entries(sourceContent).forEach(([key, value]) => {
                json.body[key] = value;
            });
        }

        return json;
    }

    async getDocument(AuthorizationBotKey, documentKey) {
        const params = this.getDefaultJSON(AuthorizationBotKey, documentKey);

        const response = await Deploy.sendRequest(params);

        const { type, resource } = response;

        if (type && resource) return { type, resource, success: true };

        return {
            success: false,
            message: response.reason.description
        };
    }

    async setDocument(AuthorizationBotKey, documentKey, sourceContent) {
        const params = this.getDefaultJSON(AuthorizationBotKey, documentKey, sourceContent);
        const response = await Deploy.sendRequest(params);
        return response;
    }

    static sendRequest(json) {
        return new Promise((res, rej) => {
            HttpRequest.post('https://http.msging.net/commands', json.body, json.header)
                .then((result) => {
                    const { code, description } = result;

                    if (code && description) rej(new Error(description));

                    res(result);
                })
                .catch((e) => {
                    rej(new Error(e.message));
                });
        });
    }
};
