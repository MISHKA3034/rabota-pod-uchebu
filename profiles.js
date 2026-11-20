// ---- Мои анкеты: сохранить заполненную форму, выбрать готовую, создать новую ----
// Всё хранится в браузере (localStorage). Черновик текущей формы сохраняется сам.
const FIELD_IDS = ['city', 'workFormat', 'tFrom', 'tTo', 'maxShift', 'name', 'role', 'contact', 'about', 'uni', 'spec', 'exp', 'langs', 'course', 'eduForm'];
const FIELD_DEFAULTS = { workFormat: 'any', maxShift: '5', eduForm: 'day' };
const CHIP_GROUPS = ['slots', 'days', 'cats', 'skills', 'has', 'jobs', 'dirs'];
const CUSTOM_LISTS = { skills: SKILLS, has: HAS, jobs: JOBS };

const pressedLabels = group => [...document.querySelectorAll(`#${group} .chip[aria-pressed="true"]`)].map(b => b.textContent);

function captureForm() {
  const fields = {};
  FIELD_IDS.forEach(id => { fields[id] = document.getElementById(id).value; });
  const picks = {};
  CHIP_GROUPS.forEach(g => { picks[g] = pressedLabels(g); });
  const custom = {};
  Object.entries(CUSTOM_LISTS).forEach(([g, list]) => { custom[g] = list.filter(x => x.custom).map(x => x.label); });
  return { fields, picks, custom };
}

function applyForm(st) {
  st = st || {};
  const f = st.fields || {};
  FIELD_IDS.forEach(id => { document.getElementById(id).value = f[id] != null ? f[id] : (FIELD_DEFAULTS[id] || ''); });
  Object.entries(CUSTOM_LISTS).forEach(([g, list]) => {
    removeCustom(g, list);
    ((st.custom || {})[g] || []).forEach(label => addCustom(g, list, label, false));
  });
  CHIP_GROUPS.forEach(g => {
    const on = new Set(((st.picks || {})[g]) || []);
    document.querySelectorAll(`#${g} .chip`).forEach(b => b.setAttribute('aria-pressed', String(on.has(b.textContent))));
  });
  // Обновить подсказки и убрать устаревшие результаты прошлой анкеты
  document.getElementById('city').dispatchEvent(new Event('input'));
  updateTimeHint();
  clearNeedTime();
  document.getElementById('results').hidden = true;
  document.getElementById('resumeBox').hidden = true;
  document.getElementById('internList').innerHTML = '';
  updateFindCount();
}

// ---- Список анкет ----
const getProfiles = () => store.get('profiles', []);
const setProfiles = list => store.set('profiles', list);
let currentId = store.get('currentProfile', '');
const sel = document.getElementById('profSelect');
const nameIn = document.getElementById('profName');
const msg = document.getElementById('profMsg');
const delBtn = document.getElementById('profDel');

function say(text) { msg.textContent = text; }
function renderProfileList() {
  const list = getProfiles();
  if (currentId && !list.some(p => p.id === currentId)) currentId = '';
  sel.innerHTML = '<option value="">➕ Новая анкета</option>' +
    list.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');
  sel.value = currentId;
  delBtn.hidden = !currentId;
  delBtn.textContent = '🗑 Удалить';
  delete delBtn.dataset.confirm;
  store.set('currentProfile', currentId);
}
function markDirty() {
  const p = getProfiles().find(x => x.id === currentId);
  if (!p) return;
  const dirty = JSON.stringify(captureForm()) !== JSON.stringify(p.data);
  say(dirty ? '• есть несохранённые изменения' : '');
}

document.getElementById('profSave').onclick = () => {
  const name = nameIn.value.trim();
  if (!name) { say('Введи название анкеты, например «Подработка вечером».'); nameIn.focus(); return; }
  const list = getProfiles();
  const data = captureForm();
  let p = list.find(x => x.id === currentId);
  if (p) { p.name = name; p.data = data; p.saved = Date.now(); }
  else {
    p = { id: 'p' + Date.now(), name, data, saved: Date.now() };
    list.push(p);
    currentId = p.id;
  }
  setProfiles(list);
  renderProfileList();
  say(`Сохранено: «${name}»`);
};

document.getElementById('profNew').onclick = () => {
  currentId = '';
  applyForm({});
  nameIn.value = '';
  renderProfileList();
  store.set('draft', captureForm());
  say('Новая анкета: форма очищена.');
  if (typeof go === 'function') go('podbor');
};

