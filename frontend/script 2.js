// 在现有的 uploadForm 提交处理中修改：

uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        formData.append('title', document.getElementById('videoTitle').value);
        formData.append('description', document.getElementById('videoDescription').value);
        formData.append('duration', document.getElementById('videoDuration').value);
        
        const videoFile = document.getElementById('videoFile').files[0];
        const thumbnailFile = document.getElementById('thumbnailFile').files[0];
        
        if (!videoFile || !thumbnailFile) {
            throw new Error('请选择视频文件和封面图片');
        }
        
        formData.append('video', videoFile);
        formData.append('thumbnail', thumbnailFile);

        const response = await fetch('http://localhost:3000/api/videos', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '上传失败');
        }

        alert('视频上传成功！');
        uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        uploadForm.reset();
        loadVideos(); // 刷新视频列表
        
    } catch (error) {
        console.error('上传错误：', error);
        alert('上传失败：' + error.message);
    }
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
                    <video controls poster="${video.thumbnailUrl}">
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