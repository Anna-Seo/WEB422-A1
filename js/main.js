/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Anna Seo         Student ID: 110186202        Date: January 24, 2023
*
********************************************************************************/

let page = 1;
let perPage = 10;

function loadMovieData(title = null) {
    if (title == "" || title == null) { //if title is empty
        fetch(`http://localhost:8080/api/movies?page=${page}&perPage=${perPage}`)
            .then(res => res.json())
            .then(data => {
                let transform;
                data = data.movies;
                transform = `${data.map(elem => `<tr data-id=${elem._id}>
            <td>${elem.year}</td>
            <td>${elem.title}</td>
            <td>${elem.plot == null ? "N/A" : elem.plot}</td>
            <td>${elem.rated == null ? "N/A" : elem.rated}</td>
            <td>${Math.floor(elem.runtime / 60)}:${(elem.runtime % 60).toString().padStart(2, '0')}
            </td></tr>`).join('')}`;
                document.querySelector('.pagination').classList.remove('d-none');
                document.querySelector("#moviesTable tbody").innerHTML = transform;
                document.querySelector("#current-page").innerHTML = page.toString();
                document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                    row.addEventListener('click', (e) => {
                        let clickedId = row.getAttribute('data-id');
                        fetch(`http://localhost:8080/api/movies/${clickedId}`)
                            .then(res => res.json())
                            .then(data => {
                                document.querySelector("#detailsModal .modal-title").innerHTML = data.title;
                                let modalHtml = `<img class="img-fluid w-100" 
                            src="${data.poster}"><br><br><strong>
                            Directed By: </strong>${data.directors.join(', ')}<br><br>
                            <p>${data.fullplot}</p><strong>
                            Cast: </strong>${data.cast.join(', ') || "N/A"}<br><br><strong>
                            Awards: </strong>${data.awards.text || "N/A"}<br><strong>
                            IMDB Rating: </strong>${data.imdb.rating} (${data.imdb.votes} votes)`;
                                document.querySelector("#detailsModal .modal-body").innerHTML = modalHtml;
                                let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                                    backdrop: "static",
                                    keyboard: false
                                });
                                modal.show();
                            });
                    });
                });
            })
    }
    else {
        //if title is not null
        fetch(`http://localhost:8080/api/movies?page=${page}&perPage=${perPage}&title=${title}`)
            .then(res => res.json())
            .then(data => {
                let transform;
                data = data.movies;
                transform = `${data.map(elem => `<tr data-id=${elem._id}>
            <td>${elem.year}</td>
            <td>${elem.title}</td>
            <td>${elem.plot == null ? "N/A" : elem.plot}</td>
            <td>${elem.rated == null ? "N/A" : elem.rated}</td>
            <td>${Math.floor(elem.runtime / 60)}:${(elem.runtime % 60).toString().padStart(2, '0')}
            </td></tr>`).join('')}`;
                document.querySelector('.pagination').classList.add('d-none');
                document.querySelector("#moviesTable tbody").innerHTML = transform;
                document.querySelector("#current-page").innerHTML = page.toString();
                document.querySelector('#moviesTable tbody tr').addEventListener('click', (e) => {
                    let clickedId = document.querySelector('#moviesTable tbody tr').getAttribute('data-id');
                    fetch(`http://localhost:8080/api/movies/${clickedId}`)
                        .then(res => res.json())
                        .then(data => {
                            document.querySelector("#detailsModal .modal-title").innerHTML = data.title;
                            let modalHtml = `<img class="img-fluid w-100" 
                            src="${data.poster}"><br><br><strong>
                            Directed By: </strong>${data.directors.join(', ')}<br><br>
                            <p>${data.fullplot}</p><strong>
                            Cast: </strong>${data.cast.join(', ') || "N/A"}<br><br><strong>
                            Awards: </strong>${data.awards.text || "N/A"}<br><strong>
                            IMDB Rating: </strong>${data.imdb.rating} (${data.imdb.votes} votes)`;
                            document.querySelector("#detailsModal .modal-body").innerHTML = modalHtml;
                            let modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                                backdrop: "static",
                                keyboard: false
                            });
                            modal.show();
                        });
                });
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector("#previous-page").addEventListener('click', event => {
        if (page > 1) {
            page -= 1;
        }
        loadMovieData();
    });

    document.querySelector("#next-page").addEventListener('click', event => {
        page += 1;
        loadMovieData();
    });

    document.querySelector("#searchForm").addEventListener('submit', event => {
        event.preventDefault();
        loadMovieData(document.querySelector("#title").value);
    });

    document.querySelector("#clearForm").addEventListener('click', event => {
        document.querySelector("#title").value = "";
        loadMovieData();
    });
});