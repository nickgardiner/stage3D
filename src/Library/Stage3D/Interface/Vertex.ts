import S3DPoint from "../Service/Point";

export default interface S3DVertex {
    vertex: S3DPoint;
    color?: S3DPoint;
    normal: S3DPoint;
    texture: S3DPoint;
}