/* All jQuery code is wrapped inside $(document).ready() */

/* ─ DATA ─ */

const skillsData = [
  { name: "HTML5 / CSS3",       pct: 95, cat: "Frontend" },
  { name: "JavaScript (ES6+)",  pct: 90, cat: "Frontend" },
  { name: "React.js",           pct: 88, cat: "Frontend" },
  { name: "Vue.js",             pct: 75, cat: "Frontend" },
  { name: "Tailwind CSS",       pct: 85, cat: "Frontend" },
  { name: "Node.js",            pct: 82, cat: "Backend"  },
  { name: "Express.js",         pct: 80, cat: "Backend"  },
  { name: "Python / Django",    pct: 72, cat: "Backend"  },
  { name: "PostgreSQL",         pct: 78, cat: "Database" },
  { name: "MongoDB",            pct: 74, cat: "Database" },
  { name: "Git / GitHub",       pct: 92, cat: "Tools"    },
  { name: "Figma / UI Design",  pct: 80, cat: "Design"   },
];

const projectsData = [
  {
    title: "ShopSmart — E-Commerce Platform",
    desc:  "Full-stack MERN app with Stripe payments, real-time inventory, and an admin dashboard.",
    cat:   "web",
    tech:  ["React", "Node.js", "MongoDB", "Stripe"]
  },
  {
    title: "FitTrack — Workout App",
    desc:  "Cross-platform mobile app (React Native) for logging workouts with progress charts.",
    cat:   "mobile",
    tech:  ["React Native", "Firebase", "Expo"]
  },
  {
    title: "DesignKit — UI Component Library",
    desc:  "Accessible, themeable component system with 40+ reusable React components.",
    cat:   "ui",
    tech:  ["React", "Storybook", "CSS Modules"]
  },
  {
    title: "Portfolio Builder — SaaS Tool",
    desc:  "Drag-and-drop portfolio editor that generates static sites and deploys to Vercel.",
    cat:   "web",
    tech:  ["Next.js", "TypeScript", "Tailwind", "Vercel"]
  },
  {
    title: "MealMate — Recipe Finder",
    desc:  "Mobile app that suggests recipes based on ingredients you already have at home.",
    cat:   "mobile",
    tech:  ["Flutter", "Dart", "Spoonacular API"]
  },
  {
    title: "BrandForge — Design System",
    desc:  "End-to-end visual identity system with tokens, typography scales, and brand guidelines.",
    cat:   "ui",
    tech:  ["Figma", "Style Dictionary", "CSS Variables"]
  },
];

const extraProjectsData = [
  {
    title: "WeatherNow — Dashboard",
    desc:  "Real-time weather dashboard using OpenWeatherMap API with 5-day forecast charts.",
    cat:   "web",
    tech:  ["Vanilla JS", "Chart.js", "OpenWeatherMap"]
  },
  {
    title: "TaskFlow — Kanban Board",
    desc:  "Drag-and-drop project management tool inspired by Trello with local storage sync.",
    cat:   "web",
    tech:  ["Vue.js", "Vuex", "LocalStorage"]
  },
];

/* ─ HELPERS ─ */

function buildProjectCard(proj) {
  const catClass = { web: "cat-web", mobile: "cat-mobile", ui: "cat-ui" }[proj.cat] || "";
  const catLabel = { web: "Web", mobile: "Mobile", ui: "UI/UX" }[proj.cat] || proj.cat;
  const techHTML = proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join("");
  return `
    <div class="project-card" data-cat="${proj.cat}">
      <span class="project-category ${catClass}">${catLabel}</span>
      <h3>${proj.title}</h3>
      <p>${proj.desc}</p>
      <div class="project-tech">${techHTML}</div>
    </div>`;
}

function buildSkillCard(skill) {
  return `
    <div class="skill-card" data-name="${skill.name.toLowerCase()}">
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-pct">${skill.pct}%</span>
      </div>
      <span class="skill-tag">${skill.cat}</span>
      <div class="skill-bar-bg">
        <div class="skill-bar-fill" data-pct="${skill.pct}"></div>
      </div>
    </div>`;
}

/* ─ VANILLA JS FEATURES ─ */

// [JS Feature 1] Dynamic DOM manipulation: footer year
document.getElementById("footerYear").textContent = new Date().getFullYear();

// [JS Feature 2] Load and render skills data (arrays + createElement logic via innerHTML)
function renderSkills(filter = "") {
  const grid = document.getElementById("skillsGrid");
  const noMsg = document.getElementById("noSkillsMsg");
  const filtered = skillsData.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.cat.toLowerCase().includes(filter.toLowerCase())
  );
  if (filtered.length === 0) {
    grid.innerHTML = "";
    noMsg.style.display = "block";
  } else {
    noMsg.style.display = "none";
    grid.innerHTML = filtered.map(buildSkillCard).join("");
  }
}

