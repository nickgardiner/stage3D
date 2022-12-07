export default class S3DMath {
    public static twoPI = Math.PI * 2;

    public static radiansToDegrees(rad:number): number {
        return rad / S3DMath.twoPI * 360;
    }

    public static degreesToRadians(deg:number): number {
        return deg / 360 * S3DMath.twoPI;
    }
}