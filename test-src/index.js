
const assert = require('assert');

const rfc7469 = require('../');

describe("RFC 7469", function() {

  describe("generate should create the correct header", function() {

    it("for singular pin", function() {

      let result = rfc7469.generate({
        maxAge: 1234,
        pins: [ "hello" ]
      });

      assert.equal(result, 'max-age=1234;pin-sha256="hello";');

    });

    it("for multiple pins", function() {

      let result = rfc7469.generate({
        maxAge: 1234,
        pins: [ "hello", "world" ]
      });

      assert.equal(result, 'max-age=1234;pin-sha256="hello";pin-sha256="world";');

    });

    it("for report-uri", function() {

      let result = rfc7469.generate({
        maxAge: 123456,
        pins: [ "test" ],
        reportURI: "http://report.uri"
      });

      assert.equal(result, 'max-age=123456;pin-sha256="test";report-uri="http://report.uri";');

    });

    it("for includeSubdomains", function() {

      let result = rfc7469.generate({
        maxAge: 123456,
        pins: [ "test", "another" ],
        includeSubdomains: true
      });

      assert.equal(result, 'max-age=123456;pin-sha256="test";pin-sha256="another";includeSubDomains');

    });

  });

  describe("Middleware", function() {

    it("should require maxAge option", function() { 
      assert.throws(function() {
        rfc7469();
      }, /RFC7469 requires a maxAge option/);
    });

    it("should require maxAge to be a number", function() {
      assert.throws(function() {
        rfc7469({
          maxAge: "1"
        });
      }, /maxAge must be a valid number/);
    });

    it("should correctly set header on response", function(done) {

      let res = {
        set(header, value) {
          assert.equal(header, "Public-Key-Pins");
          assert.equal(value, 'max-age=1234;pin-sha256="hello";includeSubDomains');
          done();
        }
      }

      rfc7469({
        maxAge: 1234,
        pins: [ "hello" ],
        includeSubdomains: true
      })({}, res, () => {});

    });

    it("should generate reportOnly header if called", function(done) {

      let res = {
        set(header, value) {
          assert.equal(header, "Public-Key-Pins-Report-Only");
          assert.equal(value, 'max-age=12345;pin-sha256="test";');
          done();
        }
      }

      rfc7469({
        maxAge: 12345,
        pins: [ "test" ]
      }).reportOnly()({}, res, () => {});

    });

  });

});
