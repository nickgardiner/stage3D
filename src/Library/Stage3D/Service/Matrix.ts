import S3DPoint from "./Point";

export default class S3DMatrix {
    public static ortho(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ): DOMMatrix {
        const x = 2 / (right - left);
        const y = 2 / (top - bottom);
        const z = 2 / (far - near);
        // const a = (right + left) / (right - left);
        // const b = (top + bottom) / (top - bottom);
        // const c = (far + near) / (far - near);
        return new DOMMatrix([
            x, 0,  0, 0,
            0, y,  0, 0,
            0, 0, -z, 0,
            0, 0,  0, 1
        ]);
    }

    public static frustum(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ): DOMMatrix {
        const x = 2 * near / (right - left);
        const y = 2 * near / (top - bottom);
        const a = (right + left) / (right - left);
        const b = (top + bottom) / (top - bottom);
        const c = -(far + near) / (far - near);
        const d = -2 * far * near / (far - near);

        return new DOMMatrix([
            x, 0, 0,  0,
            0, y, 0,  0,
            a, b, c, -1,
            0, 0, d,  0
        ]);
    }

    public static perspective(
        fov: number,
        aspect: number,
        near: number,
        far: number
    ): DOMMatrix {
        const v = near * Math.tan(fov * Math.PI / 360.0);
        return S3DMatrix.frustum(v * -aspect, v * aspect, v, -v, near, far);
    }

    public static extractRotation(matrix:DOMMatrix): DOMMatrix {
        const xVec = new S3DPoint(matrix.m11, matrix.m12, matrix.m13).normalizeSelf();
        const yVec = new S3DPoint(matrix.m21, matrix.m22, matrix.m23).normalizeSelf();
        const zVec = new S3DPoint(matrix.m31, matrix.m32, matrix.m33).normalizeSelf();

        return new DOMMatrix([
            xVec.x, xVec.y, xVec.z, 0,
            yVec.x, yVec.y, yVec.z, 0,
            zVec.x, zVec.y, zVec.z, 0,
            0,      0,      0,      1
        ]);
    }
}