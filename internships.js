// ---- Стажировки и практика ----
// Данные проверены на сайтах компаний 15.11.2026. Пишем только то, что там сказано;
// «не указано» значит, что на странице этого нет.
const DIRS = [
  { id: 'it', label: 'IT, программирование' },
  { id: 'econ', label: 'Экономика, финансы, управление' },
  { id: 'marketing', label: 'Маркетинг, реклама' },
  { id: 'tech', label: 'Техника, инженерия, связь' },
  { id: 'law', label: 'Право' },
  { id: 'design', label: 'Дизайн' },
  { id: 'other', label: 'Другое' },
];

const INTERNS = [
  { id: 'sber', company: 'Сбер Банк (Беларусь)', name: 'СберПрактикум — оплачиваемая стажировка',
    status: 'closed', statusText: 'Набор закрыт. На сайте: «Скоро новый сезон»',
    courses: [3, 6], grad: true, dayOnly: false, dirs: ['it', 'design', 'econ'],
    who: 'студенты старших курсов, выпускники и те, кто сменил профессию после курсов; опыт не обязателен',
    areas: 'AI (промпт-инженер, AI-боты, ML), продакт-менеджмент, BI (Qlik Sense), дизайн',
    paid: 'оплачивается', format: '3 месяца, гибкий график, можно совмещать с учёбой',
    steps: ['Анкета и резюме', 'Тестовое задание', 'Интервью', 'Оффер'], testStep: 1, testDays: 5,
    apply: { type: 'site', url: 'https://www.sber-bank.by/sber-practicum' } },
  { id: 'mts', company: 'МТС Беларусь', name: 'Практика в МТС',
    status: 'request', statusText: 'Заявка через анкету на сайте',
    courses: [2, 4], grad: false, dayOnly: false, dirs: ['it', 'tech', 'marketing'],
    who: 'студенты 2–4 курса, IT, техника или маркетинг',
    areas: 'IT, техника, маркетинг', paid: 'не указано', format: 'не указано',
    steps: ['Анкета на сайте', 'Звонок HR (обещают за 24 часа)', 'Собеседование', 'Практика'],
    apply: { type: 'site', url: 'https://www.mts.by/company/vacancy/students/' } },
  { id: 'a1', company: 'А1 (Беларусь)', name: 'Практика для студентов',
    status: 'request', statusText: 'Заявка письмом с резюме',
    courses: null, grad: false, dayOnly: false, dirs: null,
    who: 'студенты (курс и специальность не указаны); лучшим — предложение работы после вуза',
    areas: 'IT, телеком, финансы, продажи, маркетинг, HR', paid: 'не указано', format: 'не указано',
    steps: ['Письмо с резюме', 'Ответ компании', 'Собеседование', 'Практика'],
    apply: { type: 'email', email: 'HRCV@A1.by', subject: 'Практика в А1', url: 'https://www.a1.by/ru/career' } },
  { id: 'asb', company: 'Беларусбанк', name: 'Студенческая практика',
    status: 'request', statusText: 'Анкета студента и договор банка с вузом',
    courses: null, grad: false, dayOnly: true, dirs: ['econ', 'law', 'it', 'tech'],
    who: 'только дневная форма: экономика, управление, право, IT, связь, радиоэлектроника, автоматизация, инфобезопасность',
    areas: 'отделения банка, контакт-центр, IT', paid: 'не указано', format: 'по договору вуза с банком',
    steps: ['Анкета студента и согласие на обработку данных', 'Договор вуза с банком', 'Конкурсный отбор', 'Практика'],
    apply: { type: 'site', url: 'https://belarusbank.by/o-banke/rabota-v-banke/oao_asb_belarusbank_studentam/' } },
  { id: 'belhard', company: 'BELHARD', name: 'Стажировки для студентов',
    status: 'request', statusText: 'Компания пишет, что возобновляет программу',
    courses: null, grad: false, dayOnly: false, dirs: ['it'],
    uniRx: /(рэу|плеханов)/i, uniText: 'студентов Минского филиала РЭУ им. Плеханова',
    who: 'студенты Минского филиала РЭУ им. Г. В. Плеханова', areas: 'IT, задачи с ментором',
    paid: 'не указано', format: 'не указано',
    steps: ['Письмо с резюме', 'Ответ компании', 'Стажировка с ментором'],
    apply: { type: 'email', email: 'job@belhard.com', subject: 'Стажировка для студентов', url: 'https://belhard.com/education/' } },
  { id: 'biznespark', company: 'Бизнес-инкубатор «С Нами Будущее»', name: 'Стажировка в IT-компании (Минск или удалённо)',
    status: 'open', statusText: 'Набор открыт (страница обновлена 22.10.2026)',
    courses: null, grad: true, dayOnly: false, dirs: ['it', 'econ', 'marketing'],
    who: 'любой курс и специальность; в анкете спрашивают уровень английского',
    areas: 'backend, AI/ML, проджект- и продакт-менеджмент, ассистенты, маркетинг',
    paid: 'бесплатная; оплачиваемая — при занятости 40 ч в неделю', format: '2–3 месяца, 20 ч в неделю',
    steps: ['Анкета на сайте', 'Собеседование (без тестового)', 'Стажировка'],
    apply: { type: 'site', url: 'https://biznespark.by/stajer/' } },
  { id: 'gsz', company: 'Служба занятости (gsz.gov.by)', name: 'Временная работа для студентов в свободное от учёбы время',
    status: 'open', statusText: '2 589 вакансий на 15.11.2026',
    courses: null, grad: false, dayOnly: false, dirs: null,
    who: 'учащаяся молодёжь, есть места для несовершеннолетних', areas: 'разные', paid: 'оплачивается',
    format: 'временная работа на срок из вакансии',
    steps: ['Выбрать вакансию', 'Связаться с нанимателем или службой занятости', 'Оформление'],
    apply: { type: 'site', url: 'https://gsz.gov.by/registration/temporary-employment/young/' } },
  { id: 'devby', company: 'dev.by Jobs', name: 'IT-вакансии уровня Intern',
    status: 'open', statusText: 'Подборка обновляется на сайте',
    courses: null, grad: true, dayOnly: false, dirs: ['it'],
    who: 'IT-студенты и выпускники', areas: 'разработка, тестирование и др.',
    paid: 'зависит от вакансии', format: 'зависит от вакансии',
    steps: ['Выбрать вакансию', 'Отклик с резюме', 'Собеседование'],
    apply: { type: 'site', url: 'https://jobs.devby.io/?filter[levels][]=intern' } },
];

