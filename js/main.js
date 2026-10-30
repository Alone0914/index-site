const body = document.body;
const rail = document.getElementById('rail');
const railCur = document.getElementById('railCur');
const sections = [...document.querySelectorAll('.slide, .morph, .push')];

function pad(n){ return String(n).padStart(2,'0'); }

function updateRail(index){
  if (!rail) return;
  const items = [...rail.children];
  items.forEach((btn, i) => btn.classList.toggle('active', i === index));
  if (railCur) railCur.textContent = pad(index + 1);
}

if (rail) {
  sections.forEach((sec, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `跳到第 ${idx + 1} 段`);
    btn.addEventListener('click', () => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateRail(idx);
    });
    rail.appendChild(btn);
  });
}

const revealItems = document.querySelectorAll('.rv');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(el => observer.observe(el));

const enterBtn = document.getElementById('enterBtn');
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    const target = document.querySelector('.slide[data-title="三个误会"]');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const myths = document.querySelectorAll('.myth');
myths.forEach(btn => {
  btn.addEventListener('click', () => btn.classList.toggle('flipped'));
});

const counters = document.querySelectorAll('[data-count]');
counters.forEach(el => {
  const final = Number(el.dataset.count || 0);
  let start = 0;
  const step = Math.max(1, Math.ceil(final / 80));
  const timer = setInterval(() => {
    start += step;
    if (start >= final) {
      start = final;
      clearInterval(timer);
    }
    el.textContent = start;
  }, 18);
});

const timeline = [
  { year: '1938', title: '八路军 115 师入鲁', text: '队伍进山，第一件事不是打仗，是减租减息。佃农第一次能把自家种的那部分粮，留在自己缸里。' },
  { year: '1941', title: '渊子崖村自卫战', text: '一百多名村民白天守山，夜里守土，打了一整天一整夜，最后仍守住了村口。' },
  { year: '1942', title: '豆选与整风', text: '村里第一次把投票交给了农民，不讲“我命令你”，而是让人自己把豆子投进去。' },
  { year: '1946', title: '孟良崮战役', text: '没有一条平地。全靠山地、民兵和一个个小草垛。' },
  { year: '1948', title: '淮海战役大规模支前', text: '543 万民工、88 万辆小推车，沿着山路与大地把粮食和弹药输往前线。' },
  { year: '1950s', title: '农业合作化', text: '修水库、开梯田、搭电线，先让人活下来，再让人能把庄稼卖出去。' },
  { year: '2024', title: '全球化与物流', text: '今天的临沂靠的是物流网络、直播电商和广阔市场，仍旧把“把东西送到手里”当做核心。' }
];

const tlYear = document.getElementById('tlYear');
const tlTitle = document.getElementById('tlTitle');
const tlText = document.getElementById('tlText');
const tlProgress = document.getElementById('tlProgress');
const tlDots = document.getElementById('tlDots');
if (tlDots) {
  timeline.forEach((_, idx) => {
    const dot = document.createElement('span');
    if (idx === 0) dot.classList.add('active');
    tlDots.appendChild(dot);
  });
}
let tlIndex = 0;
if (tlYear && tlTitle && tlText && tlProgress) {
  const tick = () => {
    const item = timeline[tlIndex % timeline.length];
    tlYear.textContent = item.year;
    tlTitle.textContent = item.title;
    tlText.textContent = item.text;
    const progress = ((tlIndex + 1) / timeline.length) * 100;
    tlProgress.style.width = `${progress}%`;
    const dots = [...(tlDots?.children || [])];
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx <= tlIndex));
    tlIndex += 1;
  };
  tick();
  setInterval(tick, 2600);
}

const openDou = document.getElementById('openDou');
const dou = document.getElementById('dou');
const douClose = document.getElementById('douClose');
if (openDou && dou) {
  openDou.addEventListener('click', () => dou.classList.add('show'));
}
if (douClose && dou) {
  douClose.addEventListener('click', () => dou.classList.remove('show'));
}

dou?.addEventListener('click', (event) => {
  if (event.target === dou) dou.classList.remove('show');
});

