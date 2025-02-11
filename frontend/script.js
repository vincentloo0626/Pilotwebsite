document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要的元素
    const modal = document.getElementById('signupModal');
    const closeButton = document.querySelector('.close-button');
    const signupButtons = document.querySelectorAll('.cta-button, .primary-button');
    const form = document.getElementById('signupForm');
    const uploadButton = document.getElementById('uploadButton');
    const uploadModal = document.getElementById('uploadModal');
    const uploadForm = document.getElementById('uploadForm');

    // 打开模态框
    signupButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });

    // 关闭模态框
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            wechat: document.getElementById('wechat').value
        };

        // 这里可以添加发送数据到服务器的代码
        console.log('表单数据：', formData);

        // 显示成功消息
        alert('报名成功！我们会尽快与您联系。');
        
        // 关闭模态框
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 重置表单
        form.reset();
    });

    // 打开上传模态框
    uploadButton.addEventListener('click', function() {
        uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // 关闭上传模态框
    uploadModal.querySelector('.close-button').addEventListener('click', function() {
        uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 添加加载视频的函数
    async function loadVideos() {
        try {
            const response = await fetch('http://localhost:3000/api/videos');
            const videos = await response.json();
            
            const resourcesGrid = document.querySelector('.resources-grid');
            resourcesGrid.innerHTML = videos.map(video => `
                <div class="resource-card">
                    <div class="video-container">
                        <video controls>
                            <source src="${video.videoUrl}" type="video/mp4">
                            您的浏览器不支持视频播放。
                        </video>
                    </div>
                    <div class="resource-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                        <span class="duration">${video.duration}:00</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('加载视频失败：', error);
        }
    }

    // 页面加载时获取视频列表
    document.addEventListener('DOMContentLoaded', loadVideos);

    // 在上传成功后刷新视频列表
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('videoTitle').value);
        formData.append('description', document.getElementById('videoDescription').value);
        formData.append('duration', document.getElementById('videoDuration').value);
        formData.append('video', document.getElementById('videoFile').files[0]);
        formData.append('thumbnail', document.getElementById('thumbnailFile').files[0]);

        try {
            const response = await fetch('http://localhost:3000/api/videos', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('视频上传成功！');
                uploadModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                uploadForm.reset();
                // 刷新视频列表
                loadVideos();
            } else {
                throw new Error('上传失败');
            }
        } catch (error) {
            alert('上传失败：' + error.message);
        }
    });
}); 