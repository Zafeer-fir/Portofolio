(function () {
  var hello = document.getElementById('hello');
  var portrait = document.getElementById('portrait');

  // 1. Efek kedalaman di halaman utama: sapaan dan foto bergerak berlawanan mengikuti kursor
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hello && portrait && !reduce) {
    window.addEventListener('pointermove', function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      hello.style.transform = 'translate(' + (x * -26) + 'px,' + (y * -12) + 'px)';
      portrait.style.transform = 'translateX(-50%) translate(' + (x * 14) + 'px,' + (y * 6) + 'px)';
    });
  }

  // 2. Jika foto.png belum ada, tampilkan siluet placeholder
  var img = portrait && portrait.querySelector('img');
  if (img) {
    img.addEventListener('error', function () {
      portrait.innerHTML =
        '<svg viewBox="0 0 300 400" role="img" aria-label="Foto placeholder">' +
        '<defs><linearGradient id="sh" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#fbf8f1"/><stop offset="1" stop-color="#e9e2d4"/></linearGradient></defs>' +
        '<path d="M20 400 C25 320 60 285 110 272 L190 272 C240 285 275 320 280 400Z" fill="url(#sh)"/>' +
        '<rect x="128" y="225" width="44" height="55" rx="18" fill="#d9a98a"/>' +
        '<ellipse cx="150" cy="165" rx="52" ry="64" fill="#e6b999"/>' +
        '<path d="M96 160 C92 90 130 70 150 70 C175 70 208 92 204 160 C196 125 180 112 150 112 C120 112 104 125 96 160Z" fill="#c79566"/>' +
        '</svg>';
    });
  }

  // 3. Tahun di footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // 4. Proyek dan pengalaman dibaca dari content/*.json (diedit lewat /admin/)
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getItems(name) {
    return fetch('content/' + name + '.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { return Array.isArray(d.items) ? d.items : []; });
  }
  function cut(el, items) {
    var n = parseInt(el.getAttribute('data-limit'), 10);
    return n > 0 ? items.slice(0, n) : items;
  }

  var pEl = document.getElementById('projects');
  if (pEl) {
    getItems('projects').then(function (items) {
      items = cut(pEl, items);
      if (!items.length) { pEl.innerHTML = '<p class="empty">Belum ada proyek.</p>'; return; }
      pEl.innerHTML = '<div class="grid">' + items.map(function (p) {
        var link = /^https?:\/\//i.test(p.link || '') ? p.link : '';
        var pic = /^(\/|https?:\/\/)[^\s"'<>]+$/.test(p.image || '') ? p.image : '';
        var tag = link ? 'a' : 'article';
        var meta = [p.category, p.year].filter(Boolean).join(' · ');
        return '<' + tag + ' class="card' + (pic ? ' has-img' : '') + '"' +
          (link ? ' href="' + esc(link) + '" target="_blank" rel="noopener"' : '') + '>' +
          (pic ? '<img class="cover" src="' + esc(pic) + '" alt="" loading="lazy"><span class="shade"></span>' : '') +
          '<h3>' + esc(p.title) + '</h3>' + (meta ? '<p>' + esc(meta) + '</p>' : '') +
          '</' + tag + '>';
      }).join('') + '</div>';
    }).catch(function () { pEl.innerHTML = '<p class="empty">Konten belum bisa dimuat.</p>'; });
  }

  var eEl = document.getElementById('experience');
  if (eEl) {
    getItems('experience').then(function (items) {
      items = cut(eEl, items);
      var rows = items.map(function (x) {
        var tags = (x.skills || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
        return '<article class="skill-row"><span class="years">' + esc(x.years) + '</span><h3>' +
          esc(x.title) + '</h3><ul class="tags">' + tags + '</ul></article>';
      }).join('');
      eEl.innerHTML = '<div class="skill-list">' + (rows || '<p class="empty">Belum ada pengalaman.</p>') + '</div>';
    }).catch(function () { eEl.innerHTML = '<p class="empty">Konten belum bisa dimuat.</p>'; });
  }

  // 5. Formulir kontak (Netlify Forms), dikirim tanpa pindah halaman
  var pesan = {
    ok: 'Terima kasih, pesanmu sudah terkirim.',
    gagal: 'Pesan belum terkirim. Coba lagi beberapa saat lagi.'
  };
  var status = document.getElementById('status');
  var kode = new URLSearchParams(window.location.search).get('kirim');
  if (status && kode && pesan[kode]) status.textContent = pesan[kode];

  var form = document.querySelector('form[data-netlify]');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      if (btn) btn.disabled = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        status.textContent = pesan.ok;
        form.reset();
      }).catch(function () {
        status.textContent = pesan.gagal;
      }).then(function () {
        if (btn) btn.disabled = false;
        status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
})();
