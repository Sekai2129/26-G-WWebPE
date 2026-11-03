const API_KEY = "AIzaSyBlp3hAo18x2KZfW8qYac2YqiyTEIYIxHI";
const SPREADSHEET_ID = "1evgyhj7GsTQ17NZkatuE9j6KhwfEPrOf2sUf675lxFM";
const RANGE = "RawData!A1:H2"; // row 1 = headers, row 2 = Jane Doe

const url =
  `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;

async function loadCard() {
  const card = document.getElementById("card");
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Request failed");

    const [headers, row] = data.values;
    const record = {};
    headers.forEach((h, i) => {
      record[h.trim()] = (row[i] ?? "").trim() || "N/A"; // API drops empty trailing cells
    });

    renderCard(card, record);
  } catch (err) {
    card.innerHTML = "";
    const p = document.createElement("p");
    p.className = "status error";
    p.textContent = "Failed to load data: " + err.message;
    card.appendChild(p);
  }
}

function renderCard(card, record) {
  card.innerHTML = "";

  const avatar = document.createElement("img");
  avatar.src = "assets/circle-user-round-2.svg";
  avatar.alt = "Avatar";
  avatar.className = "avatar";

  const name = document.createElement("h2");
  name.textContent = record["Full Name"];

  const idNum = document.createElement("p");
  idNum.className = "subtitle";
  idNum.textContent = "ID Number: " + record["ID Number"];

  const left = document.createElement("section");
  left.className = "panel-left";
  left.append(avatar, name, idNum);

  const heading = document.createElement("h3");
  heading.className = "panel-title";
  heading.textContent = "Yearbook Registration";

  const list = document.createElement("dl");
  const skip = ["Full Name", "ID Number"]; 
  Object.entries(record)
    .filter(([label]) => !skip.includes(label))
    .forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "row";
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      row.append(dt, dd);
      list.appendChild(row);
    });

  const right = document.createElement("section");
  right.className = "panel-right";
  right.append(heading, list);

  card.append(left, right);
}

loadCard();