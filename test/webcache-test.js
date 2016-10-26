require('chai').should();
const x = require("misc-tools");
const webcache = require("../webcache");

const WEBCACHE = "http://localhost:3000";
const TESTSITE1 = "http://localhost:3000/testsite1";

describe("webcache", function () {

    beforeEach(webcache.start);
    afterEach(webcache.stop);

    it("GET url caches the result", function () {
        x.getSync({url: WEBCACHE+"?url="+TESTSITE1+"/index.html"}).body.should.contain("<h1>test site 1</h1>");
        x.getSync({url: WEBCACHE+"?url="+TESTSITE1+"/index.html"}).body.should.contain("<h1>test site 1</h1>");
        x.getSync({url: WEBCACHE+"/entries/count", json:true}).body.should.eql(1);
    });

    it("loader agent is included in cache key", function () {
        x.getSync({url: WEBCACHE+"?agent=default&url="+TESTSITE1+"/index.html"}).body.should.contain("<h1>test site 1</h1>");
        x.getSync({url: WEBCACHE+"?agent=default2&url="+TESTSITE1+"/index.html"}).body.should.contain("<h1>test site 1</h1>");
        x.getSync({url: WEBCACHE+"/entries/count", json:true}).body.should.eql(2);
    });

    it("caches headers", function () {
        x.getSync({url: WEBCACHE+"?url="+TESTSITE1+"/index.html"}).headers['content-type'].should.eql("text/html; charset=utf-8");
        x.getSync({url: WEBCACHE+"?url="+TESTSITE1+"/index.html"}).headers['content-type'].should.eql("text/html; charset=utf-8");
    });

    // TODO: seq errs? retrys?

});