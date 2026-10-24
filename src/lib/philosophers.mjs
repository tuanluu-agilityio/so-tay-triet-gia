import fs from 'node:fs';
import path from 'node:path';
import { musicCredit } from './music.mjs';

// Astro chạy file này từ thư mục build nên đường dẫn tính từ thư mục dự án (nơi chạy lệnh build)
const DATA_DIR = path.resolve(process.cwd(), 'src/data');

// Đọc các file dữ liệu (mỗi file là một thời kỳ, dùng PH.push) và trả về danh sách 50 triết gia theo thứ tự thời gian
export function loadPhilosophers() {
  const PH = [];
  for (const f of fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.js')).sort()) {
    new Function('PH', fs.readFileSync(path.join(DATA_DIR, f), 'utf8'))(PH);
  }
  return PH;
}

export const ERAS = ['Tiền Socrates', 'Hy Lạp cổ điển', 'Hy Lạp hóa – La Mã', 'Trung cổ', 'Phục hưng – Cận đại', 'Khai sáng', 'Thế kỷ 19', 'Thế kỷ 20'];
export const WHERE = ['Gốc rễ của cây', 'Trên thân cây', 'Nhánh thấp bên trái', 'Nhánh thấp bên phải', 'Nhánh giữa bên trái', 'Nhánh giữa bên phải', 'Nhánh cao bên trái', 'Ngọn cây'];
// Vị trí trên sơ đồ cây nhỏ: điểm cuối nhánh của từng thời kỳ
const SPOT = [[40, 136], [60, 104], [20, 80], [100, 80], [16, 50], [104, 50], [38, 20], [84, 14]];
const LEAF = '<svg class="leafmark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c5 3 7 8 4 14-1 2-3 4-4 6-1-2-3-4-4-6C5 10 7 5 12 2Z"/></svg>';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Văn bản dữ liệu cho phép *nghiêng*
const md = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const fmt = (y) => (y < 0 ? `${-y} TCN` : `${y}`);

export function span(p) {
  const { born: b, died: d } = p;
  const t = b < 0 && d > 0 ? `${fmt(b)} – ${d}` : b < 0 ? `${-b} – ${-d} TCN` : `${b} – ${d}`;
  return (p.approx ? 'Khoảng ' : '') + t;
}

// Chữ cái trên chân dung thay ảnh: lấy họ (từ cuối), trừ tên có "xứ"
export const initial = (n) => {
  if (!/ xứ /.test(n)) n = n.split(' ').pop();
  return n.normalize('NFD').replace(/[̀-ͯ]/g, '')[0];
};

export function miniSvg(era) {
  const [mx, my] = SPOT[era];
  let s = '<ellipse class="canopy" cx="60" cy="48" rx="56" ry="44"/>';
  SPOT.slice(2).forEach(([x, y], i) => {
    const me = i + 2 === era;
    s += `<path class="br${me ? ' br-me' : ''}" stroke-width="${me ? 3.4 : 2.6}" d="M60 ${88 - i * 4} Q ${(60 + x) / 2} ${(88 - i * 4 + y) / 2 + 6} ${x} ${y}"/>`;
  });
  s += '<path class="bark" d="M52 118 C56 108 57 96 58 72 L62 72 C63 96 64 108 68 118 Z"/>';
  s += '<path class="rt" stroke-width="2" d="M60 118 C55 128 40 130 28 140 M60 118 C60 128 60 134 60 142 M60 118 C65 128 80 130 92 140"/>';
  s += `<circle class="pulse" cx="${mx}" cy="${my}" r="3.4"/><circle class="me" cx="${mx}" cy="${my}" r="4.4"/>`;
  return s;
}

function sourcesHtml(p) {
  const q = encodeURIComponent(p.en || p.name);
  const sep = p.sep ? `https://plato.stanford.edu/entries/${p.sep}/` : `https://plato.stanford.edu/search/searcher.py?query=${q}`;
  const list = [
    `“${esc(p.en || p.name)}”, <a href="${sep}" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy</a>${p.sep ? '' : ' (trang tìm kiếm)'}.`,
    `“${esc(p.en || p.name)}”, <a href="https://www.britannica.com/search?query=${q}" target="_blank" rel="noopener">Encyclopaedia Britannica</a>.`,
    `“${esc(p.wiki)}”, <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(p.wiki.replace(/ /g, '_'))}" target="_blank" rel="noopener">Wikipedia</a>.`,
    ...(p.works || []).map(md),
  ];
  return `<ol>${list.map((x) => `<li>${x}</li>`).join('')}</ol>`;
}

// Phần thân trang chi tiết: các mục nội dung, liên quan, nguồn và nút trước/sau
export function renderDetail(p, PH, prev, next, track) {
  const BY = Object.fromEntries(PH.map((q) => [q.id, q]));
  const kin = (p.kin || [])
    .map(([rel, who, note]) => {
      const k = BY[who];
      const name = k ? k.name : who;
      const inner = `<span class="m">${k ? `<img alt="" data-wiki="${esc(k.wiki)}">` : ''}<span aria-hidden="true">${esc(initial(name))}</span></span><span class="rel">${esc(rel)}</span><b>${esc(name)}</b><small>${md(note)}</small>`;
      return k ? `<a href="/triet-gia/${k.id}/">${inner}</a>` : `<a class="nolink" aria-disabled="true">${inner}</a>`;
    })
    .join('');

  const article = `
    <section id="cuoc-doi" class="reveal"><h2>Cuộc đời ngắn gọn</h2>
      ${p.life.map((t) => `<p>${md(t)}</p>`).join('')}
      <div class="facts">${p.facts.map(([k, v]) => `<div class="fact"><b>${esc(k)}</b><span>${md(v)}</span></div>`).join('')}</div></section>
    <section id="tu-tuong" class="reveal"><h2>Tư tưởng chính</h2>
      ${p.ideas.map(([h, t, eg]) => `<div class="idea">${LEAF}<div><h3>${md(h)}</h3><p>${md(t)}</p>${eg ? `<p class="eg"><b>Đời thường:</b> ${md(eg)}</p>` : ''}</div></div>`).join('')}</section>
    <section id="cau-noi" class="reveal"><h2>Câu nói nổi tiếng</h2>
      ${p.quotes.map(([q, src]) => `<blockquote><p>${md(q)}</p><footer>${md(src)}</footer></blockquote>`).join('')}</section>
    <section id="anh-huong" class="reveal"><h2>Ảnh hưởng ngày nay</h2>${p.influence.map((t) => `<p>${md(t)}</p>`).join('')}</section>
    <section id="lien-quan" class="reveal"><h2>Liên quan</h2><div class="kin">${kin}</div></section>
    <section id="nguon" class="sources reveal"><h2>Nguồn tham khảo</h2>${sourcesHtml(p)}
      <p class="note">Ảnh chân dung: Wikimedia Commons, giấy phép tự do. Nội dung được viết lại bằng lời văn dễ hiểu, không chép nguyên văn.</p>
      <p class="note">${musicCredit(track)}</p></section>`;

  const pager = `
      ${prev ? `<a class="prev" href="/triet-gia/${prev.id}/"><small>← Người trước</small><b>${esc(prev.name)}</b></a>` : ''}
      ${next ? `<a class="next" href="/triet-gia/${next.id}/"><small>Người sau →</small><b>${esc(next.name)}</b></a>` : ''}`;

  return { article, pager };
}
