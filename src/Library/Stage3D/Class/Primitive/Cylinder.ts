import S3DPrimitiveRevolve from "./Revolve";
import {S3DPrimitiveData} from "./Primitive";
import S3DPoint from "../../Service/Point";
import S3DPathBuilder, {S3DPathNode, S3DPath} from "../Path/Path";

export interface S3DPrimitiveCylinderProps {
    height: number;
    radiusTop: number;
    radiusBottom: number;
    sliceStartAngle: number,
    sliceEndAngle: number,
    sliceSteps: number,
    sliceCcw?: boolean
}

export default function S3DPrimitiveCylinder(
    {
        height,
        radiusTop,
        radiusBottom,
        sliceStartAngle,
        sliceEndAngle,
        sliceSteps,
        sliceCcw
    }: S3DPrimitiveCylinderProps
): S3DPrimitiveData {
    const half = height * 0.5;
    const top = new S3DPoint(radiusTop, half, 0);
    const bottom = new S3DPoint(radiusBottom, -half, 0);
    const normal = new S3DPoint(bottom.x, bottom.y, bottom.z)
        .subSelf(top)
        .normalizeSelf();

    const x = normal.x;
    normal.x = -normal.y;
    normal.y = x;

    const path = {
        node: [
            {
                vertex: new S3DPoint(0, -half, 0),
                normal: new S3DPoint(0, -1, 0),
                length: 0
            } as S3DPathNode,
            {
                vertex: bottom,
                normal: normal,
                length: 0
            } as S3DPathNode,
            {
                vertex: top,
                normal: normal,
                length: 0
            } as S3DPathNode,
            {
                vertex: new S3DPoint(0, half, 0),
                normal: new S3DPoint(0, 1, 0),
                length: 0
            } as S3DPathNode,
        ] as S3DPathNode[],
        length: 0
    } as S3DPath;
    S3DPathBuilder.setLengths(path);

    return S3DPrimitiveRevolve({
        path: path,
        startAngle: sliceStartAngle,
        endAngle: sliceEndAngle,
        steps: sliceSteps,
        ccw: sliceCcw
    });
}