/* expr: true */
;
(function () {

    var fs = require('fs'),
        __f = require('sprintf-js').sprintf,
        touch = require('touch'),
        Q = require('Q'),


        /**
         * @class LastExecutionTime
         * @constructor
         */
        LastExecutionTime = function () {
            var targetDirectory = this.targetDirectory = process.cwd();
            this.packageJson = targetDirectory + '/package';
            var name, stamp = this.stamp = new Date();
            try {
                name = require(this.packageJson).name;
            }
            catch (ex) {
                name = process.argv[1].replace(/.+\/(.+)/, '$1');
            }
            finally {
                this.targetFile = __f('%s/.%s', this.targetDirectory, name.replace(/\s+/, '-'));
            }
            this.touchSync(stamp);
        },
    /*
     * public api
     */
        proto = {
            /**
             * Gets the last execution time.
             * @return {Date} last execution time.
             */
            get: function () {
                return new Date(this.stamp.getTime());
            },
            /**
             * Gets the path to the file used to track the last execution time.
             * @returns {String} path to the timestamp file.
             */
            getFilePath: function () {
                return this.targetFile;
            },
            /**
             * Updates the last execution time.
             * @param date {Date,Number} new execution time.  if a `Number`, assumes millis.
             * @return {Q.promise} promise.
             */
            touch: function (date) {
                var deferred = Q.defer();

                touch(this.targetFile, {
                    time: date.getTime()
                }, function (err) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve();
                });
                return deferred.promise;
            },
            /**
             * Sync version of `touch`
             * @param date {Date,Number} new execution time.  if a `Number`, assumes millis.
             */
            touchSync: function(date) {
                touch.sync(this.targetFile, {
                    time:date.getTime()
                });
            }
        };

    LastExecutionTime.prototype = proto;
    module.exports = LastExecutionTime;

}).call(this);