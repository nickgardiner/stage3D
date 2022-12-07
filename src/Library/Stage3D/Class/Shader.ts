import {S3DShaderConfig, ShaderConfig} from "../../../Config/Shader";
import S3DSurface from "./Surface";
import S3DBuffer from "./Buffer/Buffer";
import {S3DCamera} from "./Camera";
import S3DTexture from "./Texture2D";
import {S3DLightProps} from "../../../Config/Light";
import {S3DMaterialProps} from "../../../Config/Material";

export interface S3DShaderMap {
    [shaderName: string]: S3DShader;
}
const createS3DShaderMap = <M extends S3DShaderMap>(shaders: M) => shaders;

interface S3DShaderAttribute {
    buffer: string;
    location: number;
}
interface S3DShaderAttributeMap {
    [shaderAttributeName: string]: S3DShaderAttribute;
}
const createS3DShaderAttributeMap = <M extends S3DShaderAttributeMap>(shaderAttributes: M) => shaderAttributes;

interface S3DShaderUniform {
    location: WebGLUniformLocation;
}
interface S3DShaderUniformMap {
    [shaderUniformName: string]: S3DShaderUniform;
}
const createS3DShaderUniformMap = <M extends S3DShaderUniformMap>(shaderUniforms: M) => shaderUniforms;

export default class S3DShader {
    private readonly program: WebGLProgram;
    private vertex: WebGLShader;
    private fragment: WebGLShader;
    private attribute: S3DShaderAttributeMap;
    private uniform: S3DShaderUniformMap;

    public static initialize(): S3DShaderMap {
        // Config.debug && console.log(`S3DShader: initialize`);

        const shaders = createS3DShaderMap({}) as S3DShaderMap;
        for (let name in ShaderConfig) {
            shaders[name] = S3DShader.initShader(ShaderConfig[name]);
        }

        return shaders;
    }

    private static initShader(def:S3DShaderConfig): S3DShader {
        const vertex = S3DShader.initShaderSource('vertex', S3DSurface.gl.VERTEX_SHADER, def.vertex);
        const fragment = S3DShader.initShaderSource('fragment', S3DSurface.gl.FRAGMENT_SHADER, def.fragment);
        const program = S3DShader.initShaderProgram(vertex, fragment);
        const attribute = S3DShader.initShaderAttributes(program, def);
        const uniform = S3DShader.initShaderUniforms(program, def);

        return new S3DShader(program, vertex, fragment, attribute, uniform);
    }

    private static initShaderProgram(vertex:WebGLShader, fragment:WebGLShader): WebGLProgram {
        const program = S3DSurface.gl.createProgram();
        if (!program) {
            throw new Error(`S3DShader: Unable to create shader program`);
        }

        S3DSurface.gl.attachShader(program, vertex);
        S3DSurface.gl.attachShader(program, fragment);
        S3DSurface.gl.linkProgram(program);

        if (!S3DSurface.gl.getProgramParameter(program, S3DSurface.gl.LINK_STATUS)) {
            throw new Error(`S3DShader: Unable to initialize the shader program: ${S3DSurface.gl.getProgramInfoLog(program)}`);
        }

        return program;
    }

    private static initShaderSource(name:string, type:number, source:string): WebGLShader {
        const shader = S3DSurface.gl.createShader(type);
        if (!shader) {
            console.warn(`S3DShader: Unable to create ${name} shader`);
            throw new Error();
        }

        S3DSurface.gl.shaderSource(shader, source);
        S3DSurface.gl.compileShader(shader);

        if (!S3DSurface.gl.getShaderParameter(shader, S3DSurface.gl.COMPILE_STATUS)) {
            console.warn(`S3DShader: An error occurred compiling the ${name} shader source:\n\n${S3DSurface.gl.getShaderInfoLog(shader)}`);
            S3DSurface.gl.deleteShader(shader);
            throw new Error();
        }

        return shader;
    }

