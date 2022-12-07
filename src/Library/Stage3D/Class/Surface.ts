import S3DBuffer, {S3DBufferMap} from "./Buffer/Buffer";
import S3DTexture, {S3DTextureMap} from "./Texture2D";
import S3DShader, {S3DShaderMap} from "./Shader";
import {S3DCamera} from "./Camera";
import S3DAnimate, {S3DAnimateProps} from "./Animate";
import S3DKeyboard from "./Keyboard";
import {S3DResourceBundle} from "../Service/Resource";
import S3DPoint from "../Service/Point";

export interface S3DSurfaceProps {
    canvas: HTMLCanvasElement;
    size: S3DPoint;
    bundle: S3DResourceBundle;
    camera: S3DCamera[];
    currentCamera?: number;
    buildBuffers?: (buffer: S3DBufferMap) => void;
    animate?: S3DAnimateProps;
    render: () => void;
}

export default class S3DSurface {
    public static gl: WebGLRenderingContext;
    public static canvas: HTMLCanvasElement;
    public static bundle: S3DResourceBundle;

    public animate?: S3DAnimate;
    public buffer: S3DBufferMap;
    public texture: S3DTextureMap;
    public shader: S3DShaderMap;
    public camera: S3DCamera[];
    public currentCamera: number;
    public keyboard: S3DKeyboard;

    private readonly renderFn: () => void;
    private readonly mouseDownFn: () => void;
    private readonly mouseMoveFn: (e:MouseEvent) => void;
    private readonly mouseUpFn: () => void;
    private readonly keyDownFn: (e:KeyboardEvent) => void;
    private readonly keyUpFn: (e:KeyboardEvent) => void;
    private readonly contextLostFn: () => void;
    private readonly contextRestoredFn: () => void;
    private readonly pointerLockChangeFn: () => void;

    constructor(props: S3DSurfaceProps) {
        // S3DResourceManager.load({
        //     image: {
        //         grass: 'Asset/Image/grass2567.jpg'
        //     }
        // }).then(result => {
        //     console.log(result);
        // }).catch(() => {
        //     window.alert('error loading resources');
        // });

        S3DSurface.bundle = props.bundle;

        this.initializeSurface(props);

        this.texture = S3DTexture.initialize();

        this.shader = S3DShader.initialize();

        this.buffer = S3DBuffer.initialize();
        props.buildBuffers && props.buildBuffers(this.buffer);
        S3DBuffer.finalize(this.buffer);

        this.camera = props.camera;
        this.currentCamera = props.currentCamera || 0;

        this.renderFn = props.render;

        if (props.animate) {
            this.animate = new S3DAnimate(props.animate);
        }

        this.keyboard = new S3DKeyboard();

        this.mouseDownFn = () => this.dragBegin();
        this.mouseMoveFn = e => this.dragMove(e);
        this.mouseUpFn = () => this.dragEnd();
        this.keyDownFn = e => this.keyDown(e);
        this.keyUpFn = e => this.keyUp(e);
        this.contextLostFn = () => this.contextLost();
        this.contextRestoredFn = () => this.contextRestored();
        this.pointerLockChangeFn = () => this.pointerLockChange();

        this.initializeEvents();
    }

    initializeSurface({canvas, size}: S3DSurfaceProps) {
        canvas.width = size.x;
        canvas.height = size.y;
        S3DSurface.canvas = canvas;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error('S3DSurface: Unable to get webgl context');
        }
        S3DSurface.gl = gl;

        this.initializeGl();
    }

    initializeGl() {
        S3DSurface.gl.enable(S3DSurface.gl.DEPTH_TEST);
        S3DSurface.gl.depthFunc(S3DSurface.gl.LEQUAL);  // Near things obscure far things

        S3DSurface.gl.enable(S3DSurface.gl.BLEND);
        S3DSurface.gl.blendFunc(S3DSurface.gl.SRC_ALPHA, S3DSurface.gl.ONE_MINUS_SRC_ALPHA);
        // S3DSurface.gl.blendColor(1.0, 1.0, 1.0, 1.0);

        S3DSurface.gl.frontFace(S3DSurface.gl.CW);

        S3DSurface.gl.enable(S3DSurface.gl.CULL_FACE);
        S3DSurface.gl.cullFace(S3DSurface.gl.BACK);

        S3DSurface.gl.pixelStorei(S3DSurface.gl.UNPACK_FLIP_Y_WEBGL, 1 );
        S3DSurface.gl.pixelStorei(S3DSurface.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0 );
        S3DSurface.gl.hint(S3DSurface.gl.GENERATE_MIPMAP_HINT, S3DSurface.gl.NICEST);

        S3DSurface.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        S3DSurface.gl.viewport(0, 0, S3DSurface.canvas.width, S3DSurface.canvas.height);
    }

    initializeEvents() {
        S3DSurface.canvas.addEventListener('mousedown', this.mouseDownFn);
        S3DSurface.canvas.addEventListener('webglcontextlost', this.contextLostFn);
        S3DSurface.canvas.addEventListener('webglcontextrestored', this.contextRestoredFn);

        document.addEventListener('pointerlockchange', this.pointerLockChangeFn);

        window.addEventListener('keydown', this.keyDownFn);
        window.addEventListener('keyup', this.keyUpFn);
    }

    pointerLockChange() {
        if (document.pointerLockElement === S3DSurface.canvas) {
            window.addEventListener('mousemove', this.mouseMoveFn);
            window.addEventListener('mouseup', this.mouseUpFn);
        } else {
            window.removeEventListener('mousemove', this.mouseMoveFn);
            window.removeEventListener('mouseup', this.mouseUpFn);
            // this.unlockHook(this.element);
        }
    }

    dragBegin() {
        S3DSurface.canvas.requestPointerLock();
    }

    dragMove(e:MouseEvent) {
        if (e.movementX !== 0 || e.movementY !== 0) {
            this.rotateCamera(e.movementX, e.movementY);

            if (!this.animate) {
                this.renderFn();
            }
        }
    }

    dragEnd() {
        document.exitPointerLock();
    }

    contextLost() {
        console.log('context lost');
    }

    contextRestored() {
        console.log('context restored');
    }

    keyDown(e:KeyboardEvent) {
        if (e.code === 'Tab') {
            e.preventDefault();
            this.currentCamera ++;
            if (this.currentCamera === this.camera.length) {
                this.currentCamera = 0;
            }
            return;
        }

        this.keyboard.press(e.code);
    }

    keyUp(e:KeyboardEvent) {
        this.keyboard.release(e.code);
    }

    resize() {
        const parent = S3DSurface.canvas.parentNode as HTMLElement;
        const bounds = parent.getBoundingClientRect();

        if (bounds.width !== S3DSurface.canvas.width
            || bounds.height !== S3DSurface.canvas.height
        ) {
            S3DSurface.canvas.width = bounds.width;
            S3DSurface.canvas.height = bounds.height;

            S3DSurface.gl.viewport(0, 0, S3DSurface.canvas.width, S3DSurface.canvas.height);

            const aspect = S3DSurface.canvas.width / S3DSurface.canvas.height;
            for (let i = 0; i < this.camera.length; i ++) {
                this.camera[i].updateAspect(aspect);
            }
        }
    }

    rotateCamera(x:number, y:number) {
        // this.model.cubes.rotate(rotation.x, rotation.y);
        this.camera[this.currentCamera].rotate(x, y);
    };
}