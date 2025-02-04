import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageNotFound',
  standalone: true,
})
export class ImageNotFoundPipe implements PipeTransform {
  private readonly defaultImagePath = '/assets/image-not-found.png';
  private imageCache = new Map<string, boolean>();

  transform(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return this.defaultImagePath;
    }

    if (this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath) ? imagePath : this.defaultImagePath;
    }

    const img = new Image();
    img.src = imagePath;

    const checkImage = new Promise<boolean>((resolve) => {
      img.onload = () => {
        this.imageCache.set(imagePath, true);
        resolve(true);
      };

      img.onerror = () => {
        this.imageCache.set(imagePath, false);
        resolve(false);
      };
    });

    checkImage.then((exists) => {
      if (!exists) {
        const imgElement = document.querySelector(
          `[src="${imagePath}"]`
        ) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = this.defaultImagePath;
        }
      }
    });

    return imagePath;
  }

  clearCache(): void {
    this.imageCache.clear();
  }
}
