///<reference path="arrayedstream.ts"/>
///<reference path="formatids.ts"/>
module JxrPicturase {
    export class PropertyExporter {
        constructor(public stream: ArrayedStream, public type: number, public count: number, public valueAsSubstream: ArrayedStream) {
        }

        getTextPropertyFromStream() {
            try { } catch (e) { }
        }

        //should be able to receive all kinds of types
        private getAnyPropertyFromStream() {
            if (this.count == 0)
                return null;

            switch (this.type) {
                case DataTypeIds.TextUtf8: {
                    if (this.count <= 4)
                        return this.valueAsSubstream.readAsUtf8Text(this.count);
                    else {
                        var childStream = this.stream.duplicateStream();
                        childStream.seek(this.valueAsSubstream.readAsUint32());
                        return childStream.readAsUtf8Text(this.count);
                    }
                    break;
                }
                case DataTypeIds.Byte:
                case DataTypeIds.Undefined: {
                    return this.valueAsSubstream.readAsSubstream(this.count);
                    break;
                }
                case DataTypeIds.Uint16: {
                    if (this.count == 1) {
                        this.valueAsSubstream.moveBy(2);
                        return this.valueAsSubstream.readAsUint16();
                    }
                    else
                        return this.valueAsSubstream.readAsUint16Array(this.count);//no it's not uint32, it shouln't be as A.7.11 PAGE NUMBER uses real TWO numbers. Is it to be devided later?
                    break;
                }
                default: {
                    throw 'This property type is not supported yet.';
                }
            }
        }
    }
}