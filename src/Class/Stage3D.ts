import S3DSurface from "../Library/Stage3D/Class/Surface";
import {S3DAnimateTime} from "../Library/Stage3D/Class/Animate";
import {S3DCameraPerspective} from "../Library/Stage3D/Class/Camera";
import S3DPrimitive from "../Library/Stage3D/Class/Primitive/Primitive";
import S3DModel from "../Library/Stage3D/Class/Model";
import {S3DBufferMap} from "../Library/Stage3D/Class/Buffer/Buffer";
import S3DPoint from "../Library/Stage3D/Service/Point";
import {S3DResourceBundle} from "../Library/Stage3D/Service/Resource";
import {LightConfig} from "../Config/Light";
import {MaterialConfig} from "../Config/Material";
import S3DMath from "../Library/Stage3D/Service/Math";
import S3DPathBuilder from "../Library/Stage3D/Class/Path/Path";

interface Stage3DProps {
    canvas: HTMLCanvasElement;
    size: S3DPoint;
    bundle: S3DResourceBundle;
}

export default class Stage3D {
    private readonly surface: S3DSurface;
    private readonly bundle: S3DResourceBundle;
    private bufferEntity: any;
    private model: any;
    private sizeChanged: boolean;

    private readonly buildBuffersFn: (buffer: S3DBufferMap) => void;
    private readonly frameFn: (time: S3DAnimateTime) => void;
    private readonly renderFn: () => void;
    private readonly resizeFn: (e:UIEvent) => void;

    constructor({canvas, size, bundle}: Stage3DProps) {
        this.bundle = bundle;
        this.buildBuffersFn = b => this.buildBuffers(b);
        this.sizeChanged = false;
        this.frameFn = (time: S3DAnimateTime) => this.frame(time);
        this.renderFn = () => this.render();
        this.resizeFn = e => this.resize(e);

        const parent = canvas.parentNode as HTMLElement;
        const bounds = parent.getBoundingClientRect();

        size.x = bounds.width;
        size.y = bounds.height;

        this.surface = this.initializeSurface(canvas, size);

        this.surface.shader.texture.use();
        this.surface.shader.texture.useLight(LightConfig.infiniteWhite);
        this.surface.shader.texture.useMaterial(MaterialConfig.white);

        this.surface.animate
            ? this.surface.animate.start()
            : this.render();

        window.addEventListener('resize', this.resizeFn);
    }

    initializeSurface(canvas:HTMLCanvasElement, size:S3DPoint) {
        return new S3DSurface({
            canvas: canvas,
            size: size,
            bundle: this.bundle,
            camera: [
                new S3DCameraPerspective({
                    fov: 55,
                    aspect: size.x / size.y,
                    near: 0.1,
                    far: 100,
                    distance: 0.1,
                    translation: new S3DPoint(0, -1, -5),
                    rotation: new S3DPoint(15, 0, 0)
                }),
                // new S3DCameraPerspective({
                //     fov: 55,
                //     aspect: size.x / size.y,
                //     near: 0.1,
                //     far: 100,
                //     distance: 2,
                //     translation: new S3DPoint(0, -1, 5),
                //     rotation: new S3DPoint(0, 180, 0)
                // })
            ],
            currentCamera: 0,
            buildBuffers: this.buildBuffersFn,
            animate: {
                frame: this.frameFn,
                backgroundPause: true
            },
            render: this.renderFn
        });
    }

