import S3DPathBuilder from "../Path/Path";
import S3DPrimitiveRevolve from "./Revolve";
import {S3DPrimitiveData} from "./Primitive";

export interface S3DPrimitiveSphereProps {
    layerStartAngle: number,
    layerEndAngle: number,
    layerSteps: number,
    sliceStartAngle: number,
    sliceEndAngle: number,
    sliceSteps: number,
    layerCcw?: boolean
    sliceCcw?: boolean
}

export default function S3DPrimitiveSphere(
    {
        layerStartAngle,
        layerEndAngle,
        layerSteps,
        sliceStartAngle,
        sliceEndAngle,
        sliceSteps,
        layerCcw,
        sliceCcw
    }: S3DPrimitiveSphereProps
): S3DPrimitiveData {
    return S3DPrimitiveRevolve({
        path: S3DPathBuilder.arc(
            layerStartAngle,
            layerEndAngle,
            layerSteps,
            layerCcw
        ),
        startAngle: sliceStartAngle,
        endAngle: sliceEndAngle,
        steps: sliceSteps,
        ccw: sliceCcw
    });
}