import {
	animate,
	createTimeline,
	cubicBezier,
	splitText,
	stagger,
	utils,
} from "./anime.esm.min.js";

/** INFO: campaign text content here */
export const CONTENT = {
	nav: {
		logoAriaLabel: "Jacob Henry Deck for Housing Authority",
		links: [
			{ href: "#about", text: "Why I'm Running" },
			{ href: "#blog", text: "Come Say Hi" },
		],
	},

	why: {
		heading: "Why I'm Running",
		greetings: `Hi! I'm <span id="name">Jacob Deck</span>. `,
		intro: `Arlingtonians are facing enormous challenges. Fascists in the federal
government are working overtime to make it as difficult as possible for
us to protect our most vulnerable residents. They assume that we're too
wedded to business as usual, too scared of change, and too used to the
comfortable to push back. They're wrong.`,
	},

	cards: [
		{
			id: "dialog-housing",
			title: "I'll Show Up",
			summary: `My opponent missed more than six months of board meetings over the past two years. I won't.`,
			detail: `Nicolas Mitropoulos keeps missing board meetings. He missed four AHA meetings last year, and four the year before that. AHA tenants present and future
			deserve someone with a "B"-grade attendance record. They'll get one.`,
		},
		{
			id: "dialog-budget",
			title: "Tenant Protections",
			summary: `Ensure that AHA tenants get everything they're owed by the state.`,
			detail: `Public housing tenants have ironclad legal rights that regular appartment dwellers don't. These rights protect them from pollutants, allow them to own pets, 
			protect their rights to organize, and require the state to fund cultural and social events in their buildings. Right now, tenants in our housing authority buildings are 
			missing out on grant funding, loosing their ability to own pets, and are becoming increasingly cynical about everything else. It's time to change that.
			
			An easy fix is assuring that building tennant assosciations are legally recognized. Social and cultural grants can't be issued to a building unless that building has an offical tennant's organization.
			With a little elbow grease, we can make sure that every AHA development has an official tennant authority that start recieving grant money.`,
		},
		{
			id: "dialog-green",
			title: "Housing Availability",
			summary: `Let's build the first new units of public housing in Arlington in 50 years — and fully integrate and subsidize them with market-rate units.`,
			detail: `There's currently a five-year waiting list for affordable family housing in Arlington.
With draconian laws, budget crunches, and political violence threatening the ability
of young families to live in other parts of the United States, our consciences (and school budgets!) demand
we open our doors as widely as possible to families here in Arlington.

Once upon a time, We Arlingtonians stepped up when young families were being shut out of living here. We built them an entire
neighborhoods' worth of places to live. It's our duty as a town to respond to our
present crisis with just as much construction. The current redevelopment
plan for Drake Village is a great start. Let's keep going. 

We won't repeat the mistakes of the 1950s, either. This time, by renting some units in the new developments out at market
rates, we'll make the whole AHA less reliant on state and federal funds to operate and less easy politically to ignore. As a bonus we'll
make sure that our most vulnerable families and seniors are truly integrated into the Arlington community instead of isolated
from it. Other towns and cities around the world have proved that this public housing model works. Let's roll up our sleeves and get to work.`,
		},
		{
			id: "dialog-voice",
			title: "Smarter Collaboration",
			summary: `Pursue efficiencies across other housing authorities by signing bigger contracts
for windows, doors, HVAC supplies, etc.`,
			detail: `I'm overjoyed by the cross-agency work the housing authority is doing to share HR
and other staff with other local housing authorities. Let's expand it.

When Arlington worked together with Watertown, Everett, and 11 other municipalities
to jointly purchase bus and bike lane paint, we saved over two million dollars between
us just by signing one big contract instead of 13 small ones. Let's repeat that
success, and deepen the collaboration between the housing authorities currently sharing
an HR department. We can, together, sign collective contracts for landscaping services, routine
maintenance work, electrical equipment, windows, doors, paint, solar panels, and other
items that are cheaper to buy in bulk.`,
		},
	],

	blog: {
		heading: "Come Say Hi",
		intro: `Have questions? Why not ask in person? I'll be at the following
events, <span class="Campaign-cta">wearing red</span>. Be sure to stop by and say hi.`,
		blueskyHeading: "Follow the Action",
		blueskyNote: `Can't make it? Check out my campaign blog below or follow me on`,
		blueskyHref: "https://bsky.app/profile/vote-4-jacob.bsky.social",
		blueskyText: "bluesky",
		eventsHeading: "Upcoming Events",
		donationHeading: "Want to Donate?",
		pitchOne:
			'If donating by check there is a $100 limit, please make the check payable to the "',
		pitchTwo:
			"\". For cash donations there is a $50 limit as well. If you'd like to donate through Zelle, email at",
		pitchThree: "for more details.",
		hook: "I can pick up any donations as well, please reach out, or you can mail them to:",
		donationPayto: "Committee to Elect Jacob Deck",
		donationEmail: "jacob4housing@gmail.com",
		donationAddress: "91 Dickson Ave, Arlington, MA 02474",
	},

	footer: {
		paid: "Paid for by the Committee to Elect Jacob Deck",
		disclosure: `This site is paid for by the Committee to Elect Jacob Deck. The committee is
responsible for the content of this site.`,
	},
};

