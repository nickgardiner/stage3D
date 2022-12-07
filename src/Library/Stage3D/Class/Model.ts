import S3DBufferEntity from "./Buffer/Entity";
import S3DShader from "./Shader";

export default class S3DModel {
    private readonly entity: (S3DBufferEntity | S3DModel)[];
    private readonly transform?: DOMMatrix;
    public matrix: DOMMatrix;

    constructor(entity:(S3DBufferEntity | S3DModel)[], transform?:DOMMatrix) {
        this.entity = entity;
        this.transform = transform || new DOMMatrix();
        this.matrix = DOMMatrix.fromMatrix(this.transform);
    }

    rotate(x:number, y:number): void {
        const matrix = new DOMMatrix();
        matrix.rotateSelf(x, 0, 0);
        matrix.rotateSelf(0, y, 0);

        this.matrix = this.transform!.multiply(matrix);
    }

    draw(shader:S3DShader, matrix?: DOMMatrix): void {
        if (matrix) {
            // matrix = this.matrix.multiply(matrix);
            matrix = matrix.multiply(this.matrix);
        } else {
            matrix = this.matrix;
        }

        shader.updateUniform('modelViewMatrix', matrix);

        for (let i = 0; i < this.entity.length; i ++) {
            if (this.entity[i] instanceof S3DModel) {
                this.entity[i].draw(shader, matrix);
                continue;
            }

            const entity = this.entity[i] as S3DBufferEntity;
            entity.draw();
        }
    }
}