const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');

// 配置 multer 存储
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 获取所有视频
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 上传新视频
router.post('/', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const videoUrl = `/uploads/${req.files['video'][0].filename}`;
        const thumbnailUrl = `/uploads/${req.files['thumbnail'][0].filename}`;

        const video = new Video({
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl
        });

        const newVideo = await video.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 