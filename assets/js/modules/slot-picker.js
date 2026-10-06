// Elegir día y hora para una cita. Lee el horario de la tabla [data-hours] de la página
// (la misma que usa "Abierto ahora"), así que el horario solo se escribe en un lugar.
//
//   <div class="slot-picker" data-slot-picker data-days-ahead="12" data-interval="30"
//        data-lead-minutes="120">
//     <div data-slot-fallback>…campos de texto "día" y "hora" para cuando no hay JavaScript…</div>
//   </div>
//
// Con JavaScript, quita el respaldo y dibuja los próximos días abiertos y, al elegir uno,
// sus horas cada data-interval minutos (la última termina a la hora de cierre). Omite las
// horas de hoy que ya pasaron o empiezan antes de data-lead-minutes, y las que caen en la
// hora de comida de la fila (data-break="14:00-16:00" en el <tr>, igual que opening-hours).
// Los campos se llaman data-name-day ("dia") y data-name-time ("hora"); el día
// se envía en texto largo ("lunes 6 de octubre") para el mensaje de WhatsApp.
export function initSlotPicker() {
  for (const picker of document.querySelectorAll("[data-slot-picker]")) {
    const scope = picker.closest("[data-hours-scope]") ?? document;
    const table = scope.querySelector("[data-hours]");
    if (!table) continue;

    const rows = [...table.querySelectorAll("tr[data-days][data-open][data-close]")].map((row) => {
      const [breakStart, breakEnd] = (row.dataset.break ?? "").split("-");
      return {
        days: row.dataset.days.split(",").map(Number),
        open: toMinutes(row.dataset.open),
        close: toMinutes(row.dataset.close),
        breakStart: breakStart && breakEnd ? toMinutes(breakStart) : null,
        breakEnd: breakStart && breakEnd ? toMinutes(breakEnd) : null,
      };
    });
    const interval = Number(picker.dataset.interval ?? 30);
    const lead = Number(picker.dataset.leadMinutes ?? 60);
    const lang = document.documentElement.lang || "es-MX";
    const names = { day: picker.dataset.nameDay ?? "dia", time: picker.dataset.nameTime ?? "hora" };
    const uid = `slot-${Math.random().toString(36).slice(2, 8)}`;

    const timesFor = (date) => {
      const row = rows.find((candidate) => candidate.days.includes(date.getDay()));
      if (!row) return [];
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const earliest = now.getHours() * 60 + now.getMinutes() + lead;
      const times = [];
      for (let start = row.open; start + interval <= row.close; start += interval) {
        if (row.breakStart !== null && start < row.breakEnd && start + interval > row.breakStart) continue;
        if (isToday && start < earliest) continue;
        times.push(start);
      }
      return times;
    };

    const days = [];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (let offset = 0; days.length < Number(picker.dataset.daysAhead ?? 12) && offset < 60; offset += 1) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + offset);
      if (timesFor(date).length) days.push(date);
    }
    if (!days.length) continue;

    picker.querySelector("[data-slot-fallback]")?.remove();

    const dayGroup = group("slot-picker__days", picker.dataset.labelDay ?? "Día");
    const timeGroup = group("slot-picker__times", picker.dataset.labelTime ?? "Hora");
    const timeList = timeGroup.querySelector("div");

    days.forEach((date, index) => {
      const long = date.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });
      const option = choice(`${uid}-d${index}`, names.day, long, "slot-picker__day", index === 0);
      const label = option.querySelector("label");
      label.setAttribute("aria-label", long);
      label.append(
        span("slot-picker__weekday", date.toLocaleDateString(lang, { weekday: "short" }).replace(".", "")),
        span("slot-picker__date", String(date.getDate())),
        span("slot-picker__month", date.toLocaleDateString(lang, { month: "short" }).replace(".", "")),
      );
      option.querySelector("input").addEventListener("change", () => renderTimes(date));
      dayGroup.querySelector("div").append(option);
    });

    function renderTimes(date) {
      timeList.replaceChildren(
        ...timesFor(date).map((start, index) => {
          const value = fromMinutes(start);
          const option = choice(`${uid}-t${index}`, names.time, value, "slot-picker__time", index === 0);
          option.querySelector("label").append(value);
          return option;
        }),
      );
      timeGroup.hidden = false;
    }

    timeGroup.hidden = true;
    picker.append(dayGroup, timeGroup);
  }
}

function group(className, legend) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = `slot-picker__group ${className}`;
  const title = document.createElement("legend");
  title.className = "slot-picker__legend";
  title.textContent = legend;
  const list = document.createElement("div");
  list.className = "slot-picker__options";
  fieldset.append(title, list);
  return fieldset;
}

function choice(id, name, value, className, required) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  const input = document.createElement("input");
  Object.assign(input, { type: "radio", id, name, value, required, className: "slot-picker__input" });
  const label = document.createElement("label");
  label.htmlFor = id;
  wrapper.append(input, label);
  return wrapper;
}

function span(className, text) {
  const element = document.createElement("span");
  element.className = className;
  element.textContent = text;
  return element;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(total) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
