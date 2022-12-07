interface S3DKeyMap {
    [key: string]: boolean;
}
const createS3DKeyMap = <M extends S3DKeyMap>(keys: M) => keys;

export default class S3DKeyboard {
    private keyMap: S3DKeyMap;

    constructor() {
        this.keyMap = createS3DKeyMap({});
    }

    clear(): void {
        this.keyMap = createS3DKeyMap({});
    }

    press(key:string): void {
        if (!this.keyMap[key]) {
            this.keyMap[key] = true;
        }
    }

    release(key:string): void {
        if (this.keyMap[key]) {
            delete this.keyMap[key];
        }
    }

    test(key:string): boolean {
        return this.keyMap[key] !== undefined;
    }
}