    buildBuffers(buffer:S3DBufferMap) {
        this.bufferEntity = {
            cube: S3DPrimitive.cube(
                buffer.texture,
                {
                    width: 2,
                    height: 2,
                    depth: 2,
                }
            ),
            lineTest: S3DPrimitive.line(
                buffer.simple,
                {
                    path: S3DPathBuilder.arc(0, Math.PI, 8, false, new DOMMatrix().translate(1, 1, 0))
                }
            ),
            // grid: S3DPrimitiveGrid({buffer:buffer.simple, cells:new DOMPoint(200, 200), size:1}),
            ground: S3DPrimitive.plane(
                buffer.texture,
                {
                    width: 200,
                    depth: 200,
                },
                undefined,
                new DOMMatrix().scaleSelf(200, 200, 1)
            ),
            cylinder: S3DPrimitive.cylinder(
                buffer.texture,
                {
                    height: 2,
                    radiusTop: 1,
                    radiusBottom: 1,
                    sliceStartAngle: 0,
                    sliceEndAngle: S3DMath.twoPI,
                    sliceSteps: 32
                },
                new DOMMatrix().translate(2.5, 1, 0),
                new DOMMatrix().scale(2, 1, 0)
            ),
            sphere: S3DPrimitive.sphere(
                buffer.texture,
                {
                    layerStartAngle: 0,
                    layerEndAngle: Math.PI,
                    layerSteps: 16,
                    sliceStartAngle: 0,
                    sliceEndAngle: S3DMath.twoPI,
                    sliceSteps: 32
                },
                new DOMMatrix()
                    // .scaleSelf(1, 1, 1)
                    .translateSelf(-2.5, 1,0),
                    // .rotateSelf(0, 180, 0)
                new DOMMatrix().scale(2, 1, 0)
            ),
            // revolveTest: S3DPrimitive.revolve(
            //     buffer.texture,
            //     {
            //         path: S3DPathBuilder.arc(1, 1, 0, Math.PI, 16, false, S3DMatrix.getIdentity().translateSelf(0, 1, 0)),
            //         startAngle: 0,
            //         endAngle: S3DMath.twoPI,
            //         steps: 32
            //     }
            // ),
        }

        this.model = {
            cube: new S3DModel(
                [this.bufferEntity.cube],
                new DOMMatrix().translateSelf(0, 1, 0)
            ),
            cube2: new S3DModel(
                [this.bufferEntity.cube],
                new DOMMatrix()
                    .translateSelf(0, 1, 0)
                    .rotateSelf(0, 0, 45)
                    .translateSelf(0, 1.75, 0)
                    .rotateSelf(0,0,-45)
                    .scaleSelf(0.125, 0.125, 0.125)
            ),
            // grid: new S3DModel(
            //     [this.bufferEntity.grid]
            // ),
            ground: new S3DModel(
                [this.bufferEntity.ground]
            ),
            cylinder: new S3DModel(
                [this.bufferEntity.cylinder]
            ),
            sphere: new S3DModel(
                [this.bufferEntity.sphere]
            ),
            lineTest: new S3DModel(
                [this.bufferEntity.lineTest]
            )
        };

        this.model.cubes = new S3DModel(
            [
                this.model.cube,
                this.model.cube2
            ]
        )
    }

    resize(e:UIEvent) {
        if (this.surface.animate) {
            this.sizeChanged = true;
            return;
        }

        this.surface.resize();
        this.render();
    }

    frame(time: S3DAnimateTime): void {
        if (this.sizeChanged) {
            this.surface.resize();
            this.sizeChanged = false;
        }

        this.update(time);
        this.render();
    }

    update(time: S3DAnimateTime): void {
        const {camera, currentCamera, keyboard} = this.surface;

        const x = keyboard.test('KeyA')
            ? 1
            : keyboard.test('KeyD')
                ? -1
                : 0;

        const y = keyboard.test('Space')
            ? -1
            : keyboard.test('ControlLeft')
                ? 1
                : 0;

        const z = keyboard.test('KeyW')
            ? -1
            : keyboard.test('KeyS')
                ? 1
                : 0;

        if (x || y || z) {
            camera[currentCamera].translate(x, y, z, 0.07);
            this.model.ground.matrix.m41 = Math.floor(-camera[currentCamera].translation.x);
            this.model.ground.matrix.m43 = Math.floor(-camera[currentCamera].translation.z);
        }
    }

    render(): void {
        const {buffer, texture, shader, camera, currentCamera} = this.surface;

        S3DSurface.gl.clear(S3DSurface.gl.COLOR_BUFFER_BIT | S3DSurface.gl.DEPTH_BUFFER_BIT);

        shader.texture.use();
        shader.texture.useBuffer(buffer.texture);
        shader.texture.useCamera(camera[currentCamera]);

        shader.texture.useTexture(texture.grass);
        this.model.ground.draw(shader.texture);

        shader.texture.useTexture(texture.stone);
        this.model.sphere.draw(shader.texture);
        this.model.cubes.draw(shader.texture);
        this.model.cylinder.draw(shader.texture);

        // shader.simple.use();
        // shader.simple.useBuffer(buffer.simple);
        // shader.simple.useCamera(camera[currentCamera]);
        // this.model.lineTest.draw(shader.simple);
    }
}