const fs = require('fs');
const p = require('path');

module.exports = class FileManager {
    static createFile(data) {
        let { dir } = data;

        if (!FileManager.fileExists(data.dir)) {
            dir = FileManager.createDir(data.dir);
        }

        if (dir) {
            fs.writeFile(
                `${data.dir}/${data.filename}`,
                typeof data.content === 'object'
                    ? JSON.stringify(data.content, null, '    ')
                    : data.content,
                (err) => {
                    if (err) {
                        return false;
                    }

                    return true;
                }
            );
        }
    }

    static createDir(dir) {
        const dirs = dir.replaceAll('/', '\\').split('\\');
        let newDir = '';

        while (dirs.length) {
            newDir += `${dirs[0]}/`;

            if (!fs.existsSync(newDir)) {
                try {
                    fs.mkdirSync(newDir);
                } catch (err) {
                    newDir = false;
                    break;
                }
            }

            dirs.shift();
        }

        return newDir;
    }

    static readDir(path) {
        return fs.readdirSync(path);
    }

    static getFile(filename) {
        try {
            const data = fs.readFileSync(filename, 'utf8');
            return data;
        } catch (err) {
            return false;
        }
    }

    static getFilePath(filename) {
        let exists = false;
        let path;
        let tried = 0;

        while (!path && tried < 3) {
            switch (tried) {
                case 0:
                    path = filename;
                    break;
                case 1:
                    path = `${__dirname}\\..\\${filename}`;
                    break;
                default:
                    path = `${__dirname}\\${filename}`;
                    break;
            }

            exists = FileManager.fileExists(path);
            tried += 1;
        }

        return exists === true ? path : false;
    }

    static fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    static getFileExtension(filePath) {
        return p.extname(filePath);
    }
};
