import S3DSurface from "../Surface";

interface S3DBufferDataProps {
    type: string;
    size: number;
    bytes: number;
    data: number[];
}
export interface S3DBufferDataPropsMap {
    [name: string]: S3DBufferDataProps;
}

export interface S3DBufferDataMap {
    [name: string]: S3DBufferData;
}
export const createS3DBufferDataMap = <M extends S3DBufferDataMap>(bufferData: M) => bufferData;

export default class S3DBufferData {
    private static getGlType(type:string): number {
        switch (type) {
            case 'ELEMENT_ARRAY_BUFFER':
                return S3DSurface.gl.ELEMENT_ARRAY_BUFFER;

            case 'ARRAY_BUFFER':
                return S3DSurface.gl.ARRAY_BUFFER;

            default:
                throw new Error(`BufferData: invalid buffer type ${type}`);
        }
    }

    private glName?: WebGLBuffer;
    private readonly glType: number;
    private glData?: Float32Array | Uint16Array | Uint8Array;

    public size: number;
    public bytes: number;
    public data: number[];

    constructor({type, size, bytes, data}: S3DBufferDataProps) {
        this.glType = S3DBufferData.getGlType(type);
        this.size = size;
        this.bytes = bytes;
        this.data = data;
    }

    bind(): void {
        if (!this.glName) {
            const glName = S3DSurface.gl.createBuffer();
            if (!glName) {
                throw new Error('S3DBufferData: createBuffer failed');
            }
            this.glName = glName;
        }

        S3DSurface.gl.bindBuffer(this.glType, this.glName);
    }

    bindData(): void {
        this.bind();
        S3DSurface.gl.bufferData(this.glType, this.getGlData(), S3DSurface.gl.STATIC_DRAW);
    }

    getGlData(): Float32Array | Uint16Array | Uint8Array {
        switch (this.size) {
            case 16:
                if (!this.glData) {
                    this.glData = new Uint16Array(this.data);
                }
                break;

            case 32:
                if (!this.glData) {
                    this.glData = new Float32Array(this.data);
                }
                break;

            default:
                throw new Error('S3DBufferData: invalid buffer size');
        }

        return this.glData;
    }
}