    private static initShaderAttributes(program:WebGLProgram, def:S3DShaderConfig): S3DShaderAttributeMap {
        const attribute = createS3DShaderAttributeMap({}) as S3DShaderAttributeMap;

        for (let variable in def.attribs) {
            attribute[variable] = {
                buffer: def.attribs[variable].buffer,
                location: S3DSurface.gl.getAttribLocation(program, def.attribs[variable].name)
            };
            // console.log(attribute[variable]);
        }

        return attribute;
    }

    public static initShaderUniforms(program:WebGLProgram, def:S3DShaderConfig): S3DShaderUniformMap {
        const uniform = createS3DShaderUniformMap({}) as S3DShaderUniformMap;

        for (let variable in def.uniforms) {
            const location = S3DSurface.gl.getUniformLocation(program!, def.uniforms[variable].name);
            if (!location) {
                throw new Error(`S3DShader: Unable to get uniform location: ${def.uniforms[variable].name}`);
            }

            uniform[variable] = {location: location};
        }

        return uniform;
    }

    constructor(
        program: WebGLProgram,
        vertex: WebGLShader,
        fragment: WebGLShader,
        attribute: S3DShaderAttributeMap,
        uniform: S3DShaderUniformMap
    ) {
        this.program = program;
        this.vertex = vertex;
        this.fragment = fragment;
        this.attribute = attribute;
        this.uniform = uniform;
    }

    use(): void {
        S3DSurface.gl.useProgram(this.program);
    }

    useBuffer(buffer:S3DBuffer) {
        buffer.bufferData.index.bind();

        // buffer.bufferData.vertex.bind();
        // this.updateAttribute('vertexPosition', buffer.bufferData.vertex.bytes);
        //
        // if (buffer.bufferData.color) {
        //     buffer.bufferData.color.bind();
        //     this.updateAttribute('vertexColor', buffer.bufferData.color.bytes);
        // }
        //
        // if (buffer.bufferData.texture) {
        //     buffer.bufferData.texture.bind();
        //     this.updateAttribute('vertexTexture', buffer.bufferData.texture.bytes);
        // }

        for (let name in this.attribute) {
            if (this.attribute[name].location < 0) {
                continue;
            }

            const bufferData = buffer.bufferData[this.attribute[name].buffer];
            if (bufferData) {
                bufferData.bind();
                this.updateAttribute(name, bufferData.bytes);
            }
        }
    }

    useCamera(camera:S3DCamera) {
        this.updateUniform('projectionMatrix', camera.matrix);
    }

    useTexture(texture:S3DTexture) {
        texture.use();
        // S3DSurface.gl.activeTexture(S3DSurface.gl.TEXTURE0);
        // S3DSurface.gl.bindTexture(S3DSurface.gl.TEXTURE_2D, texture.glName);

        S3DSurface.gl.uniform1i(
            this.uniform['sampler0'].location,
            0
        );
    }

    useLight(light:S3DLightProps) {
        S3DSurface.gl.uniform3fv(
            this.uniform['lightPosition'].location,
            light.position
        );

        S3DSurface.gl.uniform4fv(
            this.uniform['lightAmbient'].location,
            light.ambient
        );

        S3DSurface.gl.uniform4fv(
            this.uniform['lightDiffuse'].location,
            light.diffuse
        );
    }



    useMaterial(material:S3DMaterialProps) {
        S3DSurface.gl.uniform4fv(
            this.uniform['materialAmbient'].location,
            material.ambient
        );

        S3DSurface.gl.uniform4fv(
            this.uniform['materialDiffuse'].location,
            material.diffuse
        );

        S3DSurface.gl.uniform4fv(
            this.uniform['materialSpecular'].location,
            material.specular
        );

        S3DSurface.gl.uniform1f(
            this.uniform['materialShiny'].location,
            material.shiny
        );
    }

    updateUniform(name:string, matrix:DOMMatrix): void {
        S3DSurface.gl.uniformMatrix4fv(
            this.uniform[name].location,
            false,
            matrix.toFloat32Array()
        );
    }

    updateAttribute(name:string, size:number): void {
        S3DSurface.gl.vertexAttribPointer(
            this.attribute[name].location,
            size,
            S3DSurface.gl.FLOAT,
            false,
            0,
            0
        );
        S3DSurface.gl.enableVertexAttribArray(this.attribute[name].location);
    }
}