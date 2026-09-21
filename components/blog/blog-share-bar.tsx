"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

// Facebook, Linkedin,

type BlogShareBarProps = {
  title: string;
  /** Absolute URL, e.g. https://www.ahrenfoundation.org/blog/my-slug */
  url: string;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.924L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 8h3V4h-3c-3.314 0-5 1.686-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.552.448-1 1-1z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.5 8.5A2.5 2.5 0 1 0 6.5 3a2.5 2.5 0 0 0 0 5.5zM4 10h5v11H4V10zm7 0h4.8v1.5h.1c.67-1.2 2.3-2 3.8-2 4.05 0 4.8 2.67 4.8 6.15V21h-5v-4.75c0-1.13-.02-2.58-1.58-2.58-1.58 0-1.82 1.23-1.82 2.5V21h-5V10z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.228-8.184-3.574C2.35 18.44 1.5 15.586 1.5 12.002 1.5 5.9 5.9 1.5 12 1.5s10.5 4.4 10.5 10.502c0 3.584-.85 6.438-2.495 8.424-1.85 2.346-4.603 3.55-8.184 3.574zM12 3.3c-4.79 0-8.7 3.91-8.7 8.702 0 3.13.73 5.58 2.17 7.29 1.52 1.8 3.84 2.78 6.53 2.8h.006c2.69-.02 5.01-1 6.53-2.8 1.44-1.71 2.17-4.16 2.17-7.29C20.7 7.21 16.79 3.3 12 3.3zm.18 14.85c-2.52 0-4.35-1.35-4.35-3.21 0-1.32.9-2.28 2.37-2.76-.66-.42-1.05-1.02-1.05-1.8 0-1.5 1.38-2.61 3.21-2.61 1.71 0 3.03.99 3.03 2.37 0 .9-.48 1.62-1.35 2.07 1.59.45 2.64 1.5 2.64 3.03 0 1.92-1.92 3.91-4.5 3.91zm-.18-7.68c-.84 0-1.41.51-1.41 1.17s.57 1.17 1.41 1.17 1.41-.51 1.41-1.17-.57-1.17-1.41-1.17zm.18 6.12c1.5 0 2.7-1.05 2.7-2.31 0-.96-.84-1.71-2.25-1.95-.45.27-.96.42-1.53.42-1.32 0-2.19.66-2.19 1.53 0 1.05 1.2 2.31 3.27 2.31z" />
    </svg>
  );
}

const btnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full text-[#8892b0] transition hover:text-white";

const btnStyle = {
  border: "1px solid rgba(0,201,255,0.15)",
  background: "rgba(0,201,255,0.06)",
} as const;

export function BlogShareBar({ title, url }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    threads: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
  };

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#00c9ff]">
        <Share2 size={14} />
        Share
      </span>

      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={btnClass}
        style={btnStyle}
      >
        <FacebookIcon className="h-4 w-4" />
      </a>

      <a
        href={links.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={btnClass}
        style={btnStyle}
      >
        <XIcon className="h-4 w-4" />
      </a>

      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={btnClass}
        style={btnStyle}
      >
        <LinkedinIcon className="h-4 w-4" />
      </a>

      <a
        href={links.threads}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Threads"
        className={btnClass}
        style={btnStyle}
      >
        <ThreadsIcon className="h-4 w-4" />
      </a>

      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className={btnClass}
        style={btnStyle}
      >
        {copied ? (
          <Check size={16} className="text-[#00ff9d]" />
        ) : (
          <Copy size={16} />
        )}
      </button>

      {copied ? (
        <span className="text-xs font-medium text-[#00ff9d]">Link copied</span>
      ) : null}
    </div>
  );
}
