// ---- Мои анкеты: сохранить заполненную форму, выбрать готовую, создать новую ----
// Всё хранится в браузере (localStorage). Черновик текущей формы сохраняется сам.
const FIELD_IDS = ['city', 'workFormat', 'tFrom', 'tTo', 'maxShift', 'name', 'contact', 'uni', 'spec', 'exp', 'course', 'eduForm'];
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
  document.getElementById('step1').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
