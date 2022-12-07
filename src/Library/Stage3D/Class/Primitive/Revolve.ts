import S3DPrimitive, {S3DPrimitiveData} from "./Primitive";
import {S3DPath} from "../Path/Path";
import S3DMath from "../../Service/Math";
import S3DPoint from "../../Service/Point";
import S3DVertex from "../../Interface/Vertex";

export interface S3DPrimitiveRevolveProps {
    path: S3DPath,
    startAngle: number,
    endAngle: number,
    steps: number,
    ccw?: boolean
}

export default function S3DPrimitiveRevolve(
    {path, startAngle, endAngle, steps, ccw}: S3DPrimitiveRevolveProps
): S3DPrimitiveData {
    const grid = [] as S3DVertex[][];
    const increment = S3DMath.radiansToDegrees((endAngle - startAngle) / steps * (ccw === true ? 1 : -1));
    const transform = new DOMMatrix().rotateSelf(0, S3DMath.radiansToDegrees(startAngle), 0);

    for (let step = 0; step <= steps; step ++) {
        for (let i = 0; i < path.node.length; i ++) {
            if (grid.length === i) {
                grid[i] = [];
            }

            const node = {
                vertex: S3DPoint.get(transform.transformPoint(path.node[i].vertex)),
                normal: S3DPoint.get(transform.transformPoint(path.node[i].normal)),
                texture: new S3DPoint(1 - step / steps, 1 - path.node[i].length / path.length)//i / (path.node.length - 1))
            };

            if (ccw === true) {
                grid[i].push(node);
            } else {
                grid[i].unshift(node);
            }
        }

        transform.rotateSelf(0, increment, 0);
    }

    return S3DPrimitive.buildSkin(grid);
}