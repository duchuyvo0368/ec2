import got from "got";
import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperUrl from "metascraper-url";

export async function extractMetadata(url: string) {
     const { body: html, url: finalUrl } = await got(url);

     const scraper = metascraper([
          metascraperTitle(),
          metascraperDescription(),
          metascraperImage(),
          metascraperUrl(),
     ]);

     const metadata = await scraper({ html, url: finalUrl });

     let post_link_video = "";
     let type: "youtube" | "tiktok" | "facebook" | "other" = "other";

     if (url.includes("youtube.com") || url.includes("youtu.be")) {
          type = "youtube";
          const videoId = url.includes("youtube.com")
               ? new URL(url).searchParams.get("v")
               : url.split("/").pop()?.split("?")[0];
          if (videoId) post_link_video = `https://www.youtube.com/embed/${videoId}`;
     } else if (url.includes("tiktok.com")) {
          type = "tiktok";
          const match = url.match(/video\/(\d+)/);
          if (match) post_link_video = `https://www.tiktok.com/embed/${match[1]}`;
     } else if (url.includes("facebook.com")) {
          type = "facebook";
          post_link_video = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
               url
          )}&show_text=0&width=560`;
     }

     return {
          post_link_url: url,
          post_link_title: metadata.title || "",
          post_link_description: metadata.description || "",
          post_link_image: metadata.image || "",
          post_link_video,
          type,
     };
}
