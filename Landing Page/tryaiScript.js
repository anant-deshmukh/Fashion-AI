
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

// function captureFromCamera() {
//     if (stream) {
//         imageCanvas.width = videoPreview.videoWidth;
//         imageCanvas.height = videoPreview.videoHeight;
//         ctx.drawImage(videoPreview, 0, 0);
//         videoPreview.style.display = 'none';
//         imageCanvas.style.display = 'block';
//         stream.getTracks().forEach(track => track.stop());
//         stream = null;
//         captureButton.disabled = true;
//         startCameraButton.disabled = false;
//         detectSkinTone();
//     }
// }

let capturedImageData = null; // Variable to store captured image data

function captureFromCamera() {
    if (stream) {
        imageCanvas.width = videoPreview.videoWidth;
        imageCanvas.height = videoPreview.videoHeight;
        ctx.drawImage(videoPreview, 0, 0);
        videoPreview.style.display = 'none';
        imageCanvas.style.display = 'block';

        // Stop the video stream
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        captureButton.disabled = true;
        startCameraButton.disabled = false;

        // Store the captured image in a variable as base64 encoded data
        capturedImageData = imageCanvas.toDataURL('image/png');
        console.log('Captured Image Data:', capturedImageData); // Log the image data

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
            Fair: {
                formal: ['Blue Shirt with Khaki Pant', 'Grey Shirt with Black Pant', 'White Shirt with Navy Pant'],
                casual: ['Denim Jacket with T-Shirt', 'Polo Shirt with Shorts', 'Hoodie with Jeans'],
                images: ['formal_male_fair_1.jpg', 'formal_male_fair_2.jpg', 'casual_male_fair_1.jpg'] // Example image paths
            },
            Light: {
                formal: ['Royal Blue Suit', 'Maroon Blazer', 'Olive Green Shirt with Dress Pants'],
                casual: ['T-Shirt with Jeans', 'Casual Shirt with Chinos', 'Light Hoodie with Joggers'],
                images: ['formal_male_light_1.jpg', 'casual_male_light_1.jpg']
            },
            Medium: {
                formal: ['White Shirt with Navy Pant', 'Red Shirt with White Pant', 'Yellow Shirt with Purple Pant'],
                casual: ['V-neck T-Shirt', 'Button-down Shirt with Shorts', 'Windbreaker Jacket'],
                images: ['formal_male_medium_1.jpg', 'casual_male_medium_1.jpg']
            },
            Dark: {
                formal: ['Grey Shirt with Khaki Pant', 'Purple Shirt with White Pant', 'Yellow Shirt with Blue Jeans'],
                casual: ['Sweater with Jeans', 'Casual Blazer with T-shirt', 'Graphic T-Shirt'],
                images: ['formal_male_dark_1.jpg', 'casual_male_dark_1.jpg']
            }
        },
        female: {
            Fair: {
                formal: ['Deep Purple Dress', 'Emerald Green Suit', 'Ruby Red Gown'],
                casual: ['Floral Dress', 'Denim Jacket with Leggings', 'T-shirt with Skirt'],
                images: ['formal_female_fair_1.jpg', 'casual_female_fair_1.jpg']
            },
            Light: {
                formal: ['Lavender Suit', 'Teal Blouse with Skirt', 'Coral Dress'],
                casual: ['Casual Top with Shorts', 'Cardigan with Jeans', 'Printed Dress'],
                images: ['formal_female_light_1.jpg', 'casual_female_light_1.jpg']
            },
            Medium: {
                formal: ['Fuchsia Blouse with Pants', 'Turquoise Dress', 'Peach Formal Suit'],
                casual: ['Vibrant T-shirt', 'Summer Dress', 'Sweatshirt with Joggers'],
                images: ['formal_female_medium_1.jpg', 'casual_female_medium_1.jpg']
            },
            Dark: {
                formal: ['Hot Pink Dress', 'Bright Yellow Suit', 'White Gown'],
                casual: ['Maxi Dress', 'Sweater with Jeans', 'Jacket with T-shirt'],
                images: ['formal_female_dark_1.jpg', 'casual_female_dark_1.jpg']
            }
        }
    };

    const suggestion = outfits[gender][skinTone];

    // Display text-based outfit suggestions
    skinToneResult.textContent = `Detected Skin Tone: ${skinTone}`;
    outfitSuggestion.textContent = `Formal: ${suggestion.formal.join(', ')} | Casual: ${suggestion.casual.join(', ')}`;

    // Display outfit images
    const outfitImagesContainer = document.createElement('div');
    outfitImagesContainer.innerHTML = ''; // Clear previous content
    outfitImagesContainer.style.display = 'flex';
    outfitImagesContainer.style.justifyContent = 'space-around';
    
    suggestion.images.forEach((imageSrc, index) => {
        const img = document.createElement('img');
        img.src = `path/to/images/${imageSrc}`; // Update to your actual image path
        img.alt = `Outfit ${index + 1}`;
        img.style.width = '150px';
        img.style.height = 'auto';
        img.style.border = '2px solid #ccc';
        img.style.borderRadius = '8px';
        img.style.margin = '10px';
        outfitImagesContainer.appendChild(img);
    });

    document.querySelector('.result-section').appendChild(outfitImagesContainer);
}
