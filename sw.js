// 오프라인용: 한 번 열면 인터넷 없이도 열려. 데이터 바꾸면 VERSION 숫자를 올려줘.
const VERSION = "yt-v16";
const FILES = ["./", "index.html", "data.js", "manifest.webmanifest",
  "fonts/Pretendard-Black.woff", "fonts/Pretendard-SemiBold.woff",
  "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 인터넷 되면 최신 걸 받고, 안 되면 저장해둔 걸 보여줌
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
