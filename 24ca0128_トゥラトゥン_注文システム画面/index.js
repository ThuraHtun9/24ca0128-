// ====== FULL UPDATED JS ======

const drinkMenu = [
  { name: 'Espresso', price: 500, image: 'images/drink/Espresso.jpg' },
  { name: 'Latte', price: 580, image: 'images/drink/Latte.jpg' },
  { name: 'Cappuccino', price: 525, image: 'images/drink/Cappuccino.jpg' },
  { name: 'Mocha', price: 573, image: 'images/drink/mocha.jpg' },
  { name: 'Americano', price: 480, image: 'images/drink/Americano.jpg' },
  { name: 'Matcha', price: 615, image: 'images/drink/Matcha.jpg' },
  { name: 'Cola', price: 335, image: 'images/drink/Cola.jpg' },
  { name: 'Melon Soda', price: 380, image: 'images/drink/MelonSoda.jpg' },
  { name: 'Orange Juice', price: 400, image: 'images/drink/OrangeJuice.jpg' },
  { name: 'Tropical Twist', price: 558, image: 'images/drink/TropicalTwist.jpg' }
];

const dessertsMenu = [
  { name: 'Apple Pie', price: 368, image: 'images/desserts/Apple_Pie.jpg' },
  { name: 'Brownie', price: 438, image: 'images/desserts/Brownie.jpg' },
  { name: 'Cheese Cake', price: 480, image: 'images/desserts/CheeseCake.jpg' },
  { name: 'Choco Lava', price: 520, image: 'images/desserts/ChocoLava.jpg' },
  { name: 'Crème brûlée', price: 550, image: 'images/desserts/Crème_brûlée.jpg' },
  { name: 'Key Lime Pie', price: 569, image: 'images/desserts/Key_Lime_Pie.jpg' },
  { name: 'Panna Cotta', price: 620, image: 'images/desserts/Panna_Cotta.jpg' },
  { name: 'Profiteroles', price: 593, image: 'images/desserts/Profiteroles.jpg' },
  { name: 'Tiramisu', price: 607, image: 'images/desserts/Tiramisu.jpg' }
];

let orderHistory = [];

function createMenuItems(menu, type) {
  return menu.map((item, i) => `
    <div class="item" data-type="${type}" data-index="${i}">
      <img src="${item.image}" alt="${item.name}" />
      <div>${item.name} - ${item.price}円</div>
      <div class="qty-badge" id="qty-badge-${type}-${i}">0</div>
    </div>
  `).join('') + `<button class="done-button" onclick="handleDone('${type}')">完了</button>`;
}

function handleDone(type) {
  const flip = type === 'drink' ? document.getElementById('drinkFlip') : document.getElementById('dessertsFlip');
  flip.classList.remove('flipped');
}

function setupItemClickHandlers(type) {
  const container = type === 'drink' ? document.getElementById('drinkMenu') : document.getElementById('dessertsMenu');

  container.querySelectorAll('.item').forEach(item => {
    let lastTapTime = 0;

    item.onclick = () => {
      const now = Date.now();
      const t = item.getAttribute('data-type');
      const i = item.getAttribute('data-index');
      const badge = document.getElementById(`qty-badge-${t}-${i}`);
      let count = parseInt(badge.textContent) || 0;

      if (now - lastTapTime < 300) {
        count = Math.max(0, count - 1);
      } else {
        count += 1;
      }

      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
      lastTapTime = now;
    };
  });
}

const drinkFlip = document.getElementById('drinkFlip');
const dessertsFlip = document.getElementById('dessertsFlip');
const drinkMenuDiv = document.getElementById('drinkMenu');
const dessertsMenuDiv = document.getElementById('dessertsMenu');

document.getElementById('drinkBtn').onclick = () => {
  drinkMenuDiv.innerHTML = createMenuItems(drinkMenu, 'drink');
  drinkFlip.classList.add('flipped');
  dessertsFlip.classList.remove('flipped');
  setupItemClickHandlers('drink');
};

document.getElementById('dessertsBtn').onclick = () => {
  dessertsMenuDiv.innerHTML = createMenuItems(dessertsMenu, 'dessert');
  dessertsFlip.classList.add('flipped');
  drinkFlip.classList.remove('flipped');
  setupItemClickHandlers('dessert');
};

document.getElementById('order_button').onclick = () => {
  let total = 0;
  let order = [];

  [...drinkMenu, ...dessertsMenu].forEach(item => {
    const type = drinkMenu.includes(item) ? 'drink' : 'dessert';
    const index = drinkMenu.includes(item) ? drinkMenu.indexOf(item) : dessertsMenu.indexOf(item);
    const badge = document.getElementById(`qty-badge-${type}-${index}`);
    if (badge) {
      const qty = parseInt(badge.textContent) || 0;
      if (qty > 0) {
        order.push({ name: item.name, qty, price: item.price, image: item.image });
        total += qty * item.price;
      }
    }
  });

  if (order.length === 0) return alert('すべての注文個数が0です。');
  if (!confirm('注文します。よろしいですか?')) return;

  alert(`合計金額は ${total} 円です。`);

  const li = document.createElement('li');
  order.forEach(o => {
    const d = document.createElement('div');
    d.className = 'history-item';
    d.innerHTML = `
      <img src="${o.image}" alt="${o.name}">
      <div class="history-details">${o.name} × ${o.qty} (¥${o.price * o.qty})</div>
    `;
    li.appendChild(d);
  });
  const totalLine = document.createElement('div');
  totalLine.innerHTML = `<strong>合計: ${total}円</strong>`;
  li.appendChild(totalLine);
  document.getElementById('historyList').appendChild(li);
  orderHistory.push({ items: order, total });

  document.querySelectorAll('.qty-badge').forEach(badge => {
    badge.textContent = '0';
    badge.style.display = 'none';
  });

  drinkFlip.classList.remove('flipped');
  dessertsFlip.classList.remove('flipped');
};

document.getElementById('bill_button').onclick = () => {
  if (orderHistory.length === 0) return alert('注文履歴がありません。');
  if (!confirm('会計を行いますか？')) return;
  const total = orderHistory.reduce((sum, rec) => sum + rec.total, 0);
  alert(`合計で ${total} 円でした。`);
  document.getElementById('historyList').innerHTML = '';
  orderHistory = [];
};

document.getElementById('cancel_button').onclick = () => {
  document.querySelectorAll('.qty-badge').forEach(badge => {
    badge.textContent = '0';
    badge.style.display = 'none';
  });
};
