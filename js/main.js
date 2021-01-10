const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);
    } catch(err) {
        const errorAlert = showAlertKeyword(err);
        const searchAlert = document.querySelector('.search-alert');
        searchAlert.innerHTML = errorAlert;
    }
});

function getMovies(keyword) {
    return fetch('http://www.omdbapi.com/?apikey=6bf2fdad&s=' + keyword)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(response => {
        if (response.Response === "False") {
            if (keyword === '') {
                throw new Error("Input keyword first!")
            } 
            else {
                throw new Error("Movie not found!")
            }
        }
        return response.Search;
    });
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => cards += showCards(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

// Event Binding
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('modal-detail-button')) {
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }
});

function getMovieDetail(imdbid) {
    return fetch('http://www.omdbapi.com/?apikey=6bf2fdad&i=' + imdbid)
                .then(response => response.json())
                .then(m => m);
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}

function showCards(m) {
    return ` <div class="col-md-3 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top card-image">
                    <div class="card-body card-content">
                        <h6 class="card-title"><strong>${m.Title}</strong></h6>
                        <h7 class="card-subtitle mb-2 text-muted">${m.Year}</h7><br><br>
                        <a href="" class="btn btn-primary btn-sm modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Details</a>
                    </div>
                </div>
            </div>`
}

function showMovieDetail(m) {
    function timeConvert(n) {
        var num = parseInt(n);
        var hours = Math.floor(num / 60);  
        var minutes = num % 60;
        return hours + "h" + " " + minutes + "min"; 
        }
    return ` <div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${m.Poster}" class="img-fluid">
                    </div>
                    <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item"><h5>${m.Title} (${m.Year})</h5>${m.Rated} | ${timeConvert(m.Runtime)} | ${m.Released}</li>
                        <li class="list-group-item">${m.Plot}</li>
                        <li class="list-group-item"><strong>Genre :</strong> ${m.Genre}</li>
                        <li class="list-group-item"><strong>Actors :</strong> ${m.Actors}</li>
                        <li class="list-group-item"><strong>Director :</strong> ${m.Director}</li>
                        </ul>
                    </div>
                </div>
            </div>`
}

function showAlertKeyword(err) {
    return `<div class="alert alert-warning" role="alert">
            ${err}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
            </div>`
}