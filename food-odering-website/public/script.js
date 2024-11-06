let menu = [];
let order = [];

// Lấy menu từ server
fetch('/api/menu')
  .then(response => response.json())
  .then(data => {
    menu = data;
    renderMenu();
  });

// Hiển thị menu
function renderMenu() {
  const menuDiv = document.getElementById('menu');
  menuDiv.innerHTML = '';
  menu.forEach(item => {
    const foodDiv = document.createElement('div');
    foodDiv.innerHTML = `${item.name} - ${item.price} VND <button onclick="addToOrder(${item.id})">Thêm vào đơn</button>`;
    menuDiv.appendChild(foodDiv);
  });
}

// Thêm món vào đơn hàng
function addToOrder(id) {
  const food = menu.find(item => item.id === id);
  const existingOrderItem = order.find(item => item.id === id);

  if (existingOrderItem) {
    // Nếu món ăn đã có trong đơn hàng, tăng số lượng
    existingOrderItem.quantity++;
  } else {
    // Nếu món ăn chưa có, thêm vào đơn hàng với số lượng là 1
    order.push({ ...food, quantity: 1 });
  }

  renderOrder();
}

// Hiển thị đơn hàng
function renderOrder() {
  const orderDiv = document.getElementById('order');
  orderDiv.innerHTML = '';
  let totalPrice = 0;

  order.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    const orderItemDiv = document.createElement('div');
    orderItemDiv.innerHTML = `
      ${item.name} - ${item.price} VND x ${item.quantity}
      <button onclick="increaseQuantity(${index})">+</button>
      <button onclick="decreaseQuantity(${index})">-</button>
      <button onclick="removeFromOrder(${index})">Xóa</button>`;
    orderDiv.appendChild(orderItemDiv);
  });

  document.getElementById('totalPrice').innerText = totalPrice;
}

// Tăng số lượng món ăn
function increaseQuantity(index) {
  order[index].quantity++;
  renderOrder();
}

// Giảm số lượng món ăn
function decreaseQuantity(index) {
  if (order[index].quantity > 1) {
    order[index].quantity--;
  } else {
    removeFromOrder(index);  // Nếu số lượng là 1, xóa món ăn khỏi đơn hàng
  }
  renderOrder();
}

// Xóa món khỏi đơn hàng
function removeFromOrder(index) {
  order.splice(index, 1);
  renderOrder();
}

// Tính tiền thừa
function calculateChange() {
  const customerMoney = parseInt(document.getElementById('customerMoney').value);
  const totalPrice = parseInt(document.getElementById('totalPrice').innerText);

  if (customerMoney >= totalPrice) {
    const change = customerMoney - totalPrice;
    document.getElementById('change').innerText = change;

    // Hiển thị nút "Tạo biên lai mới"
    document.getElementById('newReceiptBtn').style.display = 'block';
  } else {
    alert('Số tiền khách đưa không đủ!');
  }
}

// Tạo biên lai mới
function newReceipt() {
  // Reset order và giao diện
  order = [];
  renderOrder();
  document.getElementById('customerMoney').value = '';
  document.getElementById('change').innerText = '0';

  // Ẩn nút "Tạo biên lai mới"
  document.getElementById('newReceiptBtn').style.display = 'none';
}

// Thêm món mới vào menu
function addFood() {
  const name = document.getElementById('newFoodName').value;
  const price = parseInt(document.getElementById('newFoodPrice').value);
  const newFood = { id: menu.length + 1, name, price };
  
  fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFood)
  }).then(response => response.json())
    .then(data => {
      menu.push(data);
      renderMenu();
    });
}
