interface S3DResourceDef {
    [name: string]: string;
}

interface S3DResourceBundleDef {
    [type: string]: S3DResourceDef;
}

interface S3DImageResourceMap {
    [name: string]: ImageBitmap;
}
const createS3DImageResourceMap = <M extends S3DImageResourceMap>(images: M) => images;

export interface S3DResourceBundle {
    image: S3DImageResourceMap;
}

interface S3DResourceReader {
    type: string;
    resourceName: string;
    reader: ReadableStreamDefaultReader;
    size: number;
    chunks: any[];
}

export default class S3DResourceManager {
    public static load(updateProgress: (progress:number) => void, bundleDef: S3DResourceBundleDef) {
        return new Promise<S3DResourceBundle>((resolve, reject) => {
            const bundle = {
                image: createS3DImageResourceMap({}) as S3DImageResourceMap
            } as S3DResourceBundle;

            let totalSize = 0;
            let totalLoaded = 0;

            let count = 0;
            let success = 0;
            let failed = 0;

            let reader = [] as S3DResourceReader[];

            function checkReadersReady() {
                // console.log('checkReadersReady', reader.length, failed, count);
                if (reader.length + failed === count) {
                    if (failed > 0) {
                        reject();
                    } else {
                        processReaders();
                    }
                }
            }

            function checkComplete() {
                // console.log('checkComplete', success, failed, count);
                if (success + failed === count) {
                    if (failed > 0) {
                        reject();
                        return;
                    }
                    resolve(bundle);
                }
            }

            function buildImage(resourceName:string, imageData: Blob) {
                // console.log('buildImage', resourceName);

                const image = new Image();

                image.onload = () => createBitmap(resourceName, image);
                image.onerror = () => {
                    failed ++;
                    checkComplete();
                };
                image.src = URL.createObjectURL(imageData);
            }

            function createBitmap(name:string, image:HTMLImageElement) {//}, url:string) {
                createImageBitmap(
                    image
                ).then(bitmap => {
                    // console.log(`createBitmap ${name} success`);
                    bundle.image[name] = bitmap;
                    URL.revokeObjectURL(image.src);
                    success ++;
                    checkComplete();
                }).catch(e => {
                    console.error(e);
                    failed ++;
                    checkComplete();
                })
            }

            function processReaders() {
                // console.log('processReaders');

                for (let i = 0; i < reader.length; i ++) {
                    const resourceReader = reader[i];
                    // console.log('processReaders', i, resourceReader.resourceName);

                    processReader(resourceReader)
                        .then(() => {
                            let chunksAll = new Uint8Array(resourceReader.size); // (4.1)
                            let position = 0;
                            for(let chunk of resourceReader.chunks) {
                                chunksAll.set(chunk, position); // (4.2)
                                position += chunk.length;
                            }

                            switch (resourceReader.type) {
                                case 'image':
                                    buildImage(
                                        resourceReader.resourceName,
                                        new Blob([chunksAll])
                                    );
                                    break;

                                default:
                                    success ++;
                                    checkComplete();
                                    break;
                            }
                        });
                }
            }

            async function processReader(resourceReader:S3DResourceReader) {
                while (true) {
                    const {done, value} = await resourceReader.reader.read();

                    if (done) {
                        // console.log('processReader', resourceReader.resourceName, 'complete');
                        break;
                    }

                    totalLoaded += value.length;
                    resourceReader.size += value.length;
                    resourceReader.chunks.push(value);

                    updateProgress(totalLoaded / totalSize);
                }
            }

            function fetchResources(type:string, bundleDef:S3DResourceBundleDef) {
                for (let name in bundleDef[type]) {
                    count ++;

                    switch (type) {
                        case 'image':
                            fetchResource(
                                type,
                                name,
                                `${process.env.PUBLIC_URL}/${bundleDef[type][name]}`,
                                'image/*'
                            ).then(() => {
                                checkReadersReady();
                            });
                            break;

                        case 'movie':
                            fetchResource(
                                type,
                                name,
                                `${process.env.PUBLIC_URL}/${bundleDef[type][name]}`,
                                'video/*'
                            ).then(() => {
                                checkReadersReady();
                            });
                            break;
                    }
                }
            }

            async function fetchResource(type:string, resourceName:string, url:string, accept:string) {
                let response = await fetch(
                    url,
                    {
                        headers: {
                            "Accept": accept
                        }
                    }
                );

                const hLength = response.headers!.get('Content-Length');
                if (hLength) {
                    let length = parseInt(hLength, 10);
                    totalSize += length;

                    reader.push({
                        type: type,
                        resourceName: resourceName,
                        reader: response.body!.getReader(),
                        size: 0,
                        chunks: []
                    });
                    return;
                }

                failed ++;
            }

            for (let resourceType in bundleDef) {
                fetchResources(resourceType, bundleDef);
            }
        });
    }
}