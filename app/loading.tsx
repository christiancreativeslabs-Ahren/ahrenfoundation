export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "#080d2e" }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* AF logo mark animated */}
        <div className="relative">
          <svg
            width="52"
            height="52"
            viewBox="0 0 100 100"
            fill="none"
            className="animate-pulse"
          >
            <defs>
              <linearGradient id="load-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff9d" />
                <stop offset="100%" stopColor="#00c9ff" />
              </linearGradient>
            </defs>
            <polygon points="15,85 35,15 50,15 30,85" fill="url(#load-grad)" />
            <rect x="48" y="15" width="37" height="12" rx="4" fill="url(#load-grad)" />
            <rect x="48" y="39" width="28" height="12" rx="4" fill="url(#load-grad)" />
            <rect x="48" y="15" width="12" height="70" rx="4" fill="url(#load-grad)" />
          </svg>
          {/* Rotating ring */}
          <div
            className="absolute inset-[-8px] rounded-full border-2 border-t-[#00c9ff] border-r-transparent border-b-transparent border-l-transparent animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
        </div>
        {/* Dot progress */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full grad-bg animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
