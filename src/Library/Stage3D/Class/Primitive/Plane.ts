import S3DSurface from "../Surface";
import {S3DPrimitiveData} from "./Primitive";
import S3DPoint from "../../Service/Point";

export interface S3DPrimitivePlaneProps {
    width: number;
    depth: number;
}

export default function S3DPrimitivePlane({width, depth}: S3DPrimitivePlaneProps): S3DPrimitiveData {
    const half = new S3DPoint(width * 0.5, 0, depth * 0.5);

    return {
        type: S3DSurface.gl.TRIANGLE_STRIP,
        index: [0, 1, 2, 3],
        vertex: [
            -half.x,  0, -half.z,
            half.x,  0, -half.z,
            -half.x,  0,  half.z,
            half.x,  0,  half.z,
        ],
        color: [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
        ],
        normal: [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
        ],
        texture: [
            1, 1,
            0, 1,
            1, 0,
            0, 0,
        ]
    };
}