// [JS Feature 3] Load and render projects data
function renderProjects(filter = "all") {
  const grid = document.getElementById("projectsGrid");
  const filtered = filter === "all"
    ? projectsData
    : projectsData.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map(buildProjectCard).join("");

  // Also render extras
  document.getElementById("extraProjectsGrid").innerHTML =
    extraProjectsData.map(buildProjectCard).join("");
}

// [JS Feature 5] Animate skill bars (triggered by button, width set via JS)
let barsAnimated = false;
document.getElementById("animateSkillsBtn").addEventListener("click", function () {
  const bars = document.querySelectorAll(".skill-bar-fill");
  bars.forEach(bar => {
    bar.style.width = "0";  // Reset first
  });
  // Force reflow then animate
  setTimeout(() => {
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute("data-pct") + "%";
    });
    barsAnimated = true;
  }, 50);
  this.textContent = "✔ Animated!";
  this.disabled = true;
  setTimeout(() => {
    this.textContent = "▶ Animate Bars";
    this.disabled = false;
  }, 2000);
});

// [JS Feature 6] Skill search / filter
document.getElementById("skillSearch").addEventListener("input", function () {
  renderSkills(this.value);
  // Re-animate bars if they were already animated
  if (barsAnimated) {
    setTimeout(() => {
      document.querySelectorAll(".skill-bar-fill").forEach(bar => {
        bar.style.width = bar.getAttribute("data-pct") + "%";
      });
    }, 60);
  }
});

// [JS Feature 7] Form validation + message log (createElement + appendChild)
const messageStore = []; // in-memory store of all submitted messages