const renderContent = () => {
	// nav links
	const $logo = document.querySelector(
		".Navigation-list .Navigation-list-item",
	);
	const $navList = document.querySelector(".Navigation-list");
	$navList.innerHTML = "";
	$navList.appendChild($logo);
	CONTENT.nav.links.forEach(({ href, text }) => {
		const li = document.createElement("li");
		li.className = "Navigation-list-link";
		li.innerHTML = `<a href="${href}">${text}</a>`;
		$navList.appendChild(li);
	});

	// logo
	document
		.querySelector(".Logo")
		.setAttribute("aria-label", CONTENT.nav.logoAriaLabel);

	// why section
	document.querySelector("#about h2").textContent = CONTENT.why.heading;
	document.querySelector(".Campaign-greeting").innerHTML =
		CONTENT.why.greetings;
	document.querySelector(".Campaign-intro").textContent = CONTENT.why.intro;

	// cards + dialogs
	const $cardGrid = document.querySelector(".Campaign-article-container");
	const $dialogContainer = document.querySelector(".Campaign-dialogs");
	$cardGrid.innerHTML = "";
	$dialogContainer.innerHTML = "";

	CONTENT.cards.forEach((entry, i) => {
		const id = `dialog-card-${i}`;

		const $card = document.createElement("article");
		$card.className = "Card";
		$card.dataset.dialog = id;
		$card.tabIndex = 0;
		$card.innerHTML = `
    <h3 class="Card-title">${entry.title}</h3>
    <p class="Card-description">${entry.summary}</p>
    <span class="Card-link-description" aria-hidden="true">→ Read more</span>
  `;
		$cardGrid.appendChild($card);

		const $dialog = document.createElement("dialog");
		$dialog.className = "Card-dialog";
		$dialog.id = id;
		$dialog.setAttribute("aria-labelledby", `dlabel-${i}`);
		$dialog.innerHTML = `
    <header class="Card-dialog-header">
      <h3 class="Card-dialog-title about" id="dlabel-${i}">${entry.title}</h3>
      <form method="dialog"><button class="Card-dialog-control" aria-label="Close">✕</button></form>
    </header>
    <div class="Card-dialog-container">
      ${entry.detail
				.split("\n\n")
				.map((p) => `<p class="Card-dialog-detail">${p.trim()}</p>`)
				.join("")}
    </div>
  `;
		$dialogContainer.appendChild($dialog);
	});

	// donation section
	const $donationHeader = document.querySelector(".Campaign-donation-header");
	$donationHeader.querySelector("h2").textContent =
		CONTENT.blog.donationHeading;

	const $donationInfo = $donationHeader.querySelector("p.info");
	$donationInfo.innerHTML = `
        ${CONTENT.blog.pitchOne}<span class="Campaign-donation-payto">${CONTENT.blog.donationPayto}</span>${CONTENT.blog.pitchTwo}
        <a class="Campaign-email" href="mailto:${CONTENT.blog.donationEmail}">${CONTENT.blog.donationEmail}</a>
        ${CONTENT.blog.pitchThree}
    `;

	const $donationHook = $donationHeader.querySelector("p.hook");
	$donationHook.innerHTML = `
        ${CONTENT.blog.hook}
        <address class="Campaign-donation-address">${CONTENT.blog.donationAddress}</address>
    `;

	// blog section
	document.querySelector("#blog h2").textContent = CONTENT.blog.heading;
	document.querySelector("#blog p.say-hi").innerHTML = CONTENT.blog.intro;

	// upcoming events
	document.querySelector(".Events-heading").textContent =
		CONTENT.blog.eventsHeading;

	// bluesky
	const blueskyHeader = document.getElementById("bluesky");
	blueskyHeader.querySelector("h2").textContent = CONTENT.blog.blueskyHeading;
	blueskyHeader.querySelector("p").innerHTML = `${CONTENT.blog.blueskyNote}
    <a href="${CONTENT.blog.blueskyHref}">${CONTENT.blog.blueskyText}
      <svg class="Bluesky-logo" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" />
        <line x1="128" y1="56" x2="128" y2="180" fill="none" stroke="currentColor" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="16" />
        <path
          d="M187.76,151.94c8.05.48,29.5-1.29,37.36-32.23C233.21,87.84,240.22,48,208.93,48S128,95.8,128,127.67C128,95.8,78.36,48,47.07,48S22.79,87.84,30.88,119.71c7.86,30.94,29.31,32.71,37.36,32.23"
          fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
        <path d="M88,144a36.11,36.11,0,1,0,40,36,36,36,0,1,0,40-36" fill="none" stroke="currentColor"
          stroke-linecap="round" stroke-linejoin="round" stroke-width="16" />
      </svg>
    </a>
`;

	// footer
	document.querySelector(".Campaign-footer-disclosure").innerHTML =
		`<strong>${CONTENT.footer.paid}</strong> ${CONTENT.footer.disclosure}`;
};

