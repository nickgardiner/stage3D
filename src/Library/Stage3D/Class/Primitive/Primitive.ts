import S3DBuffer from "../Buffer/Buffer";
import S3DBufferEntity from "../Buffer/Entity";
import S3DPrimitiveCube, {S3DPrimitiveCubeProps} from "./Cube";
import S3DPrimitivePlane, {S3DPrimitivePlaneProps} from "./Plane";
import S3DPrimitiveGrid, {S3DPrimitiveGridProps} from "./Grid";
import S3DPrimitiveCylinder, {S3DPrimitiveCylinderProps} from "./Cylinder";
import S3DPrimitiveLine, {S3DPrimitiveLineProps} from "./Line";
import S3DPrimitiveRevolve, {S3DPrimitiveRevolveProps} from "./Revolve";
import S3DPrimitiveSphere, {S3DPrimitiveSphereProps} from "./Sphere";
import S3DMatrix from "../../Service/Matrix";
import S3DPoint from "../../Service/Point";
import S3DSurface from "../Surface";
import S3DVertex from "../../Interface/Vertex";

export interface S3DPrimitiveData {
    type: number;
    index: number[];
    vertex: number[];
    color?: number[];
    normal?: number[];
    texture?: number[];
}

export default class S3DPrimitive {
    private static transform2(data:number[], matrix:DOMMatrix) {
        for (let i = 0; i < data.length; i += 2) {
            const point = matrix.transformPoint(new S3DPoint(data[i], data[i + 1]));

            data[i] = point.x;
            data[i + 1] = point.y;
        }
    }

    private static transform3(data:number[], matrix:DOMMatrix) {
        for (let i = 0; i < data.length; i += 3) {
            const point = matrix.transformPoint(new S3DPoint(data[i], data[i + 1], data[i + 2]));

            data[i] = point.x;
            data[i + 1] = point.y;
            data[i + 2] = point.z;
        }
    }

    private static addDataToBuffer(buffer:S3DBuffer, data:S3DPrimitiveData): S3DBufferEntity {
        const bytes = buffer.bufferData.index.size / 8;
        const start = buffer.bufferData.index.data.length * bytes;
        const vertexNum = buffer.bufferData.vertex.data.length / 3;

        for (let i = 0; i < data.index.length; i ++) {
            buffer.bufferData.index.data.push(data.index[i] + vertexNum);
        }

        buffer.bufferData.vertex.data = buffer.bufferData.vertex.data.concat(data.vertex);

        if (buffer.bufferData.color && data.color) {
            buffer.bufferData.color.data = buffer.bufferData.color.data.concat(data.color);
        }

        if (buffer.bufferData.normal && data.normal) {
            buffer.bufferData.normal.data = buffer.bufferData.normal.data.concat(data.normal);
        }

        if (buffer.bufferData.texture && data.texture) {
            buffer.bufferData.texture.data = buffer.bufferData.texture.data.concat(data.texture);
        }

        return new S3DBufferEntity(
            buffer,
            data.type,
            start,
            data.index.length
        );
    }

    private static buildEntity(
        buffer: S3DBuffer,
        data: S3DPrimitiveData,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        if (transformVertex) {
            S3DPrimitive.transform3(data.vertex, transformVertex);

            data.normal && S3DPrimitive.transform3(
                data.normal,
                S3DMatrix.extractRotation(transformVertex)
            );
        }

        if (transformTexture && data.texture) {
            S3DPrimitive.transform2(data.texture, transformTexture);
        }

        return S3DPrimitive.addDataToBuffer(buffer, data);
    }

    public static buildSkin(grid:S3DVertex[][]): S3DPrimitiveData {
        const data = {
            type: S3DSurface.gl.TRIANGLE_STRIP,
            index: [],
            vertex: [],
            color: [],
            normal: [],
            texture: [],
        } as S3DPrimitiveData;

        for (let i = 0; i < grid.length; i ++) {
            for (let j = 0; j < grid[i].length; j ++) {
                if (i < grid.length - 1) {
                    data.index.push(i * grid[i].length + j);
                    if (i > 0 && j === 0) {
                        // add a degenerate triangle here to finish a 'jump'
                        data.index.push(data.index[data.index.length - 1]);
                    }

                    data.index.push((i + 1) * grid[i].length + j);
                    if (   i < grid.length - 2
                        && j === grid[i].length - 1
                    ) {
                        // add a degenerate triangle here to start a 'jump'
                        data.index.push(data.index[data.index.length - 1]);
                    }
                }

                data.vertex.push(grid[i][j].vertex.x, grid[i][j].vertex.y, grid[i][j].vertex.z);
                data.normal!.push(grid[i][j].normal.x, grid[i][j].normal.y, grid[i][j].normal.z);
                if (grid[i][j].color) {
                    data.color!.push(
                        grid[i][j].color!.x,
                        grid[i][j].color!.y,
                        grid[i][j].color!.z,
                        grid[i][j].color!.w
                    );
                } else {
                    data.color!.push(1, 1, 1, 1);
                }
                data.texture!.push(grid[i][j].texture.x, grid[i][j].texture.y);
            }
        }

        return data;
    }

    public static cube(
        buffer: S3DBuffer,
        props: S3DPrimitiveCubeProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveCube(props),
            transformVertex,
            transformTexture
        );
    }

    public static plane(
        buffer: S3DBuffer,
        props: S3DPrimitivePlaneProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitivePlane(props),
            transformVertex,
            transformTexture
        );
    }

    public static grid(
        buffer: S3DBuffer,
        props: S3DPrimitiveGridProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveGrid(props),
            transformVertex,
            transformTexture
        );
    }

    public static cylinder(
        buffer: S3DBuffer,
        props: S3DPrimitiveCylinderProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveCylinder(props),
            transformVertex,
            transformTexture
        );
    }

    public static line(
        buffer: S3DBuffer,
        props: S3DPrimitiveLineProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveLine(props),
            transformVertex,
            transformTexture
        );
    }

    public static revolve(
        buffer: S3DBuffer,
        props: S3DPrimitiveRevolveProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveRevolve(props),
            transformVertex,
            transformTexture
        );
    }

    public static sphere(
        buffer: S3DBuffer,
        props: S3DPrimitiveSphereProps,
        transformVertex?: DOMMatrix,
        transformTexture?: DOMMatrix,
    ): S3DBufferEntity {
        return S3DPrimitive.buildEntity(
            buffer,
            S3DPrimitiveSphere(props),
            transformVertex,
            transformTexture
        );
    }
}