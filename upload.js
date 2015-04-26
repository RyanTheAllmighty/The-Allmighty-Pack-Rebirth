var env = require('node-env-file');
var request = require('request');
var fs = require('fs');
var archiver = require('archiver');

env(__dirname + '/.env');

// Deal with the XML

fs.readFile('pack.xml', function(err, contents) {
    if (err) {
        return console.error(err);
    }

    request.put({
        url: 'https://api.atlauncher.com/v1/admin/pack/' + process.env.PACK + '/versions/' + process.env.VERSION + '/xml',
        headers: {
            'API-KEY': process.env.API_KEY,
            'Content-Type': 'application/json'
        },
        json: true,
        body: {
            data: new Buffer(contents).toString('base64')
        }
    }, function (error, response, body) {
        console.log(body);
    });
});

// Deal with the configs

var output = fs.createWriteStream(__dirname + '/configs.zip');
var archive = archiver('zip');
archive.pipe(output);
archive.directory('configs', false, { date: new Date() }).finalize();

output.on('close', function() {
    fs.readFile('configs.zip', function(err, contents) {
        if (err) {
            return console.error(err);
        }

        request.put({
            url: 'https://api.atlauncher.com/v1/admin/pack/' + process.env.PACK + '/versions/' + process.env.VERSION + '/configs',
            headers: {
                'API-KEY': process.env.API_KEY,
                'Content-Type': 'application/json'
            },
            json: true,
            body: {
                data: new Buffer(contents).toString('base64')
            }
        }, function (error, response, body) {
            console.log(body);

            fs.unlink('configs.zip');
        });
    });
});