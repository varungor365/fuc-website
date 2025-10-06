// Selfie to Mockup Service - Client-side face processing
import * as faceapi from 'face-api.js';

export class SelfieMockupService {
  private static modelsLoaded = false;

  static async loadModels() {
    if (this.modelsLoaded) return;
    
    const MODEL_URL = '/models';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    
    this.modelsLoaded = true;
  }

  static async detectAndCropFace(imageFile: File): Promise<Blob | null> {
    await this.loadModels();

    const img = await this.fileToImage(imageFile);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const box = detection.detection.box;
    const padding = box.width * 0.3;
    
    canvas.width = box.width + padding * 2;
    canvas.height = box.height + padding * 2;
    
    ctx.drawImage(
      img,
      box.x - padding,
      box.y - padding,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }

  static async applyArtisticStyle(faceBlob: Blob, style: 'cartoon' | 'sketch' | 'pop-art' = 'cartoon'): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = await this.blobToImage(faceBlob);
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    switch (style) {
      case 'cartoon':
        this.applyCartoonFilter(imageData);
        break;
      case 'sketch':
        this.applySketchFilter(imageData);
        break;
      case 'pop-art':
        this.applyPopArtFilter(imageData);
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  }

  private static applyCartoonFilter(imageData: ImageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / 50) * 50;
      data[i + 1] = Math.round(data[i + 1] / 50) * 50;
      data[i + 2] = Math.round(data[i + 2] / 50) * 50;
    }
  }

  private static applySketchFilter(imageData: ImageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
      const inverted = 255 - gray;
      data[i] = data[i + 1] = data[i + 2] = inverted > 200 ? 255 : 0;
    }
  }

  private static applyPopArtFilter(imageData: ImageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] > 128 ? 255 : 0;
      data[i + 1] = data[i + 1] > 128 ? 255 : 0;
      data[i + 2] = data[i + 2] > 128 ? 255 : 0;
    }
  }

  static async generateMockup(
    styledFaceBlob: Blob,
    productId: string,
    productColor: string = 'black'
  ): Promise<string> {
    const formData = new FormData();
    formData.append('face', styledFaceBlob);
    formData.append('productId', productId);
    formData.append('color', productColor);

    const response = await fetch('/api/mockup/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Mockup generation failed');

    const { mockupUrl } = await response.json();
    return mockupUrl;
  }

  private static fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private static blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }
}
