"use client";

import { YouTubeEmbed, TikTokEmbed, InstagramEmbed, FacebookEmbed } from 'react-social-media-embed';

export default function VideoEmbed({ url }: { url: string }) {
  if (!url) return null;

  try {
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isTikTok = url.includes('tiktok.com');
    const isInstagram = url.includes('instagram.com');
    const isFacebook = url.includes('facebook.com') || url.includes('fb.watch');

    return (
      <div className="flex justify-center w-full my-8">
        {isYouTube && <YouTubeEmbed url={url} width="100%" />}
        {isTikTok && <TikTokEmbed url={url} width={325} />}
        {isInstagram && <InstagramEmbed url={url} width={328} />}
        {isFacebook && <FacebookEmbed url={url} width={500} />}
      </div>
    );
  } catch (err) {
    console.error("Invalid URL format for embed", err);
    return null;
  }
}
