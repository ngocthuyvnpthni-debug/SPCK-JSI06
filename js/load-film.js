const STORAGE_KEY = 'netflix_all_movies';
const USER_KEY = 'currentUserEmail'; 

async function loadMovies() {
    try {
        let movies = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!movies) {
            console.log("Đang tải dữ liệu từ server...");
            const response = await fetch('./data-film.json'); 
            if (!response.ok) throw new Error("Không thể tải file JSON");
            
            movies = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
        }

        renderAllCategories(movies);
        setupSearch(); 
    } catch (error) {
        console.error("Lỗi:", error);
    }
}


function renderAllCategories(movies) {
    const rows = document.querySelectorAll('.movie-row');
    const tvRow = document.getElementById('tv-row');
    
    
    rows.forEach(row => {
        if(row.parentElement.id !== 'mylist') row.innerHTML = '';
    });

    movies.forEach(movie => {
        const card = createMovieCard(movie);
        
      
        if (movie.category === "Kinh Dị") rows[1].innerHTML += card;
        else if (movie.category === "Hành Động") rows[2].innerHTML += card;
        else if (movie.category === "Hoạt Hình") rows[3].innerHTML += card;
        else rows[0].innerHTML += card; 

        if (movie.type === "tv" && tvRow) {
            tvRow.innerHTML += card;
        }
    });

    renderMyList(); 
    attachEventHandlers(); 
}

function createMovieCard(movie) {
    const currentUser = localStorage.getItem(USER_KEY);
    const favorites = getFavorites(currentUser);
    const isFav = favorites.includes(movie.id.toString());

    return `
        <div class="movie-card" data-id="${movie.id}">
            <img src="${movie.imageUrl}" alt="${movie.title}">
            <div class="overlay">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
                <div class="card-buttons">
                    <button class="play-btn" data-video="${movie.videoUrl}">Xem</button>
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${movie.id}')">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        </div>
    `;
}


function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const homeTab = document.getElementById('home');
    const rows = homeTab.querySelectorAll('.movie-row');
    const titles = homeTab.querySelectorAll('.section-title');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const allMovies = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

     
        document.querySelector('[data-tab="home"]').click(); 

        if (keyword === '') {
           
            titles[0].innerText = "Phim";
            for(let i = 0; i < rows.length; i++) {
                rows[i].style.display = 'flex';
                if(titles[i]) titles[i].style.display = 'block';
            }
            renderAllCategories(allMovies);
            return;
        }

      
        const filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(keyword));

       
        titles[0].innerText = `Kết quả tìm kiếm cho: "${keyword}"`;
        
       
        for(let i = 1; i < rows.length; i++) {
            rows[i].style.display = 'none';
            if(titles[i]) titles[i].style.display = 'none';
        }

     
        rows[0].style.display = 'flex';
        if (filteredMovies.length === 0) {
            rows[0].innerHTML = '<p style="padding:20px;">Không tìm thấy phim phù hợp.</p>';
        } else {
            rows[0].innerHTML = filteredMovies.map(m => createMovieCard(m)).join('');
        }
        
        attachEventHandlers();
    });
}


function getFavorites(userEmail) {
    if (!userEmail) return [];
    const allFavs = JSON.parse(localStorage.getItem('netflix_favorites')) || {};
    return allFavs[userEmail] || [];
}

function toggleFavorite(movieId) {
    const currentUser = localStorage.getItem(USER_KEY);
    if (!currentUser) {
        alert("Vui lòng đăng nhập để lưu phim!");
        return;
    }

    let allFavs = JSON.parse(localStorage.getItem('netflix_favorites')) || {};
    let userFavs = allFavs[currentUser] || [];

    if (userFavs.includes(movieId)) {
        userFavs = userFavs.filter(id => id !== movieId);
    } else {
        userFavs.push(movieId);
    }

    allFavs[currentUser] = userFavs;
    localStorage.setItem('netflix_favorites', JSON.stringify(allFavs));
   
    const movies = JSON.parse(localStorage.getItem(STORAGE_KEY));
    renderAllCategories(movies);
}

function renderMyList() {
    const currentUser = localStorage.getItem(USER_KEY);
    const myListContainer = document.querySelector('#mylist .movie-row');
    if (!myListContainer) return;

    const allMovies = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const userFavIds = getFavorites(currentUser);
    
    const myMovies = allMovies.filter(m => userFavIds.includes(m.id.toString()));

    if (myMovies.length === 0) {
        myListContainer.innerHTML = '<p style="padding:20px;">Bạn chưa lưu phim nào.</p>';
    } else {
        myListContainer.innerHTML = myMovies.map(m => createMovieCard(m)).join('');
    }
}

function attachEventHandlers() {
    document.querySelectorAll(".play-btn").forEach(btn => {
        btn.onclick = () => {
            const videoSrc = btn.dataset.video;
            const player = document.getElementById("videoPlayer");
            const video = document.getElementById("video");
            video.src = videoSrc;
            player.classList.add("active");
            video.play();
        };
    });
}

document.addEventListener('DOMContentLoaded', loadMovies);