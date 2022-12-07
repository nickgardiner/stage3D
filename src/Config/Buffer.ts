import {S3DBufferPropsMap} from '../Library/Stage3D/Class/Buffer/Buffer';

export const BufferConfig = {
    texture: {
        index: {type:'ELEMENT_ARRAY_BUFFER', size:16, bytes:1, data:[]},
        vertex: {type:'ARRAY_BUFFER', size:32, bytes:3, data:[]},
        color: {type:'ARRAY_BUFFER', size:32, bytes:4, data:[]},
        texture: {type:'ARRAY_BUFFER', size:32, bytes:2, data:[]},
        normal: {type:'ARRAY_BUFFER', size:32, bytes:3, data:[]}
    },
    simple: {
        index: {type:'ELEMENT_ARRAY_BUFFER', size:16, bytes:1, data:[]},
        vertex: {type:'ARRAY_BUFFER', size:32, bytes:3, data:[]},
        color: {type:'ARRAY_BUFFER', size:32, bytes:4, data:[]}
    }
} as S3DBufferPropsMap;