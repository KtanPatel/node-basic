const fs = require("fs");
const path = require("path");
const baseUrl = '';
exports.removeFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(baseUrl, fileName), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(fileName);
            }
        });
    })
}