import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StockApp",
    short_name: "StockApp",
    description: "StockApp",
    start_url: "/",
    display: "standalone",
    background_color: "#081824",
    theme_color: "#10263A",
    icons: [
      {
        src: "app-images/android/android-launchericon-512-512.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: "app-images/android/android-launchericon-192-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "app-images/android/android-launchericon-144-144.png",
        type: "image/png",
        sizes: "144x144",
      },
      {
        src: "app-images/android/android-launchericon-96-96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        src: "app-images/android/android-launchericon-72-72.png",
        type: "image/png",
        sizes: "72x72",
      },
      {
        src: "app-images/android/android-launchericon-48-48.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        src: "app-images/ios/16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        src: "app-images/ios/20.png",
        type: "image/png",
        sizes: "20x20",
      },
      {
        src: "app-images/ios/29.png",
        type: "image/png",
        sizes: "29x29",
      },
      {
        src: "app-images/ios/32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        src: "app-images/ios/40.png",
        type: "image/png",
        sizes: "40x40",
      },
      {
        src: "app-images/ios/50.png",
        type: "image/png",
        sizes: "50x50",
      },
      {
        src: "app-images/ios/57.png",
        type: "image/png",
        sizes: "57x57",
      },
      {
        src: "app-images/ios/58.png",
        type: "image/png",
        sizes: "58x58",
      },
      {
        src: "app-images/ios/60.png",
        type: "image/png",
        sizes: "60x60",
      },
      {
        src: "app-images/ios/64.png",
        type: "image/png",
        sizes: "64x64",
      },
      {
        src: "app-images/ios/72.png",
        type: "image/png",
        sizes: "72x72",
      },
      {
        src: "app-images/ios/76.png",
        type: "image/png",
        sizes: "76x76",
      },
      {
        src: "app-images/ios/80.png",
        type: "image/png",
        sizes: "80x80",
      },
      {
        src: "app-images/ios/87.png",
        type: "image/png",
        sizes: "87x87",
      },
      {
        src: "app-images/ios/100.png",
        type: "image/png",
        sizes: "100x100",
      },
      {
        src: "app-images/ios/114.png",
        type: "image/png",
        sizes: "114x114",
      },
      {
        src: "app-images/ios/120.png",
        type: "image/png",
        sizes: "120x120",
      },
      {
        src: "app-images/ios/128.png",
        type: "image/png",
        sizes: "128x128",
      },
      {
        src: "app-images/ios/144.png",
        type: "image/png",
        sizes: "144x144",
      },
      {
        src: "app-images/ios/152.png",
        type: "image/png",
        sizes: "152x152",
      },
      {
        src: "app-images/ios/167.png",
        type: "image/png",
        sizes: "167x167",
      },
      {
        src: "app-images/ios/180.png",
        type: "image/png",
        sizes: "180x180",
      },
      {
        src: "app-images/ios/192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "app-images/ios/256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        src: "app-images/ios/512.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        src: "app-images/ios/1024.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
  };
}