renderChips('dirs', DIRS);
(function restoreDirs() {
  const saved = store.get('dirs', []);
  document.querySelectorAll('#dirs .chip').forEach(b => { if (saved.includes(b.dataset.id)) b.setAttribute('aria-pressed', 'true'); });
})();
document.getElementById('dirs').addEventListener('click', () => store.set('dirs', [...picked('dirs')]));

function readStudy() {
  return {
    course: document.getElementById('course').value,
    form: document.getElementById('eduForm').value,
    dirs: picked('dirs'),
    uni: document.getElementById('uni').value.trim(),
  };
}
const dirLabel = ids => ids.map(id => labelOf(DIRS, id).toLowerCase()).join(', ');

// Автопроверка «подхожу ли я»: вместо того чтобы читать условия на каждом сайте глазами
function checkIntern(p, st) {
  const lines = [];
  const ok = t => lines.push(['ok', t]), warn = t => lines.push(['warn', t]), bad = t => lines.push(['bad', t]);
  if (p.courses) {
    const [a, b] = p.courses;
    if (!st.course) warn(`нужен ${a}–${b} курс: укажи свой курс выше`);
    else if (st.course === 'grad') { p.grad ? ok('выпускникам можно') : bad('только для студентов, не для выпускников'); }
    else { const c = Number(st.course); (c < a || c > b) ? bad(`нужен ${a}–${b} курс, у тебя ${c}`) : ok(`курс подходит (${a}–${b})`); }
  } else if (st.course === 'grad' && !p.grad) warn('программа для студентов: уточни, берут ли выпускников');
  if (p.dayOnly) st.form === 'day' ? ok('дневная форма — подходит') : bad('только для дневной формы обучения');
  if (p.dirs) {
    if (!st.dirs.size) warn(`отметь направление: здесь берут ${dirLabel(p.dirs)}`);
    else {
      const hit = p.dirs.filter(d => st.dirs.has(d));
      hit.length ? ok(`направление подходит: ${dirLabel(hit)}`) : bad(`берут другие направления: ${dirLabel(p.dirs)}`);
    }
  }
  if (p.uniRx) {
    if (!st.uni) warn(`только для ${p.uniText}: укажи вуз во вкладке «Резюме»`);
    else p.uniRx.test(st.uni) ? ok('твой вуз подходит') : bad(`только для ${p.uniText}`);
  }
  if (!lines.length) ok('ограничений по курсу и специальности на сайте нет');
  const level = lines.some(l => l[0] === 'bad') ? 'no' : lines.some(l => l[0] === 'warn') ? 'maybe' : 'yes';
  return { level, lines };
}

