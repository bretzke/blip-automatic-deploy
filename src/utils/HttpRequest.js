const XMLHttpRequest = require('xhr2');

module.exports = {
    get(route, params = {}) {
        return this.request('GET', route, params);
    },

    post(route, params = {}, headers = []) {
        return this.request('POST', route, params, headers);
    },

    delete(route, params = {}) {
        return this.request('DELETE', route, params);
    },

    put(route, params = {}) {
        return this.request('PUT', route, params);
    },

    request(method, url, params = {}, headers = []) {
        return new Promise((resolve, reject) => {
            const ajax = new XMLHttpRequest();
            ajax.open(method.toUpperCase(), url);
            ajax.onerror = (event) => {
                reject(event);
            };
            ajax.onload = () => {
                let obj = {};
                try {
                    obj = JSON.parse(ajax.responseText);
                } catch (e) {
                    reject(e);
                }
                resolve(obj);
            };

            headers.forEach((header) => {
                ajax.setRequestHeader(header.key, header.value);
            });

            ajax.send(JSON.stringify(params));
        });
    }
};
