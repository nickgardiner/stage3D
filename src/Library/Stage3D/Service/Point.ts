export default class S3DPoint extends DOMPoint {
    static dot(x:number, y: number, z?:number): number {
        return z === undefined
            ? x * x + y * y
            : x * x + y * y + z * z;
    }

    static get(pt:DOMPoint): S3DPoint {
        return new S3DPoint(pt.x, pt.y, pt.z, pt.w);
    }

    static magnitude(x:number, y: number, z?:number): number {
        return Math.sqrt(S3DPoint.dot(x, y, z));
    }

    static normalize(x:number, y: number, z?:number): S3DPoint {
        const m = S3DPoint.magnitude(x, y, z);
        const u = new S3DPoint(
            m === 0 ? 0 : x / m,
            m === 0 ? 0 : y / m
        );

        if (z !== undefined) {
            u.z = m === 0 ? 0 : z / m;
        }

        return u;
    }

    add(x:number, y:number, z:number): S3DPoint;
    add(pt:DOMPoint): S3DPoint;
    add(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        return x instanceof DOMPoint
            ? this.clone().addSelf(x)
            : this.clone().addSelf(x, y!, z!);
    }

    addSelf(x:number, y:number, z:number): S3DPoint;
    addSelf(pt:DOMPoint): S3DPoint;
    addSelf(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        if (x instanceof DOMPoint) {
            this.x += x.x;
            this.y += x.y;
            this.z += x.z;
        } else {
            this.x += x;
            this.y += y!;
            this.z += z!;
        }

        return this;
    }

    clone(): S3DPoint {
        return new S3DPoint(this.x, this.y, this.z, this.w);
    }

    cross(x:number, y:number, z:number): S3DPoint;
    cross(pt:DOMPoint): S3DPoint;
    cross(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        return x instanceof DOMPoint
            ? this.clone().crossSelf(x)
            : this.clone().crossSelf(x, y!, z!);
    }

    crossSelf(x:number, y:number, z:number): S3DPoint;
    crossSelf(pt:DOMPoint): S3DPoint;
    crossSelf(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        if (x instanceof DOMPoint) {
            this.x = this.y * x.z - this.z * x.y;
            this.y = this.z * x.x - this.x * x.z;
            this.z = this.x * x.y - this.y * x.x;
        } else {
            this.x = this.y * z! - this.z * y!;
            this.y = this.z * x - this.x * z!;
            this.z = this.x * y! - this.y * x;
        }

        return this;
    }

    dot(x:number, y:number, z:number): number;
    dot(pt:DOMPoint): number;
    dot(x:number|DOMPoint, y?:number, z?:number): number {
        if (x instanceof DOMPoint) {
            return this.x * x.x + this.y * x.y + this.z * x.z;
        }

        return this.x * x + this.y * y! + this.z * z!;
    }

    magnitude(): number {
        return Math.sqrt(this.dot(this));
    }

    scale(amount:number): S3DPoint;
    scale(x:number, y:number, z:number): S3DPoint;
    scale(pt:DOMPoint): S3DPoint;
    scale(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        if (x instanceof DOMPoint) {
            return this.clone().scaleSelf(x);
        }

        if (y !== undefined && z !== undefined) {
            return this.clone().scaleSelf(x, y, z);
        }

        return this.clone().scaleSelf(x);
    }

    scaleSelf(amount:number): S3DPoint;
    scaleSelf(x:number, y:number, z:number): S3DPoint;
    scaleSelf(pt:DOMPoint): S3DPoint;
    scaleSelf(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        if (x instanceof DOMPoint) {
            this.x *= x.x;
            this.y *= x.y;
            this.z *= x.z;
        } else {
            this.x *= x;
            this.y *= y === undefined ? x : y;
            this.z *= z === undefined ? x : z;
        }

        return this;
    }

    sub(x:number, y:number, z:number): S3DPoint;
    sub(pt:DOMPoint): S3DPoint;
    sub(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        return x instanceof DOMPoint
            ? this.clone().subSelf(x)
            : this.clone().subSelf(x, y!, z!);
    }

    subSelf(x:number, y:number, z:number): S3DPoint;
    subSelf(pt:DOMPoint): S3DPoint;
    subSelf(x:number|DOMPoint, y?:number, z?:number): S3DPoint {
        if (x instanceof DOMPoint) {
            this.x -= x.x;
            this.y -= x.y;
            this.z -= x.z;
        } else {
            this.x -= x;
            this.y -= y!;
            this.z -= z!;
        }

        return this;
    }

    normalize(): S3DPoint {
        return this.clone().normalizeSelf();
    }

    normalizeSelf(): S3DPoint {
        const m = this.magnitude();

        this.x = m === 0 ? 0 : this.x / m;
        this.y = m === 0 ? 0 : this.y / m;
        this.z = m === 0 ? 0 : this.z / m;

        return this;
    }
}