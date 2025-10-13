import ImageKit from 'imagekit-javascript';

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export function getImageKitUrl(path: string, transformations?: any) {
  return imagekit.url({
    path,
    transformation: transformations || [{ height: '800', width: '800', quality: '85' }],
  });
}
