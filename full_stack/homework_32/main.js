const BASE_URL = "http://www.omdbapi.com/?apikey=21eac196&";
const DEBOUNCE_DELAY = 400;
const MIN_QUERY_LENGTH = 2;
const PAGE_SIZE = 10;

const searchInput = document.getElementById("search-input");
const clearButton = document.getElementById("search-clear");
const typeFilter = document.getElementById("type-filter");
const statusEl = document.getElementById("search-status");
const resultsEl = document.getElementById("results");
const loadMoreBtn = document.getElementById("load-more");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

const state = {
  query: "",
  type: "",
  page: 1,
  totalResults: 0,
  controller: null,
};

function debounce(fn, delay) {
  let timerId;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function setStatus(message, { isError = false } = {}) {
  statusEl.textContent = message;
  statusEl.classList.toggle("search__status--error", isError);
}

function renderEmpty(message) {
  resultsEl.innerHTML = "";
  const empty = document.createElement("p");
  empty.className = "results__empty";
  empty.innerText = message;
  resultsEl.appendChild(empty);
  loadMoreBtn.hidden = true;
}

function buildSearchUrl({ query, type, page }) {
  const params = new URLSearchParams({ s: query, page: String(page) });
  if (type) params.set("type", type);
  return `${BASE_URL}${params.toString()}`;
}

function buildDetailsUrl(imdbID) {
  const params = new URLSearchParams({ i: imdbID, plot: "full" });
  return `${BASE_URL}${params.toString()}`;
}

function updateLoadMoreVisibility() {
  const loaded = (state.page) * PAGE_SIZE;
  loadMoreBtn.hidden = loaded >= state.totalResults;
}

async function runSearch({ append = false } = {}) {
  if (state.controller) {
    state.controller.abort();
  }
  state.controller = new AbortController();

  setStatus(append ? "Loading more..." : "Searching...");
  if (!append) {
    state.page = 1;
    state.totalResults = 0;
  }

  try {
    const response = await fetch(
      buildSearchUrl({ query: state.query, type: state.type, page: state.page }),
      { signal: state.controller.signal }
    );

    if (!response.ok) {
      throw new Error(response.status);
    }

    const data = await response.json();

    if (data.Response === "False") {
      if (!append) {
        renderEmpty(data.Error || "Nothing found.");
        setStatus(`No results for "${state.query}".`);
      } else {
        loadMoreBtn.hidden = true;
        setStatus("No more results.");
      }
      return;
    }

    state.totalResults = Number(data.totalResults) || 0;
    renderResults(data.Search, { append });
    updateLoadMoreVisibility();

    const shownCount = state.page * PAGE_SIZE;
    setStatus(
      `Showing ${Math.min(shownCount, state.totalResults)} of ${state.totalResults} for "${state.query}".`
    );
  } catch (err) {
    if (err.name === "AbortError") {
      return;
    }
    console.error(err.message);
    if (!append) {
      renderEmpty("Something went wrong. Please try again.");
    }
    setStatus(err.message, { isError: true });
  }
}

function renderResults(results, { append = false } = {}) {
  if (!append) {
    resultsEl.innerHTML = "";
  }

  results.forEach((movie) => {
    const singleMovieWrap = document.createElement("article");
    singleMovieWrap.className = "movie";

    const poster = document.createElement("img");
    poster.setAttribute(
      "src",
      movie.Poster && movie.Poster !== "N/A" ? movie.Poster : ""
    );
    poster.setAttribute("alt", `${movie.Title} poster`);
    poster.setAttribute("loading", "lazy");
    poster.className = "movie__poster";

    const body = document.createElement("div");
    body.className = "movie__body";

    const titleElem = document.createElement("h2");
    titleElem.innerText = movie.Title;
    titleElem.className = "movie__title";

    const info = document.createElement("div");
    info.className = "movie__meta";

    const year = document.createElement("span");
    year.className = "movie__year";
    year.innerText = `Year: ${movie.Year}`;

    const type = document.createElement("span");
    type.className = "movie__type";
    type.innerText = movie.Type;

    info.appendChild(year);
    info.appendChild(type);

    const btn = document.createElement("button");
    btn.innerText = "Read more";
    btn.className = "movie__btn";
    btn.addEventListener("click", () => openDetails(movie.imdbID));

    body.appendChild(titleElem);
    body.appendChild(info);
    body.appendChild(btn);

    singleMovieWrap.appendChild(poster);
    singleMovieWrap.appendChild(body);

    resultsEl.appendChild(singleMovieWrap);
  });
}

async function openDetails(imdbID) {
  modalBody.innerHTML = '<p class="modal__loading">Loading...</p>';
  openModal();

  try {
    const response = await fetch(buildDetailsUrl(imdbID));
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to load details.");
    }
    renderDetails(data);
  } catch (err) {
    console.error(err.message);
    modalBody.innerHTML = "";
    const error = document.createElement("p");
    error.className = "modal__error";
    error.innerText = `Could not load details: ${err.message}`;
    modalBody.appendChild(error);
  }
}

