
const imageUpload = document.getElementById('imageUpload');
const startCameraButton = document.getElementById('startCameraButton');
const captureButton = document.getElementById('captureButton');
const videoPreview = document.getElementById('videoPreview');
const imageCanvas = document.getElementById('imageCanvas');
const skinToneResult = document.getElementById('skinToneResult');
const outfitSuggestion = document.getElementById('outfitSuggestion');
const genderSelect = document.getElementById('gender');

const ctx = imageCanvas.getContext('2d');
let stream;


imageUpload.addEventListener('change', handleImageUpload);
startCameraButton.addEventListener('click', startCamera);
captureButton.addEventListener('click', captureFromCamera);


function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                drawImageToCanvas(img);
                detectSkinTone();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(videoStream => {
            stream = videoStream;
            videoPreview.srcObject = stream;
            videoPreview.style.display = 'block';
            imageCanvas.style.display = 'none';
            videoPreview.play();
            captureButton.disabled = false;
            startCameraButton.disabled = true;
        })
        .catch(err => console.error("Error accessing the camera:", err));
}

function captureFromCamera() {
    if (stream) {
        imageCanvas.width = videoPreview.videoWidth;
        imageCanvas.height = videoPreview.videoHeight;
        ctx.drawImage(videoPreview, 0, 0);
        videoPreview.style.display = 'none';
        imageCanvas.style.display = 'block';
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        captureButton.disabled = true;
        startCameraButton.disabled = false;
        detectSkinTone();
    }
}

function drawImageToCanvas(img) {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

function detectSkinTone() {
    const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const skinTone = getSkinTone(r, g, b);
    skinToneResult.textContent = `Detected Skin Tone: ${skinTone}`;

    suggestOutfit(skinTone, genderSelect.value);
}

function getSkinTone(r, g, b) {
    const brightness = (r + g + b) / 3;
    if (brightness > 200) return 'Fair';
    if (brightness > 150) return 'Light';
    if (brightness > 100) return 'Medium';
    return 'Dark';
}

function suggestOutfit(skinTone, gender) {
    const outfits = {
        male: {
            Fair: ['Blue Shirt with Khaki Pant','Gery Shirt with Black Pant' , 'White Shirt with navy Pant'],
            Light: ['Royal blue', 'Maroon', 'Olive green','Purple Shirt with White Pant'],
            Medium: ['white Shirt with Navy Pant' ,'Red Shirt with white Pant' ,'Yellow Shirt with Purple Pant'],
            Dark: ['Grey Shirt with Khaki Pant' ,'Purple Shirt with White Pant' ,'Yellow Shirt with Blue Jeans']
        },
        female: {
            Fair: ['Deep purple', 'Emerald green', 'Ruby red'],
            Light: ['Lavender', 'Teal', 'Coral'],
            Medium: ['Fuchsia', 'Turquoise', 'Peach'],
            Dark: ['Hot pink', 'Bright yellow', 'White']
        }
    };

    const suggestion = outfits[gender][skinTone];
    outfitSuggestion.textContent = `Suggested outfit colors: ${suggestion.join(', ')}`;
}
