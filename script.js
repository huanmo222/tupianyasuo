document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionControls = document.getElementById('compressionControls');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E5E5E5';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E5E5';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processImage(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 处理上传的图片
    function processImage(file) {
        originalImage = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = `大小：${(file.size / 1024 / 1024).toFixed(2)} MB`;
            
            compressionControls.style.display = 'block';
            previewArea.style.display = 'grid';
            
            compressImage(file, qualitySlider.value / 100);
        };
        
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file, quality) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                compressedPreview.src = URL.createObjectURL(blob);
                compressedSize.textContent = `大小：${(blob.size / 1024 / 1024).toFixed(2)} MB`;
                
                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `compressed_${originalImage.name}`;
                    link.click();
                };
            }, 'image/jpeg', quality);
        };
    }
}); 