renderContent();

const { chars } = splitText("#name", { words: false, chars: true });

animate(chars, {
	y: [
		{ to: "-.75rem", ease: "outExpo", duration: 600 },
		{ to: 0, ease: "outBounce", duration: 800, delay: 100 },
	],
	rotate: {
		from: "-1turn",
		delay: 0,
	},
	delay: stagger(50),
	ease: "inOutCirc",
	loopDelay: 2000,
	loop: true,
});

/** INFO: date is March 28, 2026 at 8:00:00 AM */
const ELECTION_UNIX = 1774699200;

const createCountdown = () => {
	const $clock = document.getElementById("countdown-clock");
	if (!$clock) return;

	const s = 1000;
	const m = 60 * s;
	const h = 60 * m;
	const d = 24 * h;
	const onehour = h;
	const Z = "3.0ch";

	const target = ELECTION_UNIX * 1000;
	const remaining = Math.max(0, target - Date.now());
	const totalDays = Math.floor(remaining / d);
	const hoursInDay = Math.floor((remaining % d) / h);

	const makeDrum = (digit) => {
		const $el = document.createElement("div");
		$el.classList.add("CountDown-slot", "CountDown-slot-digit");
		for (let i = 0; i < 10; i++) {
			const $num = document.createElement("div");
			$num.textContent = `${i}`;
			utils.set($num, { rotateX: i * 36, z: Z });
			$el.appendChild($num);
		}
		utils.set($el, { rotateX: -(digit * 36) });
		return $el;
	};

	const makeColon = () => {
		const $el = document.createElement("div");
		$el.classList.add("CountDown-slot", "CountDown-slot-colon");
		$el.textContent = ":";
		return $el;
	};

	const dayStr = String(totalDays).padStart(2, "0");
	const dayDrums = [];
	for (const ch of dayStr) {
		const $el = makeDrum(parseInt(ch, 10));
		$clock.appendChild($el);
		dayDrums.push($el);
	}
	$clock.appendChild(makeColon());

	const hourStr = String(hoursInDay).padStart(2, "0");
	const hourDrums = [];
	for (const ch of hourStr) {
		const $el = makeDrum(parseInt(ch, 10));
		$clock.appendChild($el);
		hourDrums.push($el);
	}
	$clock.appendChild(makeColon());

	/* mm:ss drum animations */
	const slotDefs = [m * 10, m, 0, s * 10, s];

	const masterTL = createTimeline({
		defaults: { ease: "linear" },
		autoplay: false,
	});

	slotDefs.forEach((interval) => {
		const $el = document.createElement("div");
		$clock.appendChild($el);
		$el.classList.add("CountDown-slot");

		if (!interval) {
			$el.classList.add("CountDown-slot-colon");
			$el.textContent = ":";
			return;
		}

		$el.classList.add("CountDown-slot-digit");

		for (let i = 0; i < 10; i++) {
			const $num = document.createElement("div");
			$num.textContent = `${i}`;
			utils.set($num, { rotateX: i * 36, z: Z });
			$el.appendChild($num);
		}

		const canStop = interval >= s;
		const ease = canStop ? cubicBezier(1, 0, 0.6, 1.2) : "linear";
		const duration = canStop ? 650 : interval;
		const position = `+=${canStop ? interval - 650 : 0}`;

		const numTL = createTimeline({ defaults: { ease }, loop: true });
		const t = interval === m * 10 || interval === s * 10 ? 7 : 11;

		for (let i = 1; i < t; i++) {
			const rotateX = -(i * 36 + (i === t - 1 ? 360 - i * 36 : 0));
			numTL.add($el, { rotateX, duration }, position);
		}

		masterTL.sync(numTL, 0);
	});

	masterTL.duration = onehour;
	masterTL.iterationDuration = onehour;

	const nowMs = Date.now();
	const msIntoHour = nowMs % onehour;
	masterTL.currentTime = onehour - msIntoHour;
	masterTL.play();
	masterTL.reverse();

	const animateDrum = ($el, digit) => {
		animate($el, {
			rotateX: -(digit * 36),
			duration: 650,
			ease: cubicBezier(1, 0, 0.6, 1.2),
		});
	};

	let prevDayStr = dayStr;
	let prevHourStr = hourStr;

	setInterval(() => {
		const msLeft = Math.max(0, target - Date.now());
		if (msLeft <= 0) {
			$clock
				.closest(".Countdown-container")
				.querySelector(".Countdown-label").textContent =
				"Election day is here!";
			return;
		}

		const newDayStr = String(Math.floor(msLeft / d)).padStart(2, "0");
		const newHourStr = String(Math.floor((msLeft % d) / h)).padStart(2, "0");

		if (newDayStr !== prevDayStr) {
			prevDayStr = newDayStr;
			for (let i = 0; i < dayDrums.length; i++) {
				animateDrum(dayDrums[i], parseInt(newDayStr[i], 10));
			}
		}
		if (newHourStr !== prevHourStr) {
			prevHourStr = newHourStr;
			for (let i = 0; i < hourDrums.length; i++) {
				animateDrum(hourDrums[i], parseInt(newHourStr[i], 10));
			}
		}
	}, 60_000);

	// NOTE: sync time if user goes to another tab
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) return;

		const msIntoHour = Date.now() % onehour;
		masterTL.currentTime = onehour - msIntoHour;

		const msLeft = Math.max(0, target - Date.now());
		const newDayStr = String(Math.floor(msLeft / d)).padStart(2, "0");
		const newHourStr = String(Math.floor((msLeft % d) / h)).padStart(2, "0");

		if (newDayStr !== prevDayStr) {
			prevDayStr = newDayStr;
			for (let i = 0; i < dayDrums.length; i++) {
				utils.set(dayDrums[i], { rotateX: -(parseInt(newDayStr[i], 10) * 36) });
			}
		}
		if (newHourStr !== prevHourStr) {
			prevHourStr = newHourStr;
			for (let i = 0; i < hourDrums.length; i++) {
				utils.set(hourDrums[i], {
					rotateX: -(parseInt(newHourStr[i], 10) * 36),
				});
			}
		}
	});
};

const createCards = () => {
	document.querySelectorAll(".Card[data-dialog]").forEach((card) => {
		const dialog = document.getElementById(card.dataset.dialog);
		if (!dialog) return;

		const open = () => {
			document.body.style.overflow = "hidden";
			dialog.showModal();
		};

		card.addEventListener("click", open);
		card.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				open();
			}
		});

		dialog.addEventListener("close", () => {
			document.body.style.overflow = "";
		});
	});
};

document.addEventListener("DOMContentLoaded", () => {
	createCountdown();
	createCards();
});
