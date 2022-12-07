import S3DMatrix from "../../Service/Matrix";
import S3DPoint from "../../Service/Point";

export interface S3DPath {
    node: S3DPathNode[];
    length: number;
}

export interface S3DPathNode {
    vertex: S3DPoint;
    normal: S3DPoint;
    length: number;
}

export default class S3DPathBuilder {
    public static setLengths(path:S3DPath) {
        path.length = 0;

        for (let i = 0; i < path.node.length; i ++) {
            if (i > 0) {
                const delta = path.node[i].vertex.sub(path.node[i - 1].vertex);
                path.length += delta.magnitude();
                path.node[i].length = path.length;
            }
        }
    }

    private static transform(path:S3DPathNode[], transform:DOMMatrix): void {
        const rotation = S3DMatrix.extractRotation(transform);

        for (let i = 0; i < path.length; i ++) {
            path[i].vertex = S3DPoint.get(transform.transformPoint(path[i].vertex));
            path[i].normal = S3DPoint.get(rotation.transformPoint(path[i].normal));
        }
    }

    public static merge(pathA:S3DPathNode[], pathB:S3DPathNode[]): S3DPathNode[] {
        return pathA.concat(pathB);
    }

    public static arc(
        startAngle: number,
        endAngle: number,
        steps: number,
        ccw?: boolean,
        transform?: DOMMatrix
    ): S3DPath {
        const node = [] as S3DPathNode[];
        const increment = (endAngle - startAngle) / steps * (ccw === true ? -1 : 1);
        const vec = new S3DPoint();

        for (let i = 0; i <= steps; i ++) {
            const angle = i * increment + startAngle;

            vec.x = Math.sin(angle);
            vec.y = -Math.cos(angle);

            node.push({
                vertex: new S3DPoint(vec.x, vec.y, 0),
                normal: new S3DPoint(vec.x, vec.y, 0),
                length: 0
            });
        }

        if (transform) {
            S3DPathBuilder.transform(node, transform);
        }

        const path = {
            node: node,
            length: 0
        } as S3DPath;

        S3DPathBuilder.setLengths(path);

        return path;
    }
}