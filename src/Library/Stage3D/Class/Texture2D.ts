import {TextureConfig} from "../../../Config/Texture";
import S3DSurface from "./Surface";

interface S3DTextureProps {
    glName?: WebGLTexture;
    target: GLenum;
    level: GLint;
    resource: string;
    internalFormat: GLint;
    format: GLenum;
    type: GLenum;
    filterMag: GLint;
    filterMin: GLint;
    wrapS: GLint;
    wrapT: GLint;
    blend: GLint;
}
export interface S3DTexturePropsMap {
    [name: string]: S3DTextureProps;
}

export interface S3DTextureMap {
    [name: string]: S3DTexture;
}
const createS3DTextureMap = <M extends S3DTextureMap>(textures: M) => textures;

export default class S3DTexture {
    private glName: WebGLTexture;
    private target: GLenum;
    private level: GLint;
    private internalFormat: GLint;
    private format: GLenum;
    private type: GLenum;
    private filterMag: GLint;
    private filterMin: GLint;
    private wrapS: GLint;
    private wrapT: GLint;
    private blend: GLint;

    public static initialize(): S3DTextureMap {
        const texture = createS3DTextureMap({}) as S3DTextureMap;
        for (let name in TextureConfig) {
            const glName = S3DSurface.gl.createTexture();
            const resource = S3DSurface.bundle.image[TextureConfig[name].resource];

            if (glName && resource) {
                texture[name] = new S3DTexture(glName, resource, TextureConfig[name]);
            }
        }

        return texture;
    }

    constructor(glName:WebGLTexture, imageData:ImageBitmap, props:S3DTextureProps) {
        this.glName = glName;
        this.target = props.target;
        this.level = props.level;
        this.internalFormat = props.internalFormat;
        this.format = props.format;
        this.type = props.type;
        this.filterMag = props.filterMag;
        this.filterMin = props.filterMin;
        this.wrapS = props.wrapS;
        this.wrapT = props.wrapT;
        this.blend = props.blend;

        this.bind();

        S3DSurface.gl.texImage2D(
            this.target,
            this.level,
            this.internalFormat,
            // imageData.width,
            // imageData.height,
            // 0,
            this.format,
            this.type,
            imageData
        );

        S3DSurface.gl.generateMipmap(S3DSurface.gl.TEXTURE_2D);

        S3DSurface.gl.texParameteri(this.target, S3DSurface.gl.TEXTURE_MAG_FILTER, this.filterMag);
        S3DSurface.gl.texParameteri(this.target, S3DSurface.gl.TEXTURE_MIN_FILTER, this.filterMin);
        S3DSurface.gl.texParameteri(this.target, S3DSurface.gl.TEXTURE_WRAP_S, this.wrapS);
        S3DSurface.gl.texParameteri(this.target, S3DSurface.gl.TEXTURE_WRAP_T, this.wrapT);
        // S3DSurface.gl.texParameteri(this.target, S3DSurface.gl.BLEND, 0);//this.blend);
    }

    bind() {
        S3DSurface.gl.bindTexture(this.target, this.glName);
    }

    use() {
        S3DSurface.gl.activeTexture(S3DSurface.gl.TEXTURE0);
        S3DSurface.gl.bindTexture(S3DSurface.gl.TEXTURE_2D, this.glName);
    }
}