// Письмо-заявка собирается само из анкеты (у А1 и BELHARD заявка — письмом с определённой темой)
function internLetter(p) {
  const s = readStudent(), st = readStudy();
  const val = id => document.getElementById(id).value.trim();
  const name = val('name') || '[имя и фамилия]';
  const courseText = st.course === 'grad' ? 'выпускник(ца)' : st.course ? `студент(ка) ${st.course} курса` : 'студент(ка)';
  const skills = [...s.skills].map(id => labelOf(SKILLS, id)).filter(Boolean).join(', ');
  const exp = [...s.jobs].map(id => labelOf(JOBS, id)).concat(val('exp').split('\n').map(x => x.trim()).filter(Boolean)).join('; ');
  const time = s.timeText || [...s.slots].map(id => labelOf(SLOTS, id).toLowerCase()).join(', ');
  const kind = /практик/i.test(p.name) ? 'практику' : 'стажировку';
  const subject = `${p.apply.subject} — ${name}`;
  const body = [
    'Здравствуйте!', '',
    `Меня зовут ${name}, я ${courseText}${val('uni') ? ' ' + val('uni') : ''}${val('spec') ? ', специальность «' + val('spec') + '»' : ''}.`,
    `Хочу пройти ${kind} в компании ${p.company}.`, '',
    skills ? `Мои навыки: ${skills}.` : '',
    exp ? `Опыт и проекты: ${exp}.` : '',
    time ? `Могу уделять время: ${time}.` : '', '',
    'Резюме прикладываю к письму. Буду рад(а) ответить на вопросы.', '',
    'С уважением,', name, val('contact'),
  ].filter((l, i, arr) => l !== '' || arr[i - 1] !== '').join('\n').trim();
  return { subject, body };
}

