interface S3DShaderConfigAttribute {
    name: string;
    buffer: string;
}

interface S3DShaderConfigUniform {
    name: string;
}

export interface S3DShaderConfig {
    vertex: string;
    fragment: string;
    attribs: S3DShaderConfigAttributeMap;
    uniforms: S3DShaderConfigUniformMap;
}

interface S3DShaderConfigMap {
    [shaderConfigName: string]: S3DShaderConfig;
}
const createS3DShaderConfigMap = <M extends S3DShaderConfigMap>(shaderConfigs: M) => shaderConfigs;

interface S3DShaderConfigAttributeMap {
    [shaderConfigAttributeName: string]: S3DShaderConfigAttribute;
}
const createS3DShaderConfigAttributeMap = <M extends S3DShaderConfigAttributeMap>(shaderConfigAttributes: M) => shaderConfigAttributes;

interface S3DShaderConfigUniformMap {
    [shaderConfigUniformName: string]: S3DShaderConfigUniform;
}
const createS3DShaderConfigUniformMap = <M extends S3DShaderConfigUniformMap>(shaderConfigUniforms: M) => shaderConfigUniforms;

export const ShaderConfig = createS3DShaderConfigMap(
    {
        texture: {
            vertex: `attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTexture;
attribute vec3 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vertexColor;
varying vec2 vertexTexture;
varying vec3 vertexNormal;

void main() {
    vertexColor = aVertexColor;
    vertexTexture = aVertexTexture;
    vertexNormal = aVertexNormal;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`,
            fragment: `
#ifdef GL_ES
    precision highp float;
#endif

struct Light {
    vec3 position;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
};

struct Material {
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    float shiny;
};

uniform sampler2D uSampler0;
uniform Light uLight;
uniform Material uMaterial;

varying vec4 vertexColor;
varying vec2 vertexTexture;
varying vec3 vertexNormal;

void main() {
    // vec3 reflect = normalize(-reflect(uLight.position, vertexNormal));
    float d = clamp(dot(vertexNormal, normalize(uLight.position)), 0.0, 1.0);
    // float a = 1.0 - d;
    //float s = clamp(pow(max(dot(reflect, v_eye), 0.0), 100 * 0.3), 0.0, 1.0); // 100 is shiny
    
    vec4 texture0 = texture2D(uSampler0, vertexTexture);
    
    gl_FragColor = texture0 * vertexColor * uMaterial.ambient * uLight.ambient +
        texture0 * vertexColor * uMaterial.diffuse * uLight.diffuse * d;
        // + s * u_material.specular * u_light.specular;
        
    // texture0;
    // vertexColor;
    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1);
}`,
            attribs: createS3DShaderConfigAttributeMap({
                vertexPosition: {
                    name: 'aVertexPosition',
                    buffer: 'vertex'
                },
                vertexColor: {
                    name: 'aVertexColor',
                    buffer: 'color'
                },
                vertexTexture: {
                    name: 'aVertexTexture',
                    buffer: 'texture'
                },
                vertexNormal: {
                    name: 'aVertexNormal',
                    buffer: 'normal'
                }
            }),
            uniforms: createS3DShaderConfigUniformMap({
                projectionMatrix: {name: 'uProjectionMatrix'},
                modelViewMatrix: {name: 'uModelViewMatrix'},
                sampler0: {name: 'uSampler0'},
                lightPosition: {name: 'uLight.position'},
                lightAmbient: {name: 'uLight.ambient'},
                lightDiffuse: {name: 'uLight.diffuse'},
                lightSpecular: {name: 'uLight.specular'},
                materialAmbient: {name: 'uMaterial.ambient'},
                materialDiffuse: {name: 'uMaterial.diffuse'},
                materialSpecular: {name: 'uMaterial.specular'},
                materialShiny: {name: 'uMaterial.shiny'}
            })
        },
        simple: {
            vertex: `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vertexColor;

void main() {
    vertexColor = aVertexColor;
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`,
            fragment: `
#ifdef GL_ES
    precision highp float;
#endif

varying vec4 vertexColor;

void main() {
    gl_FragColor = vertexColor;
}`,
            attribs: createS3DShaderConfigAttributeMap({
                vertexPosition: {
                    name: 'aVertexPosition',
                    buffer: 'vertex'
                },
                vertexColor: {
                    name: 'aVertexColor',
                    buffer: 'color'
                }
            }),
            uniforms: createS3DShaderConfigUniformMap({
                projectionMatrix: {name: 'uProjectionMatrix'},
                modelViewMatrix: {name: 'uModelViewMatrix'}
            })
        }
    }
) as S3DShaderConfigMap;