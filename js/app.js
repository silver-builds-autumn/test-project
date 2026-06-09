const GuideApp = (() => {
  let activeNavigationPlace = null;
  let currentPosition = null;

  const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const el = id => document.getElementById(id);
  const safe = value => String(value || '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

  const toast = message => {
    const node = el('toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove('show'), 2600);
  };

  const categoryLabel = category => (GuideMap.categoryMeta[category] || { label: '地点' }).label;

  const renderDayTimeline = () => {
    const node = el('dayTimeline');
    if (!node) return;
    node.innerHTML = GUIDE_DATA.days.map(day => `
      <article class="day-card" style="--day-color:${day.color}">
        <div class="day-card-head">
          <span>${day.date}</span>
          <h3>${day.title}</h3>
          <p>${day.summary}</p>
        </div>
        <div class="schedule-list">
          ${day.schedule.map(item => `
            <div class="schedule-item">
              <time>${item.time}</time>
              <div><strong>${item.title}</strong><p>${item.detail}</p></div>
            </div>
          `).join('')}
        </div>
      </article>
    `).join('');
  };

  const renderPlaceList = places => {
    const node = el('placeList');
    const count = el('placeCount');
    if (!node) return;
    count.textContent = `${places.length} 个地点`;
    node.innerHTML = places.map(place => `
      <article class="place-card" data-place-id="${place.id}">
        <div class="place-image" style="background-image:url('${place.image || ''}')"></div>
        <div class="place-content">
          <div class="place-meta">
            <span>${categoryLabel(place.category)}</span>
            <span>Day ${place.day}</span>
          </div>
          <h3>${place.name}</h3>
          <p>${place.short}</p>
          <div class="place-facts">
            <span>${place.time || '按当天安排'}</span>
            <span>${place.cost || '按实际消费'}</span>
            ${place.dwell ? `<span>${place.dwell}</span>` : ''}
          </div>
          <div class="place-extra">
            ${place.search ? `<p><strong>搜索</strong>${place.search}</p>` : ''}
            ${place.risk ? `<p><strong>提示</strong>${place.risk}</p>` : ''}
          </div>
          <div class="place-actions">
            <button type="button" data-focus-place="${place.id}">查看</button>
            <button type="button" data-nav-place="${place.id}">导航</button>
          </div>
        </div>
      </article>
    `).join('');

    node.querySelectorAll('[data-focus-place]').forEach(button => {
      button.addEventListener('click', () => {
        const place = GUIDE_DATA.places.find(item => item.id === button.dataset.focusPlace);
        if (place) GuideMap.showPopup(place);
      });
    });

    node.querySelectorAll('[data-nav-place]').forEach(button => {
      button.addEventListener('click', () => {
        const place = GUIDE_DATA.places.find(item => item.id === button.dataset.navPlace);
        if (place) openNavigation(place);
      });
    });
  };

  const renderFood = () => {
    const node = el('foodList');
    if (!node) return;
    node.innerHTML = GUIDE_DATA.food.map(item => `
      <article class="info-card">
        <span>${item.scene}</span>
        <h3>${item.name}</h3>
        <p>${item.recommendation}</p>
        <dl><div><dt>人均</dt><dd>${item.cost}</dd></div><div><dt>交通</dt><dd>${item.transport}</dd></div></dl>
      </article>
    `).join('');
  };

  const renderStays = () => {
    const node = el('stayList');
    if (!node) return;
    node.innerHTML = GUIDE_DATA.stays.map(item => `
      <article class="info-card stay-card">
        <span>住宿搜索词</span>
        <h3>${item.name}</h3>
        <p>${item.reason}</p>
        <dl><div><dt>预算</dt><dd>${item.price}</dd></div><div><dt>搜索</dt><dd>${item.search}</dd></div></dl>
      </article>
    `).join('');
  };

  const renderTransit = () => {
    const node = el('transitGrid');
    if (!node || !GUIDE_DATA.transit) return;
    node.innerHTML = GUIDE_DATA.transit.map(item => `
      <article class="transit-card">
        <span>${item.title}</span>
        <strong>${item.primary}</strong>
        <p>${item.detail}</p>
      </article>
    `).join('');
  };

  const renderBudget = () => {
    const node = el('budgetGrid');
    const backupNode = el('backupStrategy');
    if (node) {
      node.innerHTML = GUIDE_DATA.budget.map(item => `
        <article class="budget-card">
          <span>${item.item}</span>
          <strong>${item.estimate}</strong>
          <p>${item.note}</p>
        </article>
      `).join('');
    }
    if (backupNode) {
      backupNode.innerHTML = `<h3>${GUIDE_DATA.backup.title}</h3><ul>${GUIDE_DATA.backup.items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
  };

  const renderChecklist = () => {
    const node = el('checklistGrid');
    if (!node) return;
    node.innerHTML = GUIDE_DATA.checklist.map((item, index) => `
      <article class="check-card">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <h3>${item.title}</h3>
        <p>${item.detail}</p>
      </article>
    `).join('');
  };

  const navLinks = place => {
    const name = encodeURIComponent(place.name);
    const destination = `${place.lat},${place.lng}`;
    const current = currentPosition ? `${currentPosition.lat},${currentPosition.lng}` : '';
    const iosAmap = `iosamap://path?sourceApplication=dragonBoatGuide&sid=当前位置&slat=${currentPosition?.lat || ''}&slon=${currentPosition?.lng || ''}&sname=当前位置&did=${place.id}&dlat=${place.lat}&dlon=${place.lng}&dname=${name}&dev=0&t=0`;
    const androidAmap = `androidamap://route?sourceApplication=dragonBoatGuide&slat=${currentPosition?.lat || ''}&slon=${currentPosition?.lng || ''}&sname=当前位置&dlat=${place.lat}&dlon=${place.lng}&dname=${name}&dev=0&t=0`;
    return [
      {
        name: '高德地图',
        scheme: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? iosAmap : androidAmap,
        web: `https://uri.amap.com/navigation?to=${place.lng},${place.lat},${name}&mode=car&policy=1&src=dragonBoatGuide&coordinate=gaode&callnative=1`
      },
      {
        name: '百度地图',
        scheme: `baidumap://map/direction?origin=${current || '我的位置'}&destination=${destination}&mode=driving&coord_type=wgs84&src=webapp.dragonBoatGuide`,
        web: `https://api.map.baidu.com/direction?origin=${current || '我的位置'}&destination=${destination}&mode=driving&region=中国&output=html&src=dragonBoatGuide`
      },
      {
        name: '腾讯地图',
        scheme: `qqmap://map/routeplan?type=drive&from=当前位置&fromcoord=${current}&to=${name}&tocoord=${destination}&policy=0`,
        web: `https://apis.map.qq.com/uri/v1/routeplan?type=drive&to=${name}&tocoord=${destination}&referer=dragonBoatGuide`
      }
    ];
  };

  const renderNavOptions = place => {
    const node = el('navOptions');
    if (!node) return;
    node.innerHTML = navLinks(place).map(option => `
      <button type="button" class="nav-option" data-scheme="${safe(option.scheme)}" data-web="${safe(option.web)}">
        <strong>${option.name}</strong>
        <span>优先唤起 App，失败后可用 Web 兜底</span>
      </button>
    `).join('');
    node.querySelectorAll('.nav-option').forEach(button => {
      button.addEventListener('click', () => launchNavigation(button.dataset.scheme, button.dataset.web));
    });
  };

  const launchNavigation = (scheme, webUrl) => {
    if (!isMobile()) {
      window.open(webUrl, '_blank', 'noopener');
      toast('电脑端已打开 Web 导航页面。');
      return;
    }

    const start = Date.now();
    window.location.href = scheme;
    window.setTimeout(() => {
      if (Date.now() - start < 1800) {
        toast('若未跳转，可能未安装该 App，可点击 Web 兜底链接。');
        window.open(webUrl, '_blank', 'noopener');
      }
    }, 1300);
  };

  const openNavigation = place => {
    activeNavigationPlace = place;
    el('sheetTarget').textContent = `${place.name}｜${place.short}`;
    el('navigationSheet').classList.add('active');
    el('navigationSheet').setAttribute('aria-hidden', 'false');

    if (!isMobile()) {
      el('locationStatus').textContent = '当前为电脑端访问，将提供 Web 导航兜底链接。';
      currentPosition = null;
      renderNavOptions(place);
      return;
    }

    if (!navigator.geolocation) {
      el('locationStatus').textContent = '当前浏览器不支持定位，将使用“我的位置”作为起点。';
      currentPosition = null;
      renderNavOptions(place);
      return;
    }

    el('locationStatus').textContent = '正在获取当前位置，用于自动填入导航起点……';
    navigator.geolocation.getCurrentPosition(position => {
      currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
      el('locationStatus').textContent = '已获取当前位置，可选择导航 App。';
      renderNavOptions(place);
    }, () => {
      currentPosition = null;
      el('locationStatus').textContent = '定位失败或被拒绝，将使用“我的位置”作为起点。';
      renderNavOptions(place);
    }, { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 });
  };

  const closeNavigation = () => {
    activeNavigationPlace = null;
    el('navigationSheet').classList.remove('active');
    el('navigationSheet').setAttribute('aria-hidden', 'true');
  };

  const bindSheet = () => {
    document.querySelectorAll('[data-close-sheet]').forEach(node => node.addEventListener('click', closeNavigation));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeNavigation();
    });
  };

  const bindHeader = () => {
    const links = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
    const sections = [...links].map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(section => observer.observe(section));
  };

  const init = () => {
    renderDayTimeline();
    renderFood();
    renderStays();
    renderTransit();
    renderBudget();
    renderChecklist();
    bindSheet();
    bindHeader();
    GuideMap.init();
    renderPlaceList(GuideMap.filteredPlaces());
  };

  return {
    init,
    renderPlaceList,
    openNavigation
  };
})();

window.GuideApp = GuideApp;
document.addEventListener('DOMContentLoaded', GuideApp.init);