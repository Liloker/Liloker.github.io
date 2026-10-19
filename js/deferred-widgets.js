/**
 * 首屏之后再加载的挂件（2026-09-28）
 * 以前：看板娘 + APlayer + Meting 在 <head>/<body> 里同步加载，Meting 还 preload=auto，
 *       一进页面就去拉 250 首歌的列表，拖慢首屏。
 * 现在：等 window.load 之后、浏览器空闲时再加载；播放器默认不预加载音频。
 * pjax 切页时本脚本不会重复执行（没有 data-pjax），播放器挂在 <body> 下，切页不中断。
 */
(function () {
  if (window.__deferredWidgetsLoaded) return;
  window.__deferredWidgetsLoaded = true;

  var MUSIC = {
    // 2026-09-29 实测：QQ 歌单 7988378536 共 164 首，71 首需 VIP（pay_play），接口对约 80 首返回空地址 → 频繁跳歌
    //             网易云歌单 7503299453 共 33 首，27 首免费（fee 0/8），接口 31/33 可解析 → 改用网易云
    // 2026-09-29 按用户选择继续用 QQ（想换网易云：server 'netease' + id '7503299453'）
    server: 'tencent',        // tencent = QQ 音乐；netease = 网易云
    type: 'playlist',
    id: '7988378536',         // QQ myblog 歌单
    api: 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r'
  };
  var CDN = {
    aplayerCss: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css',
    aplayerJs: 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js',
    metingJs: 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js'
  };

  function load(url, type) {
    return new Promise(function (resolve, reject) {
      var el;
      if (type === 'css') { el = document.createElement('link'); el.rel = 'stylesheet'; el.href = url; }
      else { el = document.createElement('script'); el.src = url; el.async = true; }
      el.onload = resolve; el.onerror = reject;
      document.head.appendChild(el);
    });
  }
  function idle(fn, timeout) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: timeout || 3000 });
    else setTimeout(fn, 1200);
  }

  function initMusic() {
    window.meting_api = MUSIC.api;
    var m = document.createElement('meting-js');
    m.className = 'no-destroy';
    m.setAttribute('server', MUSIC.server);
    m.setAttribute('type', MUSIC.type);
    m.setAttribute('id', MUSIC.id);
    m.setAttribute('fixed', 'true');
    m.setAttribute('mini', 'true');
    m.setAttribute('autoplay', 'false');     // 浏览器本来就会拦截自动播放
    m.setAttribute('order', 'random');
    m.setAttribute('preload', 'none');       // 不预加载音频
    m.setAttribute('mutex', 'true');
    m.setAttribute('theme', '#408fda');
    m.setAttribute('list-folded', 'true');
    m.setAttribute('list-max-height', '340px');
    document.body.appendChild(m);

    load(CDN.aplayerCss, 'css');
    load(CDN.aplayerJs, 'js')
      .then(function () { return load(CDN.metingJs, 'js'); })
      .then(function () {
        // 遇到放不了的歌（VIP/版权/接口失败），APlayer 默认 2 秒后跳下一首；
        // 连续失败太多就停下，避免一直空转刷接口
        var tries = 0;
        var timer = setInterval(function () {
          var ap = m.aplayer;
          if (!ap && ++tries < 40) return;
          clearInterval(timer);
          if (!ap) return;
          var fails = 0;
          ap.on('error', function () { if (++fails >= 5) { ap.pause(); } });
          ap.on('playing', function () { fails = 0; });
        }, 250);
      })
      .catch(function (e) { console.warn('[music] load failed', e); });
  }

  function initLive2d() {
    if (screen.width < 768) return;               // 手机端不加载看板娘
    load('/live2d-widget/autoload.js', 'js').catch(function () {});
  }


  function start() {
    idle(function () {
      initLive2d();
      initMusic();
    });
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
