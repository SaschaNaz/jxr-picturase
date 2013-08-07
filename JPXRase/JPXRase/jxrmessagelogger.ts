module JxrPicturase {
    export class JxrMessageLogger {
        static log(message: string) {
            console.log("JXR Picturase:", message);
        }

        static error(message: string) {
            console.error("JXR Picturase:", message);
        }

        static warn(message: string) {
            console.warn("JXR Picturase:", message);
        }
    }

    export class MessageStacker {
        stack(base: string, ...addings: string[]) {
            addings.forEach((str: string) => {
                base += "\r\n" + str;
            });
            return base;
        }
    }
}