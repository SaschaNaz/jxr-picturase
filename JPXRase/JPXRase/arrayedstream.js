var JxrPicturase;
(function (JxrPicturase) {
    var ArrayedStream = (function () {
        function ArrayedStream(file) {
            this.filearray = new Uint8Array(file);
            this.index = 0;
        }
        ArrayedStream.prototype.readAsArray = function (length) {
            var indexbefore = this.index;
            var indexafter = this.index + length;
            if (indexafter <= this.filearray.length) {
                this.index = indexafter;
                return this.filearray.subarray(indexbefore, indexafter);
            } else
                throw "File reached to the end.";
        };

        ArrayedStream.prototype.readAsUint8 = function () {
            return this.readAsUintArbitrary(1);
        };

        //little endian
        ArrayedStream.prototype.readAsUint16 = function () {
            return this.readAsUintArbitrary(2);
        };

        //little endian
        ArrayedStream.prototype.readAsUint32 = function () {
            return this.readAsUintArbitrary(4);
        };

        ArrayedStream.prototype.readAsUintArbitrary = function (bytes) {
            if (this.index + bytes <= this.filearray.length) {
                var uint = 0;
                for (var i = 0; i < bytes; i++)
                    uint += (this.filearray[this.index + i] << (i * 8));
                this.index += bytes;
                return uint;
            } else
                throw "File reached to the end.";
        };

        ArrayedStream.prototype.readAsGuidHexString = function () {
            var arrayToHex = function (i) {
                return i.toString(16).toUpperCase();
            };

            var guid1 = (Array.prototype.map.apply(this.readAsArray(4), arrayToHex)).reverse();
            var guid2 = (Array.prototype.map.apply(this.readAsArray(4), arrayToHex)).reverse();
            var guid3 = (Array.prototype.map.apply(this.readAsArray(4), arrayToHex)).reverse();
            var guid4 = (Array.prototype.map.apply(this.readAsArray(4), arrayToHex));
            var guid = "";
            guid = String.prototype.concat.apply(guid, guid1);
            guid = String.prototype.concat.apply(guid, guid2);
            guid = String.prototype.concat.apply(guid, guid3);
            guid = String.prototype.concat.apply(guid, guid4);
            return guid;
        };

        ArrayedStream.prototype.readAsText = function (length) {
            return String.fromCharCode.apply(null, this.readAsArray(length));
        };

        ArrayedStream.prototype.moveBy = function (length) {
            var indexafter = this.index + length;
            if (indexafter >= 0 && indexafter <= this.filearray.length)
                this.index = indexafter; else
                throw "The stream couldn't seek that position.";
        };

        ArrayedStream.prototype.seek = function (position) {
            if (position >= 0 && position <= this.filearray.length)
                this.index = position; else
                throw "The stream couldn't seek that position.";
        };

        ArrayedStream.prototype.getCurrentPosition = function () {
            return this.index;
        };
        return ArrayedStream;
    })();
    JxrPicturase.ArrayedStream = ArrayedStream;
})(JxrPicturase || (JxrPicturase = {}));
//@ sourceMappingURL=arrayedstream.js.map
