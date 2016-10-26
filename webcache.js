var request = require("request");
var expressrunner = require("express-runner");
var app = expressrunner.app;

var cache = {}; // TODO: replace with couchdb

app.use(expressrunner.express.static(__dirname + '/test/public'));

app.get("/", function (req, resp) {
    //console.log("GET path: "+req.path+", url: "+req.query.url);

    var url = req.query.url;
    var agent = req.query.agent || "default";

    if (!url) return resp.status(400).send("no query url");

    getEntry({url:url, agent:agent}, function (err, entry) {
        if (err) {
            console.log("GET "+url+" ERROR: "+err);
            resp.status(500).send(err);
        }
        else {
            //console.log("GET "+url+" ==> "+entry.statusCode+" | ",entry.headers);
            resp.set(entry.headers).status(entry.statusCode).send(entry.body);
        }
    });
});

app.get("/entries/count", function (req, resp) {
    resp.json(Object.keys(cache).length);
});

function getEntry(opts, callback) {
    var cacheKey = getCacheKey(opts);
    var entry = cache[cacheKey];
    if (entry) return callback(undefined, entry);

    request({url:opts.url}, function (err, response, body) {
        if (err) return callback(err);

        entry = {
            statusCode: response.statusCode,
            headers: response.headers,
            body: response.body
        };

        cache[cacheKey] = entry;

        return callback(undefined, entry);
    });
}

function getCacheKey(opts) {
    return JSON.stringify(opts);
}

// exports

module.exports = expressrunner;

// server mode, called directly

if (require.main === module) {
    module.exports.start();
}
