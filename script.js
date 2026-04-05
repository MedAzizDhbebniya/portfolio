const loader = document.getElementById("site-loader");
const canvas = document.getElementById("bg-canvas");
const cursorAura = document.querySelector(".cursor-aura");
const rotator = document.getElementById("headline-rotator");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const tiltItems = document.querySelectorAll("[data-tilt]");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 80, 280)}ms`;
  revealObserver.observe(item);
});

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("is-hidden"), 900);
});

if (rotator) {
  const roles = ["Creative Developer", "Full-Stack Builder", "Creative Technologist"];
  let index = 0;
  rotator.textContent = roles[index];
  setInterval(() => {
    rotator.animate([{ opacity: 1, transform: "translateY(0px)" }, { opacity: 0, transform: "translateY(10px)" }], { duration: 260, easing: "ease", fill: "forwards" }).onfinish = () => {
      index = (index + 1) % roles.length;
      rotator.textContent = roles[index];
      rotator.animate([{ opacity: 0, transform: "translateY(-10px)" }, { opacity: 1, transform: "translateY(0px)" }], { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" });
    };
  }, 2600);
}

window.addEventListener("pointermove", (event) => {
  if (cursorAura) {
    cursorAura.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  }
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = (event.clientX - centerX) / centerX;
  const offsetY = (event.clientY - centerY) / centerY;
  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.parallax || 10);
    item.style.transform = `translate3d(${offsetX * depth}px, ${offsetY * depth}px, 0)`;
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const bounds = item.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width) - 0.5) * 8;
    const rotateX = (0.5 - (y / bounds.height)) * 8;
    item.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  item.addEventListener("pointerleave", () => {
    item.style.transform = "perspective(1600px) rotateX(0deg) rotateY(0deg)";
  });
});

if (canvas) {
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = 110;
  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.5;
  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };
  const initParticles = () => {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.55, vy: (Math.random() - 0.5) * 0.55, r: Math.random() * 2 + 0.6 });
    }
  };
  window.addEventListener("pointermove", (event) => { pointerX = event.clientX; pointerY = event.clientY; });
  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const glow = ctx.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 240);
    glow.addColorStop(0, "rgba(255,125,31,0.14)");
    glow.addColorStop(1, "rgba(255,125,31,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;
      if (p.y < -20) p.y = window.innerHeight + 20;
      if (p.y > window.innerHeight + 20) p.y = -20;
      ctx.beginPath(); ctx.fillStyle = "rgba(255, 161, 90, 0.82)"; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j]; const dx = p.x - q.x; const dy = p.y - q.y; const distance = Math.hypot(dx, dy);
        if (distance < 150) { ctx.beginPath(); ctx.strokeStyle = `rgba(255, 132, 44, ${0.16 - distance / 1100})`; ctx.lineWidth = 1; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    requestAnimationFrame(draw);
  };
  resize(); initParticles(); window.addEventListener("resize", () => { resize(); initParticles(); }); draw();
}
