import S3DSurface from "../Surface";
import {S3DPrimitiveData} from "./Primitive";
import {S3DPath} from "../Path/Path";

export interface S3DPrimitiveLineProps {
    path: S3DPath;
}

export default function S3DPrimitiveLine({path}: S3DPrimitiveLineProps): S3DPrimitiveData {
    const data = {
        type: S3DSurface.gl.LINE_STRIP,
        index: [],
        vertex: [],
        color: [],
        normal: [],
        texture: [],
    } as S3DPrimitiveData;

    for (let i = 0; i < path.node.length; i ++) {
        data.index.push(data.index.length);
        data.vertex.push(path.node[i].vertex.x, path.node[i].vertex.y, path.node[i].vertex.z);
        data.color!.push(1, 1, 1, 1);
        data.normal!.push(path.node[i].normal.x, path.node[i].normal.y, path.node[i].normal.z);
        data.texture!.push(0, 0);
    }

    return data;
}