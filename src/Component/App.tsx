import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import Stage3D from "../Class/Stage3D";
import {S3DResourceBundle} from "../Library/Stage3D/Service/Resource";
import S3DEnvironment from "../Library/Stage3D/Class/Environment";
import Loading from "./Loading";
import '../Style/App.css'
import S3DPoint from "../Library/Stage3D/Service/Point";

function App() {
    const [maskVisible, setMaskVisible] = useState<boolean>(true);
    const [progress, setProgress] = useState<number>(0);
    const [bundle, setBundle] = useState<S3DResourceBundle>();
    const ref: MutableRefObject<any> = useRef();

    const updateProgress = useCallback((progress:number) => {
        setProgress(progress);
    }, []);

    useEffect(() => {
        S3DEnvironment.initialize(
            updateProgress
        ).then(resourceBundle => {
            setBundle(resourceBundle as S3DResourceBundle);
        }).catch(e => {
            // window.alert(e);
        });
    }, [updateProgress]);

    useEffect(() => {
        bundle && new Stage3D({
            canvas: ref.current,
            size: new S3DPoint(500, 500),
            bundle: bundle
        });
    }, [bundle]);

    return (
        <>
            <canvas ref={ref} />
            {maskVisible && <div
                id="AppMask"
                style={{opacity: bundle ? 0 : 1}}
                onTransitionEnd={() => setMaskVisible(false)}
            >
                <Loading progress={progress} />
            </div>}
        </>
    );
}

export default App;
