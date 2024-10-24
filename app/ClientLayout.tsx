// app/ClientLayout.tsx

"use client"; // Marquez ce composant comme client

import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mettez ici les URL des vidéos à mettre en cache
    const videoUrls = [
      '/videos/herobanner-mobile.mp4',
      '/videos/minibanner.mp4',
      '/videos/newsletter.mp4',
    ];
  }, []);

  return <>{children}</>; // Rendre les enfants
}
