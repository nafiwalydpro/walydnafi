(() => {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('monthTitle');
  const selectedLabel = document.getElementById('selectedDate');
  const slots = document.getElementById('rdvSlots');
  const slotsGrid = document.getElementById('slotsGrid');
  const slotDateLabel = document.getElementById('slotDateLabel');
  const prev = document.getElementById('prevMonth');
  const next = document.getElementById('nextMonth');

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let view = new Date(now.getFullYear(), now.getMonth(), 1);
  let selected = null;
  let selectedTime = null;

  const months = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];
  const days = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
  const hours = Array.from({ length: 9 }, (_, i) => `${String(10 + i).padStart(2, '0')}:00`);
  const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  function renderSlots() {
    if (!selected) {
      slots.hidden = true;
      slotsGrid.innerHTML = '';
      return;
    }

    slots.hidden = false;
    slotDateLabel.textContent = `${days[selected.getDay()]} ${selected.getDate()} ${months[selected.getMonth()].toLowerCase()} ${selected.getFullYear()}`;
    slotsGrid.innerHTML = '';

    hours.forEach((time) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rdv-slot';
      button.textContent = time;
      button.setAttribute('aria-label', `Choisir ${time}`);
      if (selectedTime === time) button.classList.add('selected');
      button.addEventListener('click', () => {
        selectedTime = time;
        renderSlots();
        selectedLabel.textContent = `${days[selected.getDay()]} ${selected.getDate()} ${months[selected.getMonth()].toLowerCase()} ${selected.getFullYear()} — ${time}`;
      });
      slotsGrid.appendChild(button);
    });
  }

  function render() {
    const y = view.getFullYear();
    const m = view.getMonth();
    title.textContent = `${months[m]} ${y}`;
    grid.innerHTML = '';

    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rdv-day other';
      b.disabled = true;
      grid.appendChild(b);
    }

    for (let n = 1; n <= count; n++) {
      const d = new Date(y, m, n);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rdv-day';
      b.textContent = n;

      if (same(d, now)) b.classList.add('today');
      if (selected && same(d, selected)) b.classList.add('selected');

      const unavailable = d < now || d.getDay() === 0 || d.getDay() === 6;
      b.disabled = unavailable;

      if (!unavailable) {
        b.addEventListener('click', () => {
          selected = new Date(d);
          selectedTime = null;
          selectedLabel.textContent = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()].toLowerCase()} ${d.getFullYear()} — choisissez une heure`;
          selectedLabel.classList.add('has-date');
          render();
          renderSlots();
        });
      }
      grid.appendChild(b);
    }

    while (grid.children.length < 42) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rdv-day other';
      b.disabled = true;
      grid.appendChild(b);
    }

    prev.disabled = view <= new Date(now.getFullYear(), now.getMonth(), 1);
  }

  prev.addEventListener('click', () => {
    if (!prev.disabled) {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
      render();
    }
  });

  next.addEventListener('click', () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    render();
  });

  render();
})();
