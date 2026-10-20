```javascript
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://checkmaitrex-activities-sync.elianssotero11.workers.dev/api/posts";

  const d = document.createElement("div");
  d.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:#1a1a2e;color:#0f0;font-family:monospace;font-size:12px;padding:8px;white-space:pre-wrap;word-break:break-all;";
  d.textContent = "[1] Script loaded";
  document.body.appendChild(d);

  function log(msg) { d.textContent += "\n" + msg; }

  log("[2] Fetching: " + API_URL);

  fetch(API_URL)
    .then(r => {
      log("[3] Status: " + r.status);
      return r.json();
    })
    .then(data => {
      log("[4] success=" + data.success + " count=" + (data.posts ? data.posts.length : 0));
      if (data.posts && data.posts.length > 0) {
        log("[5] First post: " + (data.posts[0].message || "").slice(0, 50));
        log("[6] DONE - API is working!");
      } else {
        log("[5] No posts found");
      }
    })
    .catch(err => {
      log("[X] ERROR: " + err.message);
    });
});
```
