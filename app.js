const imagelistWrapper = document.querySelector(".imagelist-wrapper");
const searchButton = document.querySelector("#searchButton");
const clearButton = document.querySelector("#clearButton");
const searchInput = document.querySelector("#searchInput");

searchButton.addEventListener("click", searchPhotos);
document.addEventListener("DOMContentLoaded", checkAccesKey);

function checkAccesKey() {
    const accesKey = localStorage.getItem("accesKey");

    if (accesKey === null) {
        // Eğer API anahtarı yoksa, kullanıcıdan al
        const enteredKey = prompt("Please enter the correct Access Key.");
        if (enteredKey && enteredKey !== "") {
            // Anahtar geçerli mi kontrol et
            testAccessKey(enteredKey).then(isValid => {
                if (isValid) {
                    localStorage.setItem("accesKey", enteredKey);
                    getPhotos("a");  // Anahtar doğrulandı, başlangıçta fotoğraf araması yapılabilir
                } else {
                    alert("Invalid API Key! Please try again.");
                    checkAccesKey();  // Geçersiz anahtar, tekrar iste
                }
            });
        } else {
            checkAccesKey();  // Geçersiz veya boş giriş, tekrar iste
        }
    }
}

function testAccessKey(key) {
    const url = `https://api.unsplash.com/photos?page=1&client_id=${key}`;
    return fetch(url)
        .then(response => response.status === 200)  // 200 status kodu geçerli anahtar demek
        .catch(() => false);  // Hata durumunda geçersiz kabul et
}

function searchPhotos(e) {
    e.preventDefault();
    imagelistWrapper.innerHTML = "";
    addPhotosToUI(getPhotos(searchInput.value));
}

function addPhotosToUI(data) {
    data.then(photos => {
        photos.forEach(photo => {
            let div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `<img src="${photo.urls.small_s3}">`;
            imagelistWrapper.appendChild(div);
        });
    });
}

async function getPhotos(keyword) {
    const accesKey = localStorage.getItem("accesKey");
    const url = `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${accesKey}`;
    const response = await fetch(url);
    if (response.status === 401) {
        localStorage.removeItem("accesKey");
        checkAccesKey();  // Anahtar geçersizse tekrar kontrol et
    }
    const data = await response.json();

    return data.results;
}
