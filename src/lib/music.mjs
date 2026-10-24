import { esc } from './philosophers.mjs';

// Bảng nhạc nền: mỗi trường phái âm nhạc một bản thu giấy phép tự do.
// performer, license, source được điền ở bước tìm bản thu (Task 2).
const t = (title, composer, year, why, key) => ({ title, composer, year, why, file: `/audio/${key}.mp3`, performer: '', license: '', source: '' });

export const TRACKS = {
  'hy-lap-co': t('Epitaph of Seikilos', 'Seikilos', 'khoảng thế kỷ 1', 'Bản nhạc Hy Lạp cổ hoàn chỉnh xưa nhất còn lại', 'hy-lap-co'),
  'la-ma': t('Hymn to the Sun', 'Mesomedes', 'thế kỷ 2', 'Nhạc cung đình La Mã đúng thời các nhà Khắc kỷ muộn', 'la-ma'),
  'binh-ca': t('Pange lingua gloriosi', 'Bình ca Gregorian', 'thế kỷ 13', 'Thánh ca do chính Aquinas soạn lời', 'binh-ca'),
  'phuc-hung': t('Fantasia cho lute', 'Francesco da Milano', 'thế kỷ 16', 'Nhạc sĩ Ý cùng thời Machiavelli', 'phuc-hung'),
  'ba-roc': t('Goldberg Variations, Aria', 'J. S. Bach', '1741', 'Baroque lục địa; Leibniz cùng thời Bach', 'ba-roc'),
  'ba-roc-anh': t('Keyboard Suite HWV 437, Sarabande', 'Handel', '1733', 'Handel sống ở London cùng thời Locke, Berkeley', 'ba-roc-anh'),
  'co-dien': t('Piano Sonata K. 545, chương II Andante', 'Mozart', '1788', 'Âm nhạc của thời Khai sáng', 'co-dien'),
  'lang-man-duc': t('Sonata “Ánh trăng”, chương I', 'Beethoven', '1801', 'Beethoven sinh cùng năm với Hegel (1770)', 'lang-man-duc'),
  'lang-man': t('Nocturne Op. 9 số 2', 'Chopin', '1832', 'Nietzsche rất mê Chopin', 'lang-man'),
  'the-ky-20': t('Intermezzo Op. 118 số 2', 'Brahms', '1893', 'Brahms là khách quen của gia đình Wittgenstein ở Vienna', 'the-ky-20'),
  'paris': t('Gymnopédie số 1', 'Satie', '1888', 'Paris của phái hiện sinh', 'paris'),
};

export const HOME_TRACK = 'ba-roc';

// id triết gia → key trong TRACKS
const GROUPS = {
  'hy-lap-co': 'thales anaximander pythagoras heraclitus parmenides zeno-elea democritus socrates plato diogenes aristotle',
  'la-ma': 'epicurus zeno-citium seneca epictetus marcus-aurelius plotinus',
  'binh-ca': 'augustine anselm aquinas ockham',
  'phuc-hung': 'machiavelli montaigne bacon',
  'ba-roc': 'descartes pascal spinoza leibniz',
  'ba-roc-anh': 'hobbes locke berkeley',
  'co-dien': 'voltaire hume rousseau kant',
  'lang-man-duc': 'hegel schopenhauer marx',
  'lang-man': 'mill kierkegaard nietzsche',
  'the-ky-20': 'russell wittgenstein heidegger popper arendt',
  'paris': 'sartre beauvoir camus foucault',
};
export const SCHOOL = Object.fromEntries(Object.entries(GROUPS).flatMap(([key, ids]) => ids.split(' ').map((id) => [id, key])));

// Không có id thì là trang chủ; id chưa gán thì báo lỗi để build hỏng ngay
export function trackFor(id) {
  const key = id === undefined ? HOME_TRACK : SCHOOL[id];
  if (!key) throw new Error(`Chưa gán nhạc cho ${id}`);
  return { key, ...TRACKS[key] };
}

export function musicCredit(t) {
  return `Nhạc nền: <em>${esc(t.title)}</em> (${esc(t.composer)}, ${esc(t.year)}), ${esc(t.performer)} trình bày, <a href="${esc(t.source)}" target="_blank" rel="noopener">${esc(t.license)}</a>.`;
}
