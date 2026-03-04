const movies = [
  {
    title: "American Sniper",
    year: 2014,
    director: "Clint Eastwood",
    mainActor: "Bradley Cooper",
    genre: ["War", "Action", "Drama"],
    imdbRating: 7.3,
  },
  {
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    mainActor: "Christian Bale",
    genre: ["Action", "Crime", "Drama"],
    imdbRating: 9.1,
  },
  {
    title: "Retfærdighedens Ryttere",
    year: 2020,
    director: "Anders Thomas Jensen",
    mainActor: "Mads Mikkelsen",
    genre: ["Action", "Comedy", "Drama"],
    imdbRating: 7.5,
  },
];

const container = document.querySelector("#movieContainer");

let markup = "";

movies.forEach((movie) => {
  markup += `
    <article>
      <h2>${movie.title}</h2>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Director:</strong> ${movie.director}</p>
      <p><strong>Main Actor:</strong> ${movie.mainActor}</p>
      <p><strong>Genre:</strong> ${movie.genre.join(", ")}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
    </article>
    <hr>
  `;
});

container.innerHTML = markup;
