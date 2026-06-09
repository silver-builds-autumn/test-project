/**
 * 页面交互与渲染模块
 * 负责DOM渲染、滚动监听、图片懒加载、灯箱等功能
 */

let placeholderDataUri = '';
let mapsInitialized = false;

/* ============================================
   初始化
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    placeholderDataUri = createPlaceholder();
    renderAll();
    initScrollSpy();
    initLazyLoad();
    initLightbox();
    initTimelineClick();

    // 等待天地图 API 加载完成后初始化地图
    waitForTianditu(() => {
        if (!mapsInitialized) {
            MapApp.initAll();
            mapsInitialized = true;
        }
    });
});

/* ============================================
   占位图生成
   ============================================ */
function createPlaceholder() {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
        '<rect width="400" height="300" fill="#f0f0f0"/>' +
        '<text x="50%" y="50%" text-anchor="middle" fill="#bbb" font-size="14">图片加载中</text>' +
        '</svg>';
    try {
        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    } catch (e) {
        return '';
    }
}

/* ============================================
   渲染全部内容
   ============================================ */
function renderAll() {
    itinerary.days.forEach(day => {
        renderSpots(day);
        renderFood(day);
        renderHotel(day);
    });
    renderTips();
}

/* ============================================
   渲染景点卡片
   ============================================ */
function renderSpots(day) {
    const container = document.getElementById('day' + day.day + '-spots');
    if (!container) return;

    container.innerHTML = day.spots.map(spot => {
        const hasMultiple = spot.images.length > 1;
        const imagesHtml = spot.images.map((img, i) =>
            '<img src="' + img + '" alt="' + spot.name + '" ' +
            'class="' + (i === 0 ? 'active' : '') + '" ' +
            'loading="lazy" ' +
            'onerror="this.src=\'' + placeholderDataUri + '\'" ' +
            'onclick="openLightbox(\'' + img + '\')">'
        ).join('');

        const dotsHtml = hasMultiple ?
            '<div class="spot-image-dots">' +
            spot.images.map((_, i) =>
                '<span class="image-dot ' + (i === 0 ? 'active' : '') + '" ' +
                'onclick="event.stopPropagation();switchImage(this,' + i + ')"></span>'
            ).join('') +
            '</div>' : '';

        const typeLabel = spot.type === 'activity' ? '活动' : '景点';
        const tipsHtml = spot.tips ? '<div class="spot-tips">💡 ' + spot.tips + '</div>' : '';

        return '<div class="spot-card">' +
            '<div class="spot-images">' + imagesHtml + dotsHtml + '</div>' +
            '<div class="spot-info">' +
            '<div class="spot-meta">' +
            '<span class="spot-type ' + spot.type + '">' + typeLabel + '</span>' +
            '<span class="spot-time">⏱ ' + spot.time + '</span>' +
            '</div>' +
            '<div class="spot-name">' + spot.name + '</div>' +
            '<div class="spot-desc">' + spot.desc + '</div>' +
            tipsHtml +
            '</div></div>';
    }).join('');
}

/* ============================================
   渲染美食
   ============================================ */
function renderFood(day) {
    const container = document.getElementById('day' + day.day + '-food');
    if (!container) return;

    container.innerHTML = day.restaurants.map(r => {
        const img = r.images && r.images[0] ? r.images[0] : placeholderDataUri;
        return '<div class="food-card">' +
            '<img src="' + img + '" alt="' + r.name + '" loading="lazy" onerror="this.src=\'' + placeholderDataUri + '\'">' +
            '<div class="food-info">' +
            '<div class="food-name">' + r.name + '</div>' +
            '<div class="food-time">' + r.time + '</div>' +
            '<div class="food-desc">' + r.desc + '</div>' +
            '</div></div>';
    }).join('');
}

/* ============================================
   渲染住宿
   ============================================ */
function renderHotel(day) {
    const container = document.getElementById('day' + day.day + '-hotel');
    if (!container || !day.hotel) return;

    const h = day.hotel;
    const img = h.images && h.images[0] ? h.images[0] : placeholderDataUri;

    container.innerHTML = '<div class="hotel-card-inner">' +
        '<img src="' + img + '" alt="' + h.name + '" loading="lazy" onerror="this.src=\'' + placeholderDataUri + '\'">' +
        '<div class="hotel-info">' +
        '<div class="hotel-name">' + h.name + '</div>' +
        '<div class="hotel-price">' + h.price + '</div>' +
        '<div class="hotel-desc">' + h.desc + '</div>' +
        '</div></div>';
}

/* ============================================
   渲染贴士
   ============================================ */
function renderTips() {
    const container = document.getElementById('tips-grid');
    if (!container) return;

    const icons = ['🌞', '🚇', '🚄', '🎢', '🏨'];
    container.innerHTML = itinerary.tips.map((tip, i) =>
        '<div class="tip-card">' +
        '<span class="tip-icon">' + icons[i % icons.length] + '</span>' +
        '<div class="tip-text">' + tip + '</div>' +
        '</div>'
    ).join('');
}

/* ============================================
   图片轮播
   ============================================ */
function switchImage(dot, index) {
    const container = dot.closest('.spot-images');
    if (!container) return;
    const images = container.querySelectorAll('img');
    const dots = container.querySelectorAll('.image-dot');

    images.forEach((img, i) => img.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

/* ============================================
   灯箱
   ============================================ */
function openLightbox(src) {
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!box || !img) return;
    img.src = src;
    box.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const box = document.getElementById('lightbox');
    if (!box) return;
    box.classList.remove('active');
    document.body.style.overflow = '';
}

/* ============================================
   懒加载
   ============================================ */
function initLazyLoad() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

/* ============================================
   滚动监听 + 导航高亮
   ============================================ */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });

                mobileLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isDaySection = id === 'day1' || id === 'day2' || id === 'day3';
                    link.classList.toggle('active',
                        href === '#' + id || (href === '#day1' && isDaySection)
                    );
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
}

/* ============================================
   时间轴点击跳转
   ============================================ */
function initTimelineClick() {
    document.querySelectorAll('.timeline-card').forEach(card => {
        card.addEventListener('click', () => {
            const day = card.closest('.timeline-item').dataset.day;
            const target = document.getElementById('day' + day);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   等待天地图 API
   ============================================ */
function waitForTianditu(callback, maxRetries) {
    maxRetries = maxRetries || 60;
    let retries = 0;
    function check() {
        if (typeof T !== 'undefined' && T.Map) {
            callback();
        } else if (retries < maxRetries) {
            retries++;
            setTimeout(check, 200);
        } else {
            console.warn('天地图 API 加载超时，请检查网络连接');
        }
    }
    check();
}

/* ============================================
   键盘事件
   ============================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});