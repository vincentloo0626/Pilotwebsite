require('dotenv').config();
console.log('服务器正在启动...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/pilot-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB 连接成功');
}).catch(err => {
    console.error('MongoDB 连接错误:', err);
});

// 路由
try {
    const videoRoutes = require('./routes/videos');
    app.use('/api/videos', videoRoutes);
} catch (error) {
    console.error('路由加载错误:', error);
}

// 所有其他路由返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}).on('error', (err) => {
    console.error('服务器启动错误:', err);
}); 