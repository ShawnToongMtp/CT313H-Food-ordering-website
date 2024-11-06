const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Lấy dữ liệu từ file JSON
app.get('/api/menu', (req, res) => {
  fs.readFile('./data/menu.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send("Lỗi server");
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// Thêm món ăn
app.post('/api/menu', (req, res) => {
  fs.readFile('./data/menu.json', 'utf8', (err, data) => {
    if (err) throw err;
    const menu = JSON.parse(data);
    menu.push(req.body);
    fs.writeFile('./data/menu.json', JSON.stringify(menu, null, 2), err => {
      if (err) throw err;
      res.send(req.body);
    });
  });
});

// Sửa món ăn
app.put('/api/menu/:id', (req, res) => {
  fs.readFile('./data/menu.json', 'utf8', (err, data) => {
    if (err) throw err;
    let menu = JSON.parse(data);
    const index = menu.findIndex(item => item.id == req.params.id);
    if (index !== -1) {
      menu[index] = req.body;
      fs.writeFile('./data/menu.json', JSON.stringify(menu, null, 2), err => {
        if (err) throw err;
        res.send(req.body);
      });
    } else {
      res.status(404).send("Không tìm thấy món ăn");
    }
  });
});

// Xóa món ăn
app.delete('/api/menu/:id', (req, res) => {
  fs.readFile('./data/menu.json', 'utf8', (err, data) => {
    if (err) throw err;
    let menu = JSON.parse(data);
    menu = menu.filter(item => item.id != req.params.id);
    fs.writeFile('./data/menu.json', JSON.stringify(menu, null, 2), err => {
      if (err) throw err;
      res.send({ message: "Đã xóa" });
    });
  });
});

app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});