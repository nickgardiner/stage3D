import S3DBufferData, {S3DBufferDataPropsMap, S3DBufferDataMap, createS3DBufferDataMap} from "./Data";
import {BufferConfig} from "../../../../Config/Buffer";

export interface S3DBufferPropsMap {
    [name: string]: S3DBufferDataPropsMap;
}

export interface S3DBufferMap {
    [name: string]: S3DBuffer;
}
const createS3DBufferMap = <M extends S3DBufferMap>(buffers: M) => buffers;

export default class S3DBuffer {
    public static initialize(): S3DBufferMap {
        const buffer = createS3DBufferMap({}) as S3DBufferMap;
        for (let name in BufferConfig) {
            buffer[name] = new S3DBuffer(BufferConfig[name]);
        }

        return buffer;
    }

    public static finalize(buffer:S3DBufferMap): void {
        for (let name in buffer) {
            buffer[name].bindData();
        }
    }

    public bufferData: S3DBufferDataMap;

    constructor(props:S3DBufferDataPropsMap) {
        this.bufferData = createS3DBufferDataMap({}) as S3DBufferDataMap;

        for (let bufferName in props) {
            this.bufferData[bufferName] = new S3DBufferData(props[bufferName]);
        }
    }

    bindData(): void {
        for (let name in this.bufferData) {
            this.bufferData[name].bindData();
        }
    }
}