export interface S3DMaterialProps {
    ambient: number[],
    diffuse: number[],
    specular: number[],
    shiny: number
}

interface S3DMaterialPropsMap {
    [name: string]: S3DMaterialProps;
}

export const MaterialConfig = {
    white: {
        ambient: [1, 1, 1, 1],
        diffuse: [1, 1, 1, 1],
        specular: [1, 1, 1, 1],
        shiny: 100,
    }
} as S3DMaterialPropsMap;