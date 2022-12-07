import S3DResourceManager, {S3DResourceBundle} from "../Service/Resource";

export default class S3DEnvironment {
    public static initialize(updateProgress: (progress:number) => void) {
        return new Promise<S3DResourceBundle>((resolve, reject) => {
            S3DResourceManager.load(
                updateProgress,
                {
                    image: {
                        grass: 'Asset/Image/grass256.jpg',
                        stone: 'Asset/Image/stone256.jpg',
                        brick: 'Asset/Image/brick256.jpg',
                        orientation: 'Asset/Image/orientation.png'
                    },
                    // movie: {
                    //     brian: 'Asset/Movie/TheLifeOfBrian.mp4'
                    // }
                }
            ).then(result => {
                resolve(result);
            }).catch(() => {
                reject('error loading resources');
            });
        });

    }
}