
(() => {
  "use strict";

  const API_URL =
    "https://checkmaitrex-activities-sync.elianssotero11.workers.dev/api/posts";

  const PAGE_CONFIG = {
    "activities.html": {
      title: "Latest Activities",
      subtitle: "Events, chess development, and tournaments.",
      categories: ["Events", "Chess Developments", "Tournaments"]
    },
    "events.html": {
      title: "Events",
      subtitle: "Latest event announcements from the club.",
      categories: ["Events"]
    },
    "development.html": {
      title: "Chess Developments",
      subtitle: "Learning, training, and chess development.",
      categories: ["Chess Developments"]
    },
    "tournaments.html": {
      title: "Tournaments",
      subtitle: "Tournament announcements and updates.",
      categories: ["Tournaments"]
    },
    "highlights.html": {
      title: "Club Highlights",
      subtitle: "Achievements, photos, news, and updates.",
      categories: ["Achievements", "Club Gallery", "News & Updates"]
    },
    "achievements.html": {
      title: "Achievements",
      subtitle: "Milestones from our chess community.",
      categories: ["Achievements"]
    },
    "gallery.html": {
      title: "Club Gallery",
      subtitle: "Photos shared by the official club page.",
      categories: ["Club Gallery"]
    },
    "news.html": {
      title: "News & Updates",
      subtitle: "Official announcements from the club.",
      categories: ["News & Updates"]
    }
  };

  const page = location.pathname.split("/").pop().toLowerCase();
  const config = PAGE_CONFIG[page];

  if (!config) {
  console.error(
    "[CheckmaitreX] No page configuration found:",
    location.pathname
  );
  return;
}

const existingFeed = document.getElementById("facebook-posts-feed");

if (existingFeed) {
  existingFeed.remove();
}

  const style = document.createElement("style");
  style.textContent = `
    #facebook-posts-feed {
      max-width: 1120px;
      margin: 0 auto;
      padding: 48px 22px 64px;
      color: #f5f5f5;
    }
    #facebook-posts-feed .feed-heading {
      text-align: center;
      margin-bottom: 28px;
    }
    #facebook-posts-feed .feed-eyebrow {
      color: #d4af37;
      font-size: .78rem;
      font-weight: 700;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    #facebook-posts-feed h2 {
      color: #fff;
      font-size: clamp(1.7rem, 4vw, 2.5rem);
      margin: 10px 0;
    }
    #facebook-posts-feed .feed-subtitle {
      color: #bbb;
      line-height: 1.7;
    }
    #facebook-posts-feed .feed-status {
      text-align: center;
      padding: 22px;
      background: #111;
      border: 1px solid #51451e;
      border-radius: 12px;
      color: #ddd;
    }
    #facebook-posts-feed .feed-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    #facebook-posts-feed .feed-card {
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #121212;
      border: 1px solid rgba(212,175,55,.3);
      border-radius: 14px;
    }
    #facebook-posts-feed .feed-image,
    #facebook-posts-feed .feed-placeholder {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      background: #191919;
      border-bottom: 1px solid rgba(212,175,55,.25);
    }
    #facebook-posts-feed .feed-placeholder {
      display: grid;
      place-items: center;
      color: #d4af37;
      font-size: 2.5rem;
    }
    #facebook-posts-feed .feed-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    #facebook-posts-feed .feed-meta {
      color: #c5b987;
      font-size: .78rem;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    #facebook-posts-feed .feed-message {
      color: #e5e5e5;
      line-height: 1.75;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      margin: 0 0 18px;
    }
    #facebook-posts-feed .feed-link {
      color: #d4af37;
      text-decoration: none;
      font-weight: 700;
      margin-top: auto;
    }
    #facebook-posts-feed .feed-link:hover {
      text-decoration: underline;
      color: #f4d879;
    }
    @media (max-width: 850px) {
      #facebook-posts-feed .feed-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 560px) {
      #facebook-posts-feed .feed-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = "facebook-posts-feed";
  section.innerHTML = `
    <div class="feed-heading">
      <p class="feed-eyebrow">Official Facebook Page</p>
      <h2></h2>
      <p class="feed-subtitle"></p>
    </div>
    <p class="feed-status" role="status" aria-live="polite">
      Loading the latest club posts…
    </p>
    <div class="feed-grid"></div>
  `;

  section.querySelector("h2").textContent = config.title;
  section.querySelector(".feed-subtitle").textContent = config.subtitle;

  const footer = document.querySelector("footer");
  const main = document.querySelector("main");

  if (footer?.parentNode) {
    footer.parentNode.insertBefore(section, footer);
  } else if (main) {
    main.appendChild(section);
  } else {
    return;
  }

  const status = section.querySelector(".feed-status");
  const grid = section.querySelector(".feed-grid");

  function formatDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function createPost(post) {
    const card = document.createElement("article");
    card.className = "feed-card";

    if (post.image) {
      const image = document.createElement("img");
      image.className = "feed-image";
      image.alt = "Photo from a CheckmaîtréX Chess Club Facebook post";
      image.loading = "lazy";
      image.src = post.image;

      image.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "feed-placeholder";
        placeholder.textContent = "♟";
        placeholder.setAttribute("aria-hidden", "true");
        image.replaceWith(placeholder);
      }, { once: true });

      card.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "feed-placeholder";
      placeholder.textContent = "♟";
      placeholder.setAttribute("aria-hidden", "true");
      card.appendChild(placeholder);
    }

    const body = document.createElement("div");
    body.className = "feed-body";

    const meta = document.createElement("div");
    meta.className = "feed-meta";
    meta.textContent =
      `${(post.categories || [post.category]).filter(Boolean).join(" · ")} · ` +
      formatDate(post.created_time);

    const message = document.createElement("p");
    message.className = "feed-message";
    message.textContent = post.message ||
      "A new update was shared by CheckmaîtréX Chess Club.";

    body.append(meta, message);

    if (post.permalink_url) {
      const link = document.createElement("a");
      link.className = "feed-link";
      link.href = post.permalink_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View Facebook post ↗";
      body.appendChild(link);
    }

    card.appendChild(body);
    return card;
  }

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error(
            "The Facebook feed is waiting for its first successful sync."
          );
        }
        throw new Error(`Feed service error: HTTP ${response.status}.`);
      }
      return response.json();
    })
    .then(data => {
      if (!data.success || !Array.isArray(data.posts)) {
        throw new Error(data.error || "Invalid feed response.");
      }

      const allowed = new Set(config.categories);

      const posts = data.posts
        .filter(post =>
          (post.categories || [post.category])
            .some(category => allowed.has(category))
        )
        .sort((a, b) =>
          new Date(b.created_time || 0) -
          new Date(a.created_time || 0)
        );

      status.remove();

      if (!posts.length) {
        const empty = document.createElement("p");
        empty.className = "feed-status";
        empty.textContent =
          "No posts have been assigned to this category yet.";
        grid.replaceWith(empty);
        return;
      }

      const fragment = document.createDocumentFragment();
      posts.forEach(post => fragment.appendChild(createPost(post)));
      grid.appendChild(fragment);
    })
    .catch(error => {
      status.textContent =
        error.message || "Unable to load Facebook posts right now.";
    });
})();
