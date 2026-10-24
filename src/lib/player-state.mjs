// Trạng thái nút nhạc nền. Mọi hàm nhận storage (hoặc null) và không bao giờ ném lỗi,
// vì localStorage/sessionStorage có thể bị chặn (chế độ ẩn danh, tắt dữ liệu trang).
export const PREF_KEY = 'stgt-music-on';
export const POS_KEY = 'stgt-music-pos';

export function readPref(storage) {
  try { return storage.getItem(PREF_KEY) === '1'; } catch { return false; }
}

export function writePref(storage, on) {
  try { storage.setItem(PREF_KEY, on ? '1' : '0'); } catch { /* không nhớ được thì thôi */ }
}

// Chỉ trả vị trí đã lưu khi cùng bản nhạc; khác bản hoặc dữ liệu hỏng thì bắt đầu từ đầu
export function readPos(storage, key) {
  try {
    const v = JSON.parse(storage.getItem(POS_KEY));
    return v && v.key === key && Number.isFinite(v.t) && v.t >= 0 ? v.t : 0;
  } catch { return 0; }
}

export function writePos(storage, key, t) {
  try { storage.setItem(POS_KEY, JSON.stringify({ key, t })); } catch { /* bỏ qua */ }
}
