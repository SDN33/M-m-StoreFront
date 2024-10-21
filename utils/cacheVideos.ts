// utils/cacheVideos.ts

export const cacheVideos = (videoUrls: string[]) => {
  videoUrls.forEach((url) => {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'auto'; // Précharge la vidéo
    video.load(); // Charge la vidéo pour la mettre en cache
  });
};
