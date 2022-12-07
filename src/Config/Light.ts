export interface S3DLightProps {
    position: number[],
    ambient: number[],
    diffuse: number[],
    specular: number[],
}

interface S3DLightPropsMap {
    [name: string]: S3DLightProps;
}

export const LightConfig = {
    infiniteWhite: {
        position: [1, 2, 3],
        ambient: [0.5, 0.5, 0.5, 1],
        diffuse: [1, 0.8, 0.6, 1],
        specular: [1, 1, 1, 1],
    }
} as S3DLightPropsMap;