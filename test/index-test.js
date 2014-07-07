;
(function () {

    var fs = require('fs'),
        expect = require('chai').expect;

    describe('last-execution-time', function () {

        var LastExecutionTime = require('../lib'),
            lastExecutionTime;

        afterEach(function () {
            if (lastExecutionTime) {
                try {
                    fs.unlinkSync(lastExecutionTime.getFilePath());
                }
                catch (ex) {
                    // don't care.
                }
                lastExecutionTime = null;
            }
        });

        it('should create a new timestamp file', function (done) {
            lastExecutionTime = new LastExecutionTime();
            fs.stat(lastExecutionTime.getFilePath(), function (err, stats) {
                if (err) {
                    throw new Error(err);
                }
                expect(stats.isFile()).to.be.true;
                done();
            })
        });

        it('should create a file with the correct time stamp', function (done) {
            lastExecutionTime = new LastExecutionTime();
            fs.stat(lastExecutionTime.getFilePath(), function (err, stats) {
                if (err) {
                    throw new Error(err);
                }
                // file times have second precision so need to chop the ms.
                expect(
                    Math.floor(lastExecutionTime.get().getTime()/1000)
                ).to.equal(
                    Math.floor(stats.ctime.getTime()/1000)
                );
                done();
            });
        });
    });

}).call(this);