module JxrPicturase {
    export class JxrMessageLogger {
        static log(message: String) {
            console.log("JXR Picturase:", message);
        }

        static error(message: String) {
            console.error("JXR Picturase:", message);
        }

        static warn(message: String) {
            console.warn("JXR Picturase:", message);
        }
    }

    export class MessageStacker {
        stack(base: String, ...addings: String[]) {
            addings.forEach((str: String) => {
                base += "\r\n" + str;
            });
            return base;
        }
    }
}