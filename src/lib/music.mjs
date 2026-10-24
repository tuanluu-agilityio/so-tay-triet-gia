import { esc } from './philosophers.mjs';

// Bảng nhạc nền: mỗi trường phái âm nhạc một bản thu giấy phép tự do.
// performer, license, source: bản thu đã kiểm tra giấy phép ở trang gốc (Wikimedia Commons).
const t = (title, composer, year, why, key, performer, license, source) => ({ title, composer, year, why, file: `/audio/${key}.mp3`, performer, license, source });

export const TRACKS = {
  'hy-lap-co': t('Epitaph of Seikilos', 'Seikilos', 'khoảng thế kỷ 1', 'Bản nhạc Hy Lạp cổ hoàn chỉnh xưa nhất còn lại', 'hy-lap-co', 'Marcus Harvey (hát)', 'CC BY-SA 2.5', 'https://commons.wikimedia.org/wiki/File:Ο_Επιτάφιος_του_Σεῖκιλου_-_Epitaph_of_Seikilos.ogg'),
  'binh-ca': t('Pange lingua gloriosi', 'Bình ca Gregorian', 'thế kỷ 13', 'Thánh ca do chính Aquinas soạn lời', 'binh-ca', 'Gareth Hughes (hát bình ca)', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Pange_Lingua_Latin_in_Latin.ogg'),
  'phuc-hung': t('Fantasia', 'Francesco da Milano', 'thế kỷ 16', 'Nhạc sĩ Ý cùng thời Machiavelli', 'phuc-hung', 'Pracchia-78 (bản dựng guitar dây nylon)', 'Public Domain', 'https://commons.wikimedia.org/wiki/File:Francesco_Canova_da_Milano-Fantasia.ogg'),
  'ba-roc': t('Goldberg Variations, Aria', 'J. S. Bach', '1741', 'Baroque lục địa; Leibniz cùng thời Bach', 'ba-roc', 'Kimiko Ishizaka (piano)', 'CC0', 'https://commons.wikimedia.org/wiki/File:Kimiko_Ishizaka_-_J.S._Bach-_-Open-_Goldberg_Variations,_BWV_988_(Piano)_-_01_Aria.mp3'),
  'ba-roc-anh': t('Keyboard Suite HWV 437, Sarabande', 'Handel', '1733', 'Handel sống ở London cùng thời Locke, Berkeley', 'ba-roc-anh', 'Edward Cree (organ điện tử)', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Handel_-_Suite_Vol._2_No._4_in_D_minor_HWV_437_-_4._Sarabande.oga'),
  'co-dien': t('Piano Sonata K. 545, chương II Andante', 'Mozart', '1788', 'Âm nhạc của thời Khai sáng', 'co-dien', 'Bernd Krueger (piano)', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Mozart_-_Piano_Sonata_No._16_in_C_major_-_II._Andante.ogg'),
  'lang-man-duc': t('Sonata “Ánh trăng”, chương I', 'Beethoven', '1801', 'Beethoven sinh cùng năm với Hegel (1770)', 'lang-man-duc', 'Paul Pitman (piano, Musopen)', 'Public Domain', "https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_sonata_no._14_in_c_sharp_minor_'moonlight',_op._27_no._2_-_i._adagio_sostenuto.ogg"),
  'lang-man': t('Nocturne Op. 9 số 2', 'Chopin', '1832', 'Nietzsche rất mê Chopin', 'lang-man', 'Peter Johnston (piano, Musopen)', 'CC0', 'https://commons.wikimedia.org/wiki/File:Chopin_Nocturne_No._2_in_E_Flat_Major,_Op._9.ogg'),
  'the-ky-20': t('Intermezzo Op. 118 số 2', 'Brahms', '1893', 'Brahms là khách quen của gia đình Wittgenstein ở Vienna', 'the-ky-20', 'Musopen (piano)', 'Public Domain', 'https://commons.wikimedia.org/wiki/File:Johannes_Brahms_-_klavierstucke,_op._118_-_ii._intermezzo.ogg'),
  'paris': t('Gymnopédie số 1', 'Satie', '1888', 'Paris của phái hiện sinh', 'paris', 'Michael Laucke (guitar)', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Satie_Gymnopedie_No_1_performed_by_Michael_Laucke.flac'),
};

export const HOME_TRACK = 'ba-roc';

// id triết gia → key trong TRACKS
const GROUPS = {
  'hy-lap-co': 'thales anaximander pythagoras heraclitus parmenides zeno-elea democritus socrates plato diogenes aristotle epicurus zeno-citium seneca epictetus marcus-aurelius plotinus',
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
