declare module 'cloudinary' {
    export const v2: {
        uploader: {
            upload: (file: string, options?: any) => Promise<any>;
        };
        config: (options: {
            cloud_name: string;
            api_key: string;
            api_secret: string;
        }) => void;
    };
}
