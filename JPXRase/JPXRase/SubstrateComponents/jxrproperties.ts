///<reference path="../arrayedstream.ts"/>
///<reference path="ifdtag.ts"/>
module JxrPicturase.SubstrateComponents {
    export class PropertyReader {
        constructor(public basestream: ArrayedStream, public type: number, public count: number, public valueAsSubstream: ArrayedStream) {
            //if count is larger than 4, then the value is an offset rather than the property value.
            if (PropertyReader.getPropertyDataSize(this.type, this.count) > 4) {
                var offset = this.valueAsSubstream.readAsUint32();
                this.valueAsSubstream = this.basestream.duplicateStream();
                this.valueAsSubstream.seek(offset);
            }
        }
        
        static getPropertyDataSize(type: number, count: number) {
            var datasize: number;
            switch (type) {
                //case 0://reserved, not specified
                case DataType.Byte://byte
                case DataType.TextUtf8://utf8text
                case DataType.Int8://Signed byte
                case DataType.Undefined://Undefined
                    datasize = 1 * count; break;
                case DataType.Uint16://Uint16
                case DataType.Int16://Int16
                    datasize = 2 * count; break;
                case DataType.Uint32://UInt32
                case DataType.Int32://Int32
                case DataType.Float://Float
                    datasize = 4 * count; break;
                case DataType.URationalNumber://URationalNumber
                case DataType.RationalNumber://RationalNumber
                case DataType.Double://Double
                    datasize = 8 * count; break;
            }
            return datasize;
        }

        getTextPropertyFromStream() {
            if (this.type != DataType.TextUtf8 && this.type != DataType.Byte)
                throw 'Text is expected, but type ' + this.type.toString() + ' is observed. The only type exceptionally accepted is \'Byte\'.';

            var text: string;
            if (this.type == DataType.TextUtf8)
                text = this.valueAsSubstream.readAsUtf8Text(this.count);
            else
                text = this.valueAsSubstream.readAsUtf16Text(this.count);

            if (text.charCodeAt(text.length - 1) != 0)
                console.warn('Possibly invalid text property, as it is not properly terminated.');
            else
                text = text.substr(0, text.length - 1);
            
            return text;
        }

        getAnyUintPropertyFromStream() {
            if (this.type != DataType.Byte && this.type != DataType.Uint16 && this.type != DataType.Uint32) 
                throw 'Number is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != 1)
                throw 'length 1 is expected, but length ' + this.count + ' is observed';

            switch (this.type) {
                case DataType.Byte:
                    return this.valueAsSubstream.readAsUint8();
                case DataType.Uint16:
                    return this.valueAsSubstream.readAsUint16();
                case DataType.Uint32:
                    return this.valueAsSubstream.readAsUint32();
            }
        }

        getUint16PropertyFromStream() {
            if (this.type != DataType.Uint16)
                throw 'Uint16 is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != 1)
                throw 'length 1 is expected, but length ' + this.count + ' is observed';

            return this.valueAsSubstream.readAsUint16();
        }

        getUint32PropertyFromStream() {
            if (this.type != DataType.Uint32)
                throw 'Uint32 is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != 1)
                throw 'length 1 is expected, but length ' + this.count + ' is observed';

            return this.valueAsSubstream.readAsUint32();
        }

        getUint16ArrayFromStream() {
            if (this.type != DataType.Uint16)
                throw 'Uint16 is expected, but type ' + this.type.toString() + ' is observed';

            return this.valueAsSubstream.readAsUint16Array(this.count);
        }

        getUint16ArrayFromStreamFixedLength(length: number) {
            if (this.type != DataType.Uint16)
                throw 'Uint16 is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != length)
                throw 'length ' + length.toString() + ' is expected, but length ' + this.count + ' is observed';

            return this.valueAsSubstream.readAsUint16Array(this.count);
        }

        getFloatPropertyFromStream() {
            if (this.type != DataType.Float)
                throw 'Float is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != 1)
                throw 'length 1 is expected, but length ' + this.count + ' is observed';

            return this.valueAsSubstream.readAsFloat();
        }

        //getURationalPropertyFromStream() {
        //    if (this.type != DataType.URationalNumber)
        //        throw 'URationalNumber is expected, but type ' + this.type.toString() + ' is observed';
        //    if (this.count != 1)
        //        throw 'length 1 is expected, but length ' + this.count + ' is observed';

        //    return this.valueAsSubstream.readAsURationalNumber();
        //}

        getByteStreamFromStream() {
            return this.valueAsSubstream.readAsSubstream(this.count);
        }

        getByteStreamFromStreamFixedLength(length: number) {
            if (this.type != DataType.Byte)
                throw 'Byte is expected, but type ' + this.type.toString() + ' is observed';
            if (this.count != length)
                throw 'length ' + length.toString() + ' is expected, but length ' + this.count + ' is observed';

            return this.valueAsSubstream.readAsSubstream(this.count);
        }
    }
}