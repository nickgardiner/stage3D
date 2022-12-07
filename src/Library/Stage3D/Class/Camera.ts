import S3DMatrix from "../Service/Matrix";
import S3DPoint from "../Service/Point";

interface S3DCameraProps {
    translation?: S3DPoint;
    rotation?: S3DPoint;
}

export class S3DCamera {
    protected view: DOMMatrix;
    public translation: S3DPoint;
    public rotation: S3DPoint;

    public matrix: DOMMatrix;

    constructor({translation, rotation}: S3DCameraProps) {
        this.view = new DOMMatrix();
        this.matrix = new DOMMatrix();

        this.translation = translation || new S3DPoint();
        this.rotation = rotation || new S3DPoint();

        this.updateMatrix();
    }

    rotate(x: number, y: number): void {
        if (y !== 0) {
            this.rotation.x += y * 0.2;
            if (this.rotation.x < -90) {
                this.rotation.x = -90;
            } else if (this.rotation.x >= 90) {
                this.rotation.x = 90;
            }
        }

        if (x !== 0) {
            this.rotation.y += x * 0.2;
            if (this.rotation.y < 0) {
                this.rotation.y += 360;
            } else if (this.rotation.y >= 360) {
                this.rotation.y -= 360;
            }
        }

        this.updateMatrix();
    }

    translate(x:number, y:number, z:number, amount:number): void {
        const direction = new S3DPoint();

        if (x !== 0) {
            direction.addSelf(
                this.matrix.m11 * x,
                this.matrix.m21 * x,
                this.matrix.m31 * x
            );
        }

        if (y !== 0) {
            direction.y += y;
        }

        if (z !== 0) {
            direction.addSelf(
                this.matrix.m13 * z,
                this.matrix.m23 * z,
                this.matrix.m33 * z
            );
        }

        direction.normalizeSelf().scaleSelf(amount, amount, amount);
        this.translation.addSelf(direction);

        this.updateMatrix();
    }

    updateAspect(aspect:number) {
    }

    updateMatrix(): void {
        this.matrix = DOMMatrix.fromMatrix(this.view);

        this.matrix.rotateSelf(this.rotation.x, 0, 0);
        this.matrix.rotateSelf(0, this.rotation.y, 0);
        this.matrix.translateSelf(this.translation.x, this.translation.y, this.translation.z);
    }
}

interface S3DCameraPerspectiveProps extends S3DCameraProps{
    fov: number;
    aspect: number;
    near: number;
    far: number;
    distance?: number;
}

export class S3DCameraPerspective extends S3DCamera{
    private fov: number;
    private aspect: number;
    private near: number;
    private far: number;
    private distance: number;

    constructor({fov, aspect, near, far, distance, translation, rotation}: S3DCameraPerspectiveProps) {
        super({translation, rotation});

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.distance = distance || 0;

        this.view = S3DMatrix.perspective(this.fov, this.aspect, this.near, this.far);

        this.updateMatrix();
    }

    updateAspect(aspect:number): void {
        this.aspect = aspect;
        this.view = S3DMatrix.perspective(this.fov, this.aspect, this.near, this.far);
        this.updateMatrix();
    };

    updateMatrix(): void {
        this.matrix = DOMMatrix.fromMatrix(this.view);

        this.matrix.translateSelf(0, 0, -this.distance);
        this.matrix.rotateSelf(this.rotation.x, 0, 0);
        this.matrix.rotateSelf(0, this.rotation.y, 0);
        this.matrix.translateSelf(this.translation.x, this.translation.y, this.translation.z);
    }
}