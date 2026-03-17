const FEED_CONFIG = {
	handle: "vote-4-jacob.bsky.social",
	displayLimit: 6, // how many posts to show
	limit: 20, // fetch additional posts to account for filtering
	hashtagFilter: [], // empty = show all or only show posts with specific hashtags ex [blog]
};

const CAMPAIGN_EVENTS = [
	{
		date: "2026-03-12",
		event: "Winslow Towers Tenant Assoc.",
		time: "7:00 PM",
		address:
			"https://www.google.com/maps/place/Robbins+Memorial+Town+Hall/@42.4159183,-71.1563489,17z/data=!3m1!4b1!4m6!3m5!1s0x89e376501b568d15:0xa6be507ef9200f0e!8m2!3d42.4159183!4d-71.1563489!16s%2Fg%2F1v1vf601?entry=ttu",
	},
	{
		date: "2026-03-14",
		event: "Door Knocking - Meet @ Uncle Sam Statue",
		time: "10:00 AM",
		address:
			"https://www.google.com/maps/place/Uncle+Sam+Memorial+Statue/data=!4m2!3m1!1s0x0:0xf67f8c91a6576e49?sa=X&ved=1t:2428&ictx=111",
	},
	{
		date: "2026-03-15",
		event: "Door Knocking - Meet @ Uncle Sam Statue",
		time: "10:00 AM",
		address:
			"https://www.google.com/maps/place/Uncle+Sam+Memorial+Statue/data=!4m2!3m1!1s0x0:0xf67f8c91a6576e49?sa=X&ved=1t:2428&ictx=111",
	},
	{
		date: "2026-03-18",
		event: "ACMI Candidates Night @ Town Hall",
		time: "7:30 PM",
		address:
			"https://www.google.com/maps/place/Robbins+Memorial+Town+Hall/@42.4159183,-71.1563489,17z/data=!3m1!4b1!4m6!3m5!1s0x89e376501b568d15:0xa6be507ef9200f0e!8m2!3d42.4159183!4d-71.1563489!16s%2Fg%2F1v1vf601?entry=ttu",
	},
	{
		date: "2026-03-19",
		event: "Cusack Terrace Tenant Assoc. Meeting",
		time: "6:00 PM",
		address:
			"https://www.google.com/maps/place/Cusack+Terrace/@42.4191301,-71.1531098,19z/data=!4m6!3m5!1s0x89e3765bb914cf17:0x795ef9069ee5e2e4!8m2!3d42.4190776!4d-71.1525614!16s%2Fg%2F11bzrfx981!5m1!1e2?entry=ttu",
	},
];

async function fetchBlueskyPosts(handle, limit) {
	try {
		const response = await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}`,
			{ cache: "default" },
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data.feed;
	} catch (error) {
		console.error("Error fetching Bluesky posts:", error);
		return [];
	}
}

function filterByHashtags(posts, hashtags) {
	if (!hashtags || hashtags.length === 0) return posts;

	const tags = hashtags.map((t) => t.toLowerCase().replace(/^#/, ""));

	return posts.filter((item) => {
		const text = item.post.record.text.toLowerCase();
		return tags.some((tag) => text.includes(`#${tag}`));
	});
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
	}).format(date);
}

function formatTime(dateString) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

function highlightHashtags(text) {
	return text.replace(/#(\w+)/g, '<span class="Post-tag">#$1</span>');
}

function getPostImages(post) {
	const embed = post.embed;
	if (!embed) return [];

	if (embed.$type === "app.bsky.embed.images#view" && embed.images) {
		return embed.images.map((img) => ({
			thumb: img.thumb,
			alt: img.alt || "",
		}));
	}

	if (
		embed.$type === "app.bsky.embed.recordWithMedia#view" &&
		embed.media?.$type === "app.bsky.embed.images#view"
	) {
		return embed.media.images.map((img) => ({
			thumb: img.thumb,
			alt: img.alt || "",
		}));
	}

	return [];
}

function renderPosts(posts) {
	const container = document.getElementById("bluesky-posts");

	if (posts.length === 0) {
		container.innerHTML =
			'<p class="Campaign-blog__error">No posts to show right now.</p>';
		return;
	}

	container.innerHTML = posts
		.map((item) => {
			const post = item.post;
			const text = post.record.text;
			const createdAt = post.record.createdAt;
			const avatar = post.author.avatar || "";
			const handle = post.author.handle;
			const postUrl = `https://bsky.app/profile/${handle}/post/${post.uri.split("/").pop()}`;
			const images = getPostImages(post);

			const imagesHtml =
				images.length > 0
					? `<div class="Post-images">${images.map((img) => `<img class="Post-image" src="${img.thumb}" alt="${img.alt}" loading="lazy" />`).join("")}</div>`
					: "";

			return `
        <a class="Post" href="${postUrl}" target="_blank" rel="noopener noreferrer">
          <div class="Post-author">
            ${avatar ? `<img class="Post-avatar" src="${avatar}" alt="" width="36" height="36" loading="lazy" />` : `<div class="Post-avatar Post-avatar-fallback"></div>`}
            <span class="Post-handle">@${handle}</span>
          </div>
          <div class="Post-body">
            <p class="Post-content">${highlightHashtags(text)}</p>
            ${imagesHtml}
          </div>
          <time class="Post-date" datetime="${createdAt}">
            ${formatDate(createdAt)} · ${formatTime(createdAt)}
          </time>
          <p class="Post-link" aria-hidden="true">View on Bluesky →</p>
        </a>
      `;
		})
		.join("");
}

/**
 * Get today's date string as YYYY-MM-DD for comparison.
 */
function getTodayStr() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getEventStatus(dateStr) {
	const now = new Date();
	const [year, month, day] = dateStr.split("-").map(Number);
	const eventDate = new Date(year, month - 1, day);

	const msUntil = eventDate.getTime() - now.getTime();
	const hoursUntil = msUntil / (1000 * 60 * 60);

	if (hoursUntil < -26) return "past";
	if (hoursUntil <= 24) return "today";
	return "future";
}

/**
 * Filter events: show the 2 most recent past events + up to 5 current/future events = 7 total max.
 */
function filterEvents(events) {
	const todayStr = getTodayStr();

	const past = events.filter((e) => e.date < todayStr);
	const currentAndFuture = events.filter((e) => e.date >= todayStr);

	const recentPast = past.slice(-2); // last 2 past events (most recent)
	const upcomingSlice = currentAndFuture.slice(0, 5); // first 5 upcoming

	return [...recentPast, ...upcomingSlice];
}

function formatEventDate(dateStr) {
	const [year, month, day] = dateStr.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	}).format(date);
}

function renderEvents() {
	const list = document.getElementById("events-list");
	if (!list) return;

	const visibleEvents = filterEvents(CAMPAIGN_EVENTS);

	list.innerHTML = visibleEvents
		.map((evt) => {
			const status = getEventStatus(evt.date);
			return `
      <li class="Events-item Events-item--${status}">
        <a href="${evt.address}" target="_blank" rel="noopener noreferrer">
          <span class="Events-event-name">${evt.event}</span>
          <span class="Events-meta">
            <span>${formatEventDate(evt.date)}</span>
            <span>·</span>
            <span>${evt.time}</span>
          </span>
        </a>
      </li>
    `;
		})
		.join("");
}

async function init() {
	renderEvents();

	const { handle, limit, displayLimit, hashtagFilter } = FEED_CONFIG;
	let posts = await fetchBlueskyPosts(handle, limit);
	posts = filterByHashtags(posts, hashtagFilter);
	posts = posts.slice(0, displayLimit);
	renderPosts(posts);
}

init();