function renderDetails(movie) {
  modalBody.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "details";

  if (movie.Poster && movie.Poster !== "N/A") {
    const poster = document.createElement("img");
    poster.src = movie.Poster;
    poster.alt = `${movie.Title} poster`;
    poster.className = "details__poster";
    wrap.appendChild(poster);
  }

  const info = document.createElement("div");
  info.className = "details__info";

  const title = document.createElement("h2");
  title.id = "modal-title";
  title.className = "details__title";
  title.innerText = `${movie.Title} (${movie.Year})`;

  const tags = document.createElement("div");
  tags.className = "details__tags";
  [movie.Rated, movie.Runtime, movie.Genre, movie.Language]
    .filter((value) => value && value !== "N/A")
    .forEach((value) => {
      const tag = document.createElement("span");
      tag.className = "details__tag";
      tag.innerText = value;
      tags.appendChild(tag);
    });

  const plot = document.createElement("p");
  plot.className = "details__plot";
  plot.innerText = movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No plot available.";

  const facts = document.createElement("dl");
  facts.className = "details__facts";
  [
    ["Director", movie.Director],
    ["Writer", movie.Writer],
    ["Actors", movie.Actors],
    ["Released", movie.Released],
    ["Country", movie.Country],
    ["Awards", movie.Awards],
    ["IMDb rating", movie.imdbRating],
  ].forEach(([label, value]) => {
    if (!value || value === "N/A") return;
    const dt = document.createElement("dt");
    dt.innerText = label;
    const dd = document.createElement("dd");
    dd.innerText = value;
    facts.appendChild(dt);
    facts.appendChild(dd);
  });

  info.appendChild(title);
  info.appendChild(tags);
  info.appendChild(plot);
  info.appendChild(facts);

  wrap.appendChild(info);
  modalBody.appendChild(wrap);
}

function openModal() {
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

function triggerSearch() {
  const query = searchInput.value.trim();
  clearButton.hidden = query.length === 0;
  state.query = query;
  state.type = typeFilter.value;

  if (query.length === 0) {
    setStatus("");
    renderEmpty("Start typing to search movies.");
    return;
  }

  if (query.length < MIN_QUERY_LENGTH) {
    setStatus(`Type at least ${MIN_QUERY_LENGTH} characters...`);
    renderEmpty("Keep typing...");
    return;
  }

  runSearch({ append: false });
}

const handleInput = debounce(triggerSearch, DEBOUNCE_DELAY);

searchInput.addEventListener("input", handleInput);
typeFilter.addEventListener("change", triggerSearch);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  clearButton.hidden = true;
  setStatus("");
  renderEmpty("Start typing to search movies.");
  searchInput.focus();
});

loadMoreBtn.addEventListener("click", () => {
  state.page += 1;
  runSearch({ append: true });
});

document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

renderEmpty("Start typing to search movies.");