function getInitials(name) {
  return name.trim().split(" ").map(w => w[0].toUpperCase()).slice(0, 2).join("");
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
         " · " + date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function renderMessageLog() {
  const list = document.getElementById("msgList");
  list.innerHTML = "";
  messageStore.forEach(function(msg) {
    // Build entry using createElement + appendChild
    const entry = document.createElement("div");
    entry.className = "msg-entry";

    const meta = document.createElement("div");
    meta.className = "msg-meta";

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = getInitials(msg.name);

    const senderInfo = document.createElement("div");

    const senderName = document.createElement("div");
    senderName.className = "msg-sender-name";
    senderName.textContent = msg.name;

    const senderEmail = document.createElement("div");
    senderEmail.className = "msg-sender-email";
    senderEmail.textContent = msg.email;

    senderInfo.appendChild(senderName);
    senderInfo.appendChild(senderEmail);

    const timeEl = document.createElement("span");
    timeEl.className = "msg-time";
    timeEl.textContent = formatTime(msg.time);

    meta.appendChild(avatar);
    meta.appendChild(senderInfo);
    meta.appendChild(timeEl);

    const body = document.createElement("div");
    body.className = "msg-body";
    body.textContent = msg.message;

    entry.appendChild(meta);
    entry.appendChild(body);
    list.appendChild(entry);
  });
}

document.getElementById("sendBtn").addEventListener("click", function () {
  const nameEl    = document.getElementById("fname");
  const emailEl   = document.getElementById("femail");
  const messageEl = document.getElementById("fmessage");
  const feedback  = document.getElementById("formFeedback");

  [nameEl, emailEl, messageEl].forEach(el => el.classList.remove("error"));

  let errors = [];
  if (!nameEl.value.trim())    { nameEl.classList.add("error");    errors.push("Name"); }
  if (!emailEl.value.trim() || !emailEl.value.includes("@"))
                               { emailEl.classList.add("error");   errors.push("valid Email"); }
  if (!messageEl.value.trim()) { messageEl.classList.add("error"); errors.push("Message"); }

  if (errors.length > 0) {
    feedback.className = "form-feedback error-msg";
    feedback.innerHTML = `⚠ Please fill in: <strong>${errors.join(", ")}</strong>.`;
    feedback.style.display = "block";
  } else {
    // Store the message
    messageStore.unshift({
      name:    nameEl.value.trim(),
      email:   emailEl.value.trim(),
      message: messageEl.value.trim(),
      time:    new Date()
    });

    // Show success
    feedback.className = "form-feedback success";
    feedback.innerHTML = `✅ Thanks <strong>${nameEl.value.trim()}</strong>! Message received. Check below 👇`;
    feedback.style.display = "block";

    // Clear fields
    nameEl.value = ""; emailEl.value = ""; messageEl.value = "";
    [nameEl, emailEl, messageEl].forEach(el => el.classList.remove("error"));

    // Render log & show it
    renderMessageLog();
    document.getElementById("messageLog").style.display = "block";

    setTimeout(() => { feedback.style.display = "none"; }, 5000);
  }
});

// Clear all messages
document.getElementById("clearLogBtn").addEventListener("click", function () {
  messageStore.length = 0;
  document.getElementById("messageLog").style.display = "none";
});

// Resume download (creates a temporary link)
document.getElementById("downloadBtn").addEventListener("click", function () {
  // Creates and appends an element, then removes it (createElement + appendChild)
  const link = document.createElement("a");
  link.href = "data/resume.pdf"; // placeholder PDF
  link.download = "Dwain_Bug-os_Resume.pdf";
  link.setAttribute("aria-hidden", "true");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Feedback
  const btn = this;
  btn.textContent = "⬇ Downloading…";
  setTimeout(() => { btn.textContent = "⬇ Download Resume"; }, 2000);
});

/* ─ INITIAL RENDER ─*/
renderSkills();
renderProjects();

/* ─ JQUERY FEATURES ─
   All jQuery code inside $(document).ready()

   Methods used: on(), toggleClass(), text(), html(),
                  show(), hide(), toggle(), addClass(), removeClass(), val() */

$(document).ready(function () {

  /* [jQuery 1] Dark Mode Toggle — toggleClass() + text() */
  $("#darkModeToggle").on("click", function () {
    $("body").toggleClass("dark");
    const isDark = $("body").hasClass("dark");
    $("#modeIcon").text(isDark ? "☽" : "☀");
    $(this).attr("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  });

  /* [jQuery 2] Project Filter Buttons — addClass() / removeClass() + show() / hide() */
  $(document).on("click", ".filter-btn", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    const filter = $(this).data("filter");
    renderProjects(filter);

    // Animate in new cards
    $(".project-card").hide().fadeIn(250);
  });

  /* [jQuery 3] Hire Me popup — show() / hide() + html() */
  $("#hireBtn").on("click", function () {
    $("#hireOverlay").show();
  });

  $("#closeHire, #hireOverlay").on("click", function (e) {
    if (e.target === this) {
      $("#hireOverlay").hide();
    }
  });

  // Inner panel click doesn't close overlay
  $(".hire-panel").on("click", function (e) { e.stopPropagation(); });

  $("#hireGoContact").on("click", function () {
    $("#hireOverlay").hide();
    $("html, body").animate({ scrollTop: $("#contact").offset().top - 70 }, 500);
  });

  /* [jQuery 4] View More Projects — toggle() + text() */
  $("#toggleMoreBtn").on("click", function () {
    $("#moreProjects").toggle(300);
    const isOpen = $("#moreProjects").is(":visible");
    $(this).text(isOpen ? "View Less Projects ↑" : "View More Projects ↓");
  });

  /* [jQuery 5] Navigation link for smooth scroll on click */
  $(".nav-links a").on("click", function (e) {
    const target = $(this).attr("href");
    if (target.startsWith("#")) {
      e.preventDefault();
      const offset = $(target).offset().top - 70;
      $("html, body").animate({ scrollTop: offset }, 500);
    }
  });

  /* [jQuery 6] Active navigation highlight on scroll — addClass / removeClass */
  $(window).on("scroll", function () {
    const scrollY = $(this).scrollTop() + 80;
    $(".section").each(function () {
      const top    = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id     = $(this).attr("id");
      if (scrollY >= top && scrollY < bottom) {
        $(".nav-links a").removeClass("active-nav");
        $(`.nav-links a[href="#${id}"]`).addClass("active-nav");
      }
    });
  });

  /* [jQuery 7] Contact form — jQuery val() demo: live character counter on message field */
  $("#fmessage").on("input", function () {
    const len = $(this).val().length;
    let counter = $("#msgCounter");
    if (counter.length === 0) {
      counter = $('<small id="msgCounter" style="display:block;text-align:right;font-size:0.75rem;color:var(--ink-muted);margin-top:0.25rem;"></small>');
      $(this).after(counter);
    }
    counter.text(len + " character" + (len !== 1 ? "s" : ""));
  });

  /* [jQuery 8] Profile photo — fun toggle on click (attr + toggleClass) */
  $("#profilePhoto").on("click", function () {
    $(this).toggleClass("flipped");
    const isFlipped = $(this).hasClass("flipped");
    $(this).attr("title", isFlipped ? "Click to restore!" : "Click me!");
    if (isFlipped) {
      $(this).css("filter", "sepia(60%) hue-rotate(180deg)");
    } else {
      $(this).css("filter", "none");
    }
  });

  /* Active nav style */
  $("<style>")
    .text(".nav-links a.active-nav { background: var(--accent-lt); color: var(--accent); }")
    .appendTo("head");

  /* Entrance animation on skill cards */
  function revealOnScroll() {
    $(".skill-card, .project-card, .timeline-item").each(function () {
      const top = $(this).offset().top;
      const windowBottom = $(window).scrollTop() + $(window).height();
      if (windowBottom > top + 40) {
        $(this).addClass("revealed");
      }
    });
  }

  $("<style>")
    .text(`
      .skill-card, .project-card, .timeline-item {
        opacity: 0; transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .skill-card.revealed, .project-card.revealed, .timeline-item.revealed {
        opacity: 1; transform: translateY(0);
      }
    `)
    .appendTo("head");

  $(window).on("scroll", revealOnScroll);
  revealOnScroll(); // Run on load for visible items

});