const imagelistWrapper = document.querySelector(".imagelist-wrapper");
const searchButton = document.querySelector("#searchButton");
const clearButton = document.querySelector("#clearButton");
const searchInput = document.querySelector("#searchInput");

searchButton.addEventListener("click", searchPhotos);
document.addEventListener("DOMContentLoaded", checkAccesKey);

function checkAccesKey() {
    if (localStorage.getItem("accesKey") === null) {
        const accesKey = prompt("Please enter the Access Key.");
        if (accesKey !== null && accesKey !== "") {
            localStorage.setItem("accesKey", accesKey);
            getPhotos("").then(result => {
                if (result === false) {
                    alert("Invalid Access Key. Please try again!")
                    localStorage.removeItem("accesKey");
                    checkAccesKey();
                };
            })
        } else {
            checkAccesKey();
        }
    }
}

function searchPhotos(e) {
    e.preventDefault();
    imagelistWrapper.innerHTML = "";
    addPhotosToUI(getPhotos(searchInput.value));
}

function addPhotosToUI(data) {
    data.then(photos => {
        console.log(photos)
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
    if (response.status !== 400 && response.status !== 200) {
        return false;
    }

    const data = await response.json();
    return data.results;
}
