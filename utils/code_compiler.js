const axios = require("axios");
require('dotenv').config();
const host = process.env.COMPILER_URL;
const WAIT = true;

// const code = 
// `
// `
// const input =
// `1000`

// const output =
// `Hello World!`

exports.get_languages = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${host}/languages/all`);
            resolve(response.data);
        } catch (error) {
            reject(error);
        }
    });
}

exports.send_submission = async (source_code, language_id, stdin, expected_output) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            source_code: source_code,
            language_id: language_id,
            stdin: stdin,
            expected_output: expected_output
        };

        const options = {
        method: 'POST',
        url: `${host}/submissions`,
        params: {base64_encoded: 'true', wait:'true', fields: '*'},
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
        },
        data: data
        };

        axios.request(options).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

exports.get_submission = async (token) => {
    return new Promise(async (resolve, reject) => {

        const options = {
            method: 'GET',
            url: `${host}/submissions/${token}`,
            params: {base64_encoded: 'false', fields: '*'},
            headers: {
            }
        };

        axios.request(options).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

exports.convert_to_base_64 = async (string) => {
    return new Buffer.from(string).toString('base64');
}

exports.convert_base_64_to_string = async (base64_string) => {
    return new Buffer.from(base64_string, 'base64').toString('ascii');
}

exports.convert_response_to_string = async (response) => {
    return new Promise(async (resolve, reject) => {
        try {
            keys_to_convert = ['source_code', 'stdin', 'expected_output', 'stdout', 'stderr', 'message'];
            for (const key in response) {
                if (keys_to_convert.includes(key)) {
                    const element = response[key];
                    if (typeof element === 'string') {
                        response[key] = await this.convert_base_64_to_string(element);
                    }
                }
            }
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.get_immediete_result = async (source_code, language_id, stdin, expected_output) => {
    return new Promise(async (resolve, reject) => {
        try {
            const submission = await exports.send_submission(source_code, language_id, stdin, expected_output);
            const response = await exports.convert_response_to_string(submission);
            resolve(response);
        }
        catch (error) {
            reject(error);
        }
    });
}

// async function main() {
//     let source_code = await exports.convert_to_base_64(code);
//     const language_id = 71;
//     var stdin = await exports.convert_to_base_64(input);
//     var expected_output = await exports.convert_to_base_64(output);
//     const submission = await exports.send_submission(source_code, language_id, stdin, expected_output);
//     const response = await exports.convert_response_to_string(submission);
//     console.log(response);
    // await exports.sleep(1000);

    // const token = submission.token;
    // const submission_status = await exports.get_submission(token);
    // console.log(submission_status);
    // const message = await exports.convert_base_64_to_string(submission_status.message);

    // console.log(submission_status);
    // console.log(message);
// }

// main();

// for(let i = 0; i < 1; i++) {
//     console.log(i);
//     main();
// }