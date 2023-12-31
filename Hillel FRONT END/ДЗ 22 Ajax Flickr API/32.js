// С помощью Ajax запроса на Flickr API выводить на страницу по 50 фото за раз. 

// В ряду должно быть по 5 фото, для упрощения - всем фото задать один размер, ширина блока, в котором все должно помещаться: 1024x768 px. 

// По умолчанию фокус должен быть на первой фотографии в ряду (достаточно просто рамки). При нажатии вправо, фокус должен переходить на следующее фото. 
// При нажатии вниз - скролл к следующему ряду, и фокус должен переходить на место того же фото, которое было выделено в прошлом ряду.

// Перемещаться между блоками можно только кнопками влево/вправо/вверх/вниз и скролом. Скроллом должен проматываться только один ряд, независимо от скорости прокрутки. 

// Скроллинг рядов должен плавно анимироваться. 

// Если дойти до предпоследнего ряда, должны подгружаться еще 40 фотографий, и добавляться в нижние ряды.

// Приложение должно быть написано на JS без использования фреймворков


const API_KEY = "b9b865a7a966d097e5e8073a81b39a83";
const USER_ID = "155573498%40N02";
const PER_PAGE = 50;
const COLS = 5;
const arr = [];
let currentPage = 1;
let firstLoad = true;

getPhotos();
document.onkeydown = keyHandler;

async function getPhotos(page = 1) {
  const request = await fetch(
    `https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=${API_KEY}
    &user_id=${USER_ID}&format=json&nojsoncallback=1&per_page=${
      firstLoad ? PER_PAGE : 40
    }&extras=url_q&page=${page}`
  );
  const {
    photos: { photo: photos },
  } = await request.json();

  renderPhoto(photos);
}

function renderPhoto(photos) {
  photos.forEach((photo, i) => {
    const img_wrapper = document.createElement("div");
    img_wrapper.classList.add("img-wrap");
    console.log(img_wrapper);

    const img = document.createElement("img");
    img.src = photo.url_q;
    img.alt = photo.title;

    img_wrapper.appendChild(img);

    const lastIndex =
      arr.length > 0
        ? Number(arr[arr.length - 1].getAttribute("tabindex"))
        : -1;
    img_wrapper.setAttribute("tabindex", lastIndex + 1);

    document.querySelector(".container").appendChild(img_wrapper);

    arr.push(img_wrapper);
  });

  if (firstLoad) {
    arr[0].focus();
    firstLoad = false;
  }
}

function keyHandler(e) {
  const curIndex = Number(document.activeElement.tabIndex);
  console.log(curIndex);

  switch (e.code) {
    case "ArrowLeft":
      arr[Math.max(curIndex - 1, 0)].focus();
      break;
    case "ArrowRight":
      console.log(e.code);
      arr[curIndex + 1].focus();
      break;
    case "ArrowDown":
      console.log(arr.length);
      arr[Math.min(curIndex + COLS, arr.length - 1)].focus();
      break;
    case "ArrowUp":
      arr[curIndex - COLS].focus();
      break;
  }

  if (shouldLoad(curIndex)) {
    ++currentPage;
    getPhotos(currentPage);
  }
}

function shouldLoad(curIndex) {
  return curIndex > 40;
}
