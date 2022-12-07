import S3DSurface from "../Surface";
import S3DBuffer from "./Buffer";

export default class S3DBufferEntity {
    private buffer: S3DBuffer
    private type: number;
    private offset: number;
    private count: number;

    constructor(buffer:S3DBuffer, type:number, offset:number, count:number) {
        this.buffer = buffer;
        this.type = type;
        this.offset = offset;
        this.count = count;
    }

    draw(): void {
        S3DSurface.gl.drawElements(this.type, this.count, S3DSurface.gl.UNSIGNED_SHORT, this.offset);
    }
}