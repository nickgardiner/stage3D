import S3DSurface from "../Surface";
import {S3DPrimitiveData} from "./Primitive";
import S3DPoint from "../../Service/Point";

export interface S3DPrimitiveGridProps {
    cells: S3DPoint;
    size: number;
}

export default function S3DPrimitiveGrid({cells, size}: S3DPrimitiveGridProps): S3DPrimitiveData {
    const half = new S3DPoint(cells.x * size * 0.5, 0, cells.y * size * 0.5);

    const data = {
        type: S3DSurface.gl.LINES,
        index: [],
        vertex: [],
        color: [],
        normal: [],
        texture: [],
    } as S3DPrimitiveData;

    for (let x = 0; x < cells.x + 1; x ++) {
        data.index.push(data.index.length);
        data.vertex.push(x * size - half.x, 0, -half.z);
        data.color!.push(0, 0, 0, 1);
        data.normal!.push(0, 1, 0);
        data.texture!.push(0, 0);

        data.index.push(data.index.length);
        data.vertex.push(x * size - half.x, 0, half.z);
        data.color!.push(0, 0, 0, 1);
        data.normal!.push(0, 1, 0);
        data.texture!.push(0, 0);
    }

    for (let z = 0; z < cells.y + 1; z ++) {
        data.index.push(data.index.length);
        data.vertex.push(-half.x, 0, z * size - half.z);
        data.color!.push(0, 0, 0, 1);
        data.normal!.push(0, 1, 0);
        data.texture!.push(0, 0);

        data.index.push(data.index.length);
        data.vertex.push(half.x, 0, z * size - half.z);
        data.color!.push(0, 0, 0, 1);
        data.normal!.push(0, 1, 0);
        data.texture!.push(0, 0);
    }

    return data;
}