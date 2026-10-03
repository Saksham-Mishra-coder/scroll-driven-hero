gsap.registerPlugin(ScrollTrigger);

const car = document.getElementById("car");
const trail = document.getElementById("trail");
const road = document.getElementById("road");
const valueAdd = document.getElementById("valueText");
const letters = gsap.utils.toArray(".value-letter");
const heroTrack = document.getElementById("heroTrack");
const scrollIndicator = document.getElementById("scrollIndicator");

let carScrollTween = null;
let cardTriggers = [];

function initScrollAnimation() {
  if (carScrollTween) {
    if (carScrollTween.scrollTrigger) carScrollTween.scrollTrigger.kill();
    carScrollTween.kill();
  }
  cardTriggers.forEach((st) => st.kill());
  cardTriggers = [];

  gsap.set(car, { x: 0 });
  gsap.set(trail, { width: 0 });
  letters.forEach((l) => (l.style.opacity = 0));

  const roadRect = road.getBoundingClientRect();
  const roadWidth = window.innerWidth;
  const carWidth = car.offsetWidth || 150;
  
  const endX = roadWidth - Math.min(150, carWidth * 0.4);

  const roadLeft = roadRect.left;
  const letterPositions = letters.map((letter) => {
    const lRect = letter.getBoundingClientRect();
    return lRect.left - roadLeft;
  });

  carScrollTween = gsap.to(car, {
    x: endX,
    ease: "none",
    scrollTrigger: {
      trigger: ".section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: ".track",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        const currentX = gsap.getProperty(car, "x") || 0;
        const vehicleCenterX = currentX + (car.offsetWidth / 2);
        const trailWidth = currentX <= 0 ? 0 : vehicleCenterX;
        trail.style.width = `${trailWidth}px`;

        for (let i = 0; i < letters.length; i++) {
          if (vehicleCenterX >= letterPositions[i]) {
            letters[i].style.opacity = "1";
          } else {
            letters[i].style.opacity = "0";
          }
        }
      },
    },
  });

  const cardConfigs = [
    { id: "#box1", start: "top+=400 top", end: "top+=600 top" },
    { id: "#box2", start: "top+=600 top", end: "top+=800 top" },
    { id: "#box3", start: "top+=800 top", end: "top+=1000 top" },
    { id: "#box4", start: "top+=1000 top", end: "top+=1200 top" },
  ];

  cardConfigs.forEach((cfg) => {
    const tween = gsap.to(cfg.id, {
      opacity: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".section",
        start: cfg.start,
        end: cfg.end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    if (tween.scrollTrigger) cardTriggers.push(tween.scrollTrigger);
  });

  if (scrollIndicator) {
    const indicatorTrigger = ScrollTrigger.create({
      trigger: ".section",
      start: "top top",
      end: "top+=150 top",
      scrub: true,
      onUpdate: (self) => {
        scrollIndicator.style.opacity = Math.max(0, 1 - self.progress * 2.5);
      },
    });
    cardTriggers.push(indicatorTrigger);
  }
}

function playInitialEntrance() {
  gsap.fromTo(
    heroTrack,
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: "power2.out" }
  );

  gsap.fromTo(
    car,
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.2 }
  );
}

window.addEventListener("load", () => {
  initScrollAnimation();
  playInitialEntrance();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initScrollAnimation();
    ScrollTrigger.refresh();
  }, 150);
});
