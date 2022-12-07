export interface S3DAnimateProps {
    frame: (time: S3DAnimateTime) => void;
    backgroundPause?: boolean;
}

export interface S3DAnimateTime {
    start: number;
    time: number;
    delta: number;
    frame: number;
}

export default class S3DAnimate {
    protected frame: (time: S3DAnimateTime) => void;
    protected backgroundPause: boolean;

    protected request: number;
    protected startTime: number;
    protected lastTime: number;

    constructor({frame, backgroundPause}: S3DAnimateProps) {
        this.frame = frame;
        this.backgroundPause = backgroundPause !== false;

        this.request = 0;
        this.startTime = 0;
        this.lastTime = 0;

        if (this.backgroundPause) {
            window.addEventListener('focus', () => this.start());
            window.addEventListener('blur', () => this.stop());
        }
    }

    start(): void {
        if (this.request === 0) {
            if (!this.backgroundPause || document.hasFocus()) {
                // console.log("animate start");
                this.requestFrame();
            } else {
                this.frame({start:0, time:0, delta:0, frame:0,});
            }
        }
    }

    stop(): void {
        if (this.request !== 0) {
            // console.log("animate stop");
            this.cancelFrame();
        }
    }

    requestFrame(): void {
        this.request = window.requestAnimationFrame(time => this.doFrame(time));
    }

    cancelFrame(): void {
        window.cancelAnimationFrame(this.request);
        this.request = 0;
    }

    doFrame(time:number): void {
        this.requestFrame();

        if (this.startTime === 0) {
            this.startTime = time;
            this.lastTime = time;
        }

        this.frame({
            start: this.startTime,
            time: time,
            delta: time - this.startTime,
            frame: time - this.lastTime,
        });

        this.lastTime = time;
    }
}