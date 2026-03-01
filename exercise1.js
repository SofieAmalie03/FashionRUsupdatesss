const movie = {
  title: "American Sniper",
  year: 2014,
  director: "Clint Eastwood",
  mainActor: "Bradley Cooper",
  genre: ["War", "Action", "Drama"],
  durationMinutes: 133,
  imdbRating: 7.3,
  basedOnTrueStory: true,
};
const container = document.querySelector("#movieContainer");

container.innerHTML = `
  <h2>${movie.title}</h2>
  <p><strong>Year:</strong> ${movie.year}</p>
  <p><strong>Director:</strong> ${movie.director}</p>
  <p><strong>Main Actor:</strong> ${movie.mainActor}</p>
  <p><strong>Genre:</strong> ${movie.genre.join(", ")}</p>
  <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
`;