// Напоминание в календарь (.ics): открывается в Google Календаре, Outlook, на телефоне
const icsDate = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const ruDate = d => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
function calendarReminder(title, date, desc) {
  const next = new Date(date); next.setDate(next.getDate() + 1);
  const now = new Date();
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//rabota-pod-uchebu//RU', 'BEGIN:VEVENT',
    `UID:${now.getTime()}@rabota-pod-uchebu`,
    `DTSTAMP:${icsDate(now)}T000000Z`,
    `DTSTART;VALUE=DATE:${icsDate(date)}`, `DTEND;VALUE=DATE:${icsDate(next)}`,
    `SUMMARY:${title}`, `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
    'BEGIN:VALARM', 'TRIGGER:PT9H', 'ACTION:DISPLAY', `DESCRIPTION:${title}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  downloadFile('napominanie.ics', 'text/calendar', ics);
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const STATUS = { open: ['b-ok', 'Набор открыт'], request: ['b-mute', 'По заявке'], closed: ['b-bad', 'Набор закрыт'] };
const VERDICT = { yes: ['b-ok', '✓ Подходишь'], maybe: ['b-warn', '? Уточни'], no: ['b-bad', '✗ Не подходишь'] };

function internCard(p, r) {
  const tracked = store.get('apps', []).some(a => a.id === p.id);
  // Главное действие зависит от статуса: закрытый набор — напомнить, открытый — подать заявку
  const primary = r.level !== 'no' && p.status !== 'closed' ? 'btn-primary' : 'btn-secondary';
  const apply = p.apply.type === 'email'
    ? `<button type="button" class="btn ${primary}" data-ia="letter" data-id="${p.id}">Составить письмо-заявку</button>`
    : `<a class="btn ${primary}" href="${esc(p.apply.url)}" target="_blank" rel="noopener">Подать заявку на сайте ↗</a>`;
  return `<div class="vac${r.level === 'no' ? ' dim' : ''}" data-card="${p.id}">
    <div class="badges"><span class="badge ${VERDICT[r.level][0]}">${VERDICT[r.level][1]}</span><span class="badge ${STATUS[p.status][0]}">${STATUS[p.status][1]}</span></div>
    <h3>${esc(p.name)}</h3>
    <div class="meta">${esc(p.company)} · ${esc(p.statusText)}</div>
    <ul>${r.lines.map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join('')}</ul>
    <details><summary>Условия программы</summary>
    <dl>
      <dt>Кого берут</dt><dd>${esc(p.who)}</dd>
      <dt>Направления</dt><dd>${esc(p.areas)}</dd>
      <dt>Оплата</dt><dd>${esc(p.paid)}</dd>
      <dt>Формат</dt><dd>${esc(p.format)}</dd>
      <dt>Этапы</dt><dd>${p.steps.map(esc).join(' → ')}</dd>
    </dl></details>
    <div class="acts">
      ${apply}
      ${p.apply.type === 'email' ? `<a class="btn btn-ghost" href="${esc(p.apply.url)}" target="_blank" rel="noopener">Страница компании ↗</a>` : ''}
      <button type="button" class="btn btn-ghost" data-ia="track" data-id="${p.id}" aria-pressed="${tracked}">${tracked ? '✓ Отслеживается' : 'Отслеживать заявку'}</button>
      ${p.status === 'closed' ? `<button type="button" class="btn btn-ghost" data-ia="remind" data-id="${p.id}">Напомнить через 2 недели</button>` : ''}
    </div>
    <div class="letterBox"></div>
  </div>`;
}

function renderInterns() {
  const st = readStudy();
  const order = { yes: 0, maybe: 1, no: 2 }, sOrder = { open: 0, request: 1, closed: 2 };
  const rows = INTERNS.map(p => ({ p, r: checkIntern(p, st) }))
    .sort((a, b) => order[a.r.level] - order[b.r.level] || sOrder[a.p.status] - sOrder[b.p.status]);
  const yes = rows.filter(x => x.r.level === 'yes').length;
  document.getElementById('internList').innerHTML =
    `<p class="count">Подходишь точно: ${yes} из ${INTERNS.length}</p>` + rows.map(x => internCard(x.p, x.r)).join('') +
    '<p class="small">Проверено 15.11.2026. В Приорбанке и Альфа-Банке студенческих программ на сайтах не нашлось. У IDT сейчас нет стажировок. IT-кампус «Делойт» проводился в 2021 году.</p>';
}

// ---- Трекер заявок: этапы, срок тестового, напоминания ----
function renderTracker() {
  const apps = store.get('apps', []);
  const box = document.getElementById('tracker');
  if (!apps.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="more"><h3>Мои заявки (${apps.length})</h3>
    <p class="small">Нажимай на этап, когда он пройден. Сохраняется в этом браузере.</p>` +
    apps.map(a => {
      const p = INTERNS.find(x => x.id === a.id);
      if (!p) return '';
      const steps = p.steps.map((s, i) =>
        `<button type="button" class="chip" data-ia="step" data-id="${p.id}" data-step="${i}" aria-pressed="${i < a.done}">${i < a.done ? '✓ ' : ''}${esc(s)}</button>`).join('');
      let test = '';
      if (p.testDays && a.done > p.testStep) {
        test = '<p class="small">✓ Тестовое сдано.</p>';
      } else if (p.testDays) {
        if (a.testFrom) {
          const due = addDays(new Date(a.testFrom), p.testDays);
          const left = Math.ceil((due - new Date()) / 864e5);
          test = `<p class="small"><b>Тестовое сдать до ${ruDate(due)}</b> (${left > 0 ? 'осталось ' + left + ' дн.' : left === 0 ? 'сегодня' : 'срок прошёл'}).
            <button type="button" class="btn btn-ghost" data-ia="testcal" data-id="${p.id}">Добавить в календарь</button></p>`;
        } else {
          test = `<p class="small">На тестовое даётся ${p.testDays} дней. <button type="button" class="btn btn-ghost" data-ia="testgot" data-id="${p.id}">Я получил(а) тестовое</button></p>`;
        }
      }
      return `<div class="vac"><h3>${esc(p.name)}</h3><div class="meta">${esc(p.company)} · пройдено этапов: ${a.done} из ${p.steps.length}</div>
        <div class="steps">${steps}</div>${test}
        <div class="acts"><button type="button" class="btn btn-ghost" data-ia="untrack" data-id="${p.id}">Убрать из списка</button></div></div>`;
    }).join('') + '</div>';
}

document.getElementById('checkInterns').onclick = () => { renderInterns(); renderTracker(); };
['course', 'eduForm'].forEach(id => document.getElementById(id).addEventListener('change', () => {
  if (document.getElementById('internList').innerHTML) renderInterns();
}));
document.getElementById('dirs').addEventListener('click', () => {
  if (document.getElementById('internList').innerHTML) renderInterns();
});

document.getElementById('interns').addEventListener('click', e => {
  const b = e.target.closest('[data-ia]');
  if (!b) return;
  const p = INTERNS.find(x => x.id === b.dataset.id);
  const apps = store.get('apps', []);
  const app = apps.find(a => a.id === b.dataset.id);
  const save = list => { store.set('apps', list); renderTracker(); if (document.getElementById('internList').innerHTML) renderInterns(); };
  switch (b.dataset.ia) {
    case 'letter': {
      const box = b.closest('.vac').querySelector('.letterBox');
      if (box.innerHTML) { box.innerHTML = ''; return; }
      const L = internLetter(p);
      const mailto = `mailto:${p.apply.email}?subject=${encodeURIComponent(L.subject)}&body=${encodeURIComponent(L.body)}`;
      box.innerHTML = `<p class="small" style="margin-bottom:4px">Кому: <b style="user-select:all">${esc(p.apply.email)}</b> · Тема: <b style="user-select:all">${esc(L.subject)}</b></p>
        <textarea class="msg" aria-label="Письмо-заявка">${esc(L.body)}</textarea>
        <div class="acts"><button type="button" class="btn btn-secondary" data-ia="copyletter" data-id="${p.id}">Скопировать письмо</button>
        <a class="btn btn-ghost" href="${esc(mailto)}">Открыть в почте</a><span class="small"></span></div>
        <p class="small">Не забудь прикрепить резюме: его можно скачать в Word во вкладке «Резюме».</p>`;
      break;
    }
    case 'copyletter': {
      const box = b.closest('.letterBox');
      copyText(box.querySelector('textarea').value, box.querySelector('.acts .small'));
      break;
    }
    case 'track':
      save(app ? apps.filter(a => a.id !== p.id) : apps.concat({ id: p.id, done: 0, testFrom: null }));
      break;
    case 'untrack':
      save(apps.filter(a => a.id !== p.id));
      break;
    case 'step': {
      const i = Number(b.dataset.step);
      app.done = app.done === i + 1 ? i : i + 1;          // повторный клик снимает отметку
      save(apps);
      break;
    }
    case 'testgot':
      app.testFrom = new Date().toISOString();
      if (p.testStep != null && app.done < p.testStep) app.done = p.testStep;
      save(apps);
      break;
    case 'testcal': {
      const due = addDays(new Date(app.testFrom), p.testDays);
      calendarReminder(`Сдать тестовое: ${p.name}`, due, `${p.company}. Срок: ${p.testDays} дней с получения задания.`);
      break;
    }
    case 'remind':
      calendarReminder(`Проверить набор: ${p.name}`, addDays(new Date(), 14), `${p.company}. Ссылка: ${p.apply.url}`);
      break;
  }
});

renderTracker();