const bowls = [...document.querySelectorAll('.bowl')];
const bean = document.getElementById('bean');
const douResult = document.getElementById('douResult');
if (bean) {
  bowls.forEach((bowl) => {
    bowl.addEventListener('click', () => {
      const box = bowl.getBoundingClientRect();
      const stage = bowl.parentElement.getBoundingClientRect();
      const startX = stage.left + stage.width / 2;
      const startY = stage.top + stage.height * 0.52;
      const endX = box.left + box.width / 2 - stage.left;
      const endY = box.top + box.height / 2 - stage.top;
      bean.style.left = `${startX - stage.left}px`;
      bean.style.top = `${startY - stage.top}px`;
      bean.classList.remove('fly');
      void bean.offsetWidth;
      bean.classList.add('fly');
      setTimeout(() => {
        bean.style.left = `${endX}px`;
        bean.style.top = `${endY}px`;
        bean.style.transform = 'translate(-50%, -50%) rotate(20deg) scale(1.4)';
      }, 50);
      setTimeout(() => {
        if (douResult) {
          douResult.innerHTML = '<p>你刚刚做的这件事，叫<b>豆选</b>。<br>它让一群一辈子低头的人，第一次抬起了头。</p><span>—— 这就是"党群同心"的起点，不是宣传，是公平</span>';
        }
      }, 700);
    });
  });
}

const taskList = [...document.querySelectorAll('.task')];
const cntNum = document.getElementById('cntNum');
const doitMsg = document.getElementById('doitMsg');
if (taskList.length) {
  const updateCount = () => {
    const checked = taskList.filter(task => task.classList.contains('checked')).length;
    if (cntNum) cntNum.textContent = checked;
    const msg = [
      '这五件事，任何一件做完，你就不是在"学"它，是在"用"它。',
      '你已经开始了。先做第一件，剩下四件会自然跟上。',
      '这样不错。把事做成，不靠口号靠行动。',
      '你在“把精神翻译成现实”。这比讲道理更靠谱。',
      '五件全做完，你就能把沂蒙故事，变成一段你自己的故事。'
    ][Math.min(checked, 4)];
    if (doitMsg) doitMsg.textContent = msg;
  };
  taskList.forEach(task => {
    task.addEventListener('click', () => {
      task.classList.toggle('checked');
      updateCount();
    });
  });
  const reset = document.getElementById('resetDoit');
  reset?.addEventListener('click', () => {
    taskList.forEach(task => task.classList.remove('checked'));
    updateCount();
  });
  updateCount();
}

const wayCards = document.querySelectorAll('.way');
wayCards.forEach(card => {
  card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-6px)');
  card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
});

const metrics = document.querySelectorAll('[data-w]');
metrics.forEach(el => {
  const val = Number(el.dataset.w || 0);
  requestAnimationFrame(() => el.style.width = `${val}%`);
});

const pushCart = document.getElementById('pushCart');
const pushRoad = document.getElementById('pushRoad');
const pushEnd = document.getElementById('pushEnd');
let dragging = false;
if (pushCart && pushRoad) {
  const updatePush = (x) => {
    const max = 760;
    const clamped = Math.min(Math.max(x, 0), max);
    pushCart.style.transform = `translateX(${clamped}px)`;
    pushRoad.style.width = `${clamped}px`;
    if (clamped > max * 0.72) pushEnd?.classList.add('visible');
  };
  pushCart.addEventListener('pointerdown', () => dragging = true);
  window.addEventListener('pointerup', () => dragging = false);
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const rect = pushCart.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left - 80;
    updatePush(Math.min(Math.max(x, 0), 760));
  });
}

const heroCart = document.getElementById('heroCart');
if (heroCart) {
  heroCart.addEventListener('mouseover', () => {
    heroCart.style.transform = 'translateX(-12px) rotate(-2deg)';
  });
  heroCart.addEventListener('mouseleave', () => {
    heroCart.style.transform = 'translateX(0) rotate(0deg)';
  });
}

if (window.location.hash) {
  const anchor = document.querySelector(window.location.hash);
  anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('scroll', () => {
  const index = sections.findIndex((sec) => {
    const rect = sec.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4;
  });
  if (index >= 0) updateRail(index);
}, { passive: true });

updateRail(0);





























































































































































































































































