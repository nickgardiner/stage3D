import S3DSurface from "../Surface";
import {S3DPrimitiveData} from "./Primitive";
import S3DPoint from "../../Service/Point";

export interface S3DPrimitiveCubeProps {
    width: number;
    height: number;
    depth: number;
}

export default function S3DPrimitiveCube(
    {width, height, depth}: S3DPrimitiveCubeProps
): S3DPrimitiveData {
    const half = new S3DPoint(width * 0.5, height * 0.5, depth * 0.5);

    return {
        type: S3DSurface.gl.TRIANGLES,
        index: [
            0, 1, 2, 1, 3, 2, // front
            4, 5, 6, 5, 7, 6, // right
            8, 9, 10, 9, 11, 10, // back
            12, 13, 14, 13, 15, 14, // left
            16, 17, 18, 17, 19, 18, // top
            20, 21, 22, 21, 23, 22, // bottom
        ],
        vertex: [
            // front
            -half.x,  half.y,  half.z, // ftl
            half.x,  half.y,  half.z, // ftr
            -half.x, -half.y,  half.z, // fbl
            half.x, -half.y,  half.z, // fbr

            // right
            half.x,  half.y,  half.z, // ftr
            half.x,  half.y, -half.z, // btr
            half.x, -half.y,  half.z, // fbr
            half.x, -half.y, -half.z, // bbr

            // back
            half.x,  half.y, -half.z,  // btr
            -half.x,  half.y, -half.z, // btl
            half.x, -half.y, -half.z,  // bbr
            -half.x, -half.y, -half.z, // bbl

            // left
            -half.x,  half.y, -half.z, // btr
            -half.x,  half.y,  half.z, // ftr
            -half.x, -half.y, -half.z, // bbr
            -half.x, -half.y,  half.z, // fbr

            // top
            -half.x,  half.y, -half.z, // btl
            half.x,  half.y, -half.z,  // btr
            -half.x,  half.y,  half.z, // ftl
            half.x,  half.y,  half.z, // ftr

            // bottom
            -half.x,  -half.y,  half.z, // ftl
            half.x,  -half.y,  half.z, // ftr
            -half.x,  -half.y, -half.z, // btl
            half.x,  -half.y, -half.z,  // btr
        ],
        color: [
            // front
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            // right
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            // back
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            // left
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            // top
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,

            // bottom
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
        ],
        normal: [
            // front
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // right
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // back
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // left
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // top
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // bottom
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
        ],
        texture: [
            // front
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            // right
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            // back
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            // left
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            // top
            0, 0,
            1, 0,
            0, 1,
            1, 1,

            // bottom
            1, 0,
            0, 0,
            1, 1,
            0, 1,
        ]
    };
}