sel.onchange = () => {
  const p = getProfiles().find(x => x.id === sel.value);
  currentId = p ? p.id : '';
  if (p) { applyForm(p.data); nameIn.value = p.name; say(`Открыта анкета «${p.name}»`); }
  else { applyForm({}); nameIn.value = ''; say('Новая анкета: форма очищена.'); }
  renderProfileList();
  store.set('draft', captureForm());
};

delBtn.onclick = () => {
  const p = getProfiles().find(x => x.id === currentId);
  if (!p) return;
  if (!delBtn.dataset.confirm) {           // второе нажатие подтверждает удаление
    delBtn.dataset.confirm = '1';
    delBtn.textContent = `Точно удалить «${p.name}»? Нажми ещё раз`;
    return;
  }
  setProfiles(getProfiles().filter(x => x.id !== p.id));
  currentId = '';
  nameIn.value = '';
  renderProfileList();
  say(`Анкета «${p.name}» удалена. Форма осталась заполненной — можно сохранить её заново.`);
};

// ---- Перенос между устройствами: файл анкеты ----
const FILE_TYPE = 'rabota-pod-uchebu/anketa';
document.getElementById('profExport').onclick = () => {
  const name = nameIn.value.trim() || 'Моя анкета';
  const file = { type: FILE_TYPE, version: 1, name, exported: new Date().toISOString(), data: captureForm() };
  const safe = name.replace(/[\\/:*?"<>|]+/g, '').slice(0, 40) || 'anketa';
  downloadFile(`Анкета — ${safe}.json`, 'application/json', JSON.stringify(file, null, 1));
  say(`Файл «Анкета — ${safe}.json» скачан. Перешли его себе и загрузи на другом устройстве.`);
};

// Берём из файла только известные поля, остальное игнорируем
function cleanData(d) {
  const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
  const arr = v => (Array.isArray(v) ? v.filter(x => typeof x === 'string').map(x => x.slice(0, 80)).slice(0, 60) : []);
  const out = { fields: {}, picks: {}, custom: {} };
  FIELD_IDS.forEach(id => { out.fields[id] = str((d.fields || {})[id], id === 'exp' ? 3000 : 200); });
  CHIP_GROUPS.forEach(g => { out.picks[g] = arr((d.picks || {})[g]); });
  Object.keys(CUSTOM_LISTS).forEach(g => { out.custom[g] = arr((d.custom || {})[g]); });
  return out;
}

document.getElementById('profImport').addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  e.target.value = '';                       // чтобы тот же файл можно было выбрать ещё раз
  if (!f) return;
  if (f.size > 200000) { say('Файл слишком большой — это не файл анкеты.'); return; }
  const reader = new FileReader();
  reader.onload = () => {
    let j;
    try { j = JSON.parse(reader.result); } catch (err) { say('Не получилось прочитать файл: это не файл анкеты (.json).'); return; }
    if (!j || j.type !== FILE_TYPE || !j.data) { say('Этот файл не похож на анкету с этого сайта.'); return; }
    const list = getProfiles();
    let name = (typeof j.name === 'string' && j.name.trim().slice(0, 60)) || 'Загруженная анкета';
    if (list.some(p => p.name === name)) {   // такое название уже есть — добавим номер
      let n = 2; while (list.some(p => p.name === `${name} (${n})`)) n++;
      name = `${name} (${n})`;
    }
    const data = cleanData(j.data);
    const p = { id: 'p' + Date.now(), name, data, saved: Date.now() };
    list.push(p);
    setProfiles(list);
    currentId = p.id;
    applyForm(data);
    nameIn.value = name;
    renderProfileList();
    store.set('draft', captureForm());
    say(`Загружена и сохранена анкета «${name}».`);
  };
  reader.onerror = () => say('Не получилось прочитать файл. Попробуй ещё раз.');
  reader.readAsText(f);
});

// ---- Черновик: форма не теряется при перезагрузке страницы ----
let draftTimer = null;
function saveDraft() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => { store.set('draft', captureForm()); markDirty(); }, 200);
}
['input', 'change', 'click'].forEach(ev => document.querySelector('main').addEventListener(ev, e => {
  if (e.target.closest('#profiles')) return;
  saveDraft();
}));

(function init() {
  const draft = store.get('draft', null);
  if (draft) applyForm(draft);
  const p = getProfiles().find(x => x.id === currentId);
  if (p) nameIn.value = p.name;
  renderProfileList();
  markDirty();
})();
