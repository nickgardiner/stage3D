import '../Style/Loading.css';

interface LoadingProps {
    progress: number;
}

export default function Loading({progress}: LoadingProps) {
    return (
        <div className="Loading">
            <div>Loading Resources</div>
            <div className="Progress">
                <div className="ProgressBar" style={{width:progress * 100 + '%'}}/>
            </div>
        </div>
    );
}