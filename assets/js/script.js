// Global variables
let cachedResults = [];
let currentPage = 1;
let currentQueryUrl = "";
let limit = 25;

// Intersection Observer to trigger pan effect when fully in view (GPT and Copilot assisted)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target.classList.contains("wide")) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          entry.target.classList.remove("paused");
        } else {
          entry.target.classList.add("paused");
        }
      }
    });
  },
  { threshold: 1 }
);

// DISAPPPEARING HEADER
// Code sourced from https://www.youtube.com/watch?v=JEBgqbZWYIQ&ab_channel=OnlineTutorials -> modified selector for different tag, comments added for my own clarity
var lastScrollTop = 0;
navbar = document.querySelector("header");
window.addEventListener("scroll", function () {
  var scrollTop = window.scrollY || this.document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    navbar.style.top = "-100%"; // move header from view
  }
  // user is scrolling up, show header
  else {
    navbar.style.top = "0"; // translate header
  }
  // update scroll position
  lastScrollTop = scrollTop;
});

//Overlay initially guard
let overlayInitialized = false;

// Function to fetch data from NFSA API
function getData(url, callback, append = false) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      const totalResults = data.meta?.count?.total || 0;

      if (callback) {
        callback(data);
      } else {
        displayResults(data.results, append, totalResults);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      const outputDiv = document.getElementById("objectsContainer");
      outputDiv.innerHTML =
        "<p>Error fetching data. Please try again later.</p>";
    });
}

// Function to display API results

function displayResults(results, append = false, totalResults = 0) {
  const objectsContainer = document.getElementById("objectsContainer"); // Ensure this exists in HTML

  // Handle cache + clear
  if (!append) {
    cachedResults = results; // Save current list so we can return to it
    objectsContainer.innerHTML = ""; // Clear if not appending
  } else {
    cachedResults = cachedResults.concat(results); // Append new results to cache
  }

  // Update Showing 1 - x of x results" text
  const resultsInfo = document.getElementById("resultcount");
  if (resultsInfo) {
    const startIndex = (currentPage - 1) * limit + 1;
    const endIndex = startIndex + results.length - 1;
    resultsInfo.textContent = `Showing ${startIndex} – ${endIndex} of ${totalResults} results`;
  }

  results.forEach((item) => {
    console.log("Item:", item); // Step to log each item

    // Extract the preview array
    const imgArr = item.preview || []; // Default to empty array

    // Initialize empty image URL
    let thumbnailurl = "";

    // Loop through the preview array to find an image
    const baseurl = "https://media.nfsacollection.net/";
    for (let i = 0; i < imgArr.length; i++) {
      console.log("Preview object:", imgArr[i]); // Log preview object
      if (imgArr[i].hasOwnProperty("thumbnailFilePath")) {
        thumbnailurl = baseurl + imgArr[i].thumbnailFilePath;
        break; // Use the first valid image
      }
    }

    // 1. Create a container for the item
    const itemContainer = document.createElement("div");

    // 2. Use template literals to embed the item details in HTML
    itemContainer.innerHTML = `
          ${
            thumbnailurl
              ? `<div class="column-item" data-id="${item.id}">
            <img src="${thumbnailurl}" alt="${item.title}">
            <div class="image-overlay">
              <span class="image-title">${item.title}</span>
            
            </div>
         </div>` // THIS IS HOW YOUD DO THE SEARCH AAAAAA
              : ""
          }
      `;

    // 3. Append the item container to the objects container
    objectsContainer.appendChild(itemContainer);
  });

  // Make the image containers clickable
  document.querySelectorAll(".column-item").forEach((container) => {
    container.addEventListener("click", function () {
      const itemId = this.getAttribute("data-id");
      loadItemDetails(itemId);
    });
  });

  // After images load, detect their aspect ratios, add classlist for crop + pan (code sourced from chatGPT + troubleshooted using Copilot)
  const imgs = objectsContainer.querySelectorAll("img");

  imgs.forEach((img) => {
    img.addEventListener("load", () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > 20) {
        img.classList.add("wide");
        observer.observe(img); // Observe only wide images
      }
    });
  });
}

// Function to show a single item when clicked -> modified to show overlay using chatGPT
const overlay = document.getElementById("itemOverlay");

function loadItemDetails(id) {
  const overlayInner = document.getElementById("overlayInner");

  // Find the thumbnail and title from the cachedResults
  const record = cachedResults.find((item) => item.id == id);
  if (!record) return;

  const title = record.title || "Untitled";
  const name = record.name || "";
  const summary = record.summary || "No summary available.";
  const displayID = record.id || "";
  const medium = record.subMedium || "Unknown medium";
  const pd = record.productionDates[0] || {};
  const format = record.forms || "Not available";
  const genre = record.parentTitle?.genres || [];
  const country = record.countries || [];
  const language = record.languages || [];
  const credits = record.credits || [];

  // courtesy of copilot
  const productionDate =
    pd.fromYear || pd.toYear
      ? `${pd.fromYear || ""}${pd.fromYear && pd.toYear ? " - " : ""}${
          pd.toYear || ""
        }`
      : "Unknown date";

  const baseurl = "https://media.nfsacollection.net/";
  const preview = Array.isArray(record.preview) ? record.preview : [];

  let imgurl = "";
  if (preview.length > 0 && preview[0].thumbnailFilePath) {
    imgurl = baseurl + preview[0].thumbnailFilePath;
  }

  // Show loading state
  overlayInner.innerHTML = "<p>Loading item details...</p>";
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("visible"));

  // Fill overlay with content
  overlayInner.innerHTML = `
  <div class="cella">
  ${
    imgurl
      ? `<img src="${imgurl}" alt="${title}">`
      : "<p>No image available</p>"
  }
  <a href="https://www.collection.nfsa.gov.au/title/${displayID}">Original Page</a>
  </div>  
  <div class="cellb">
  <h2>${title}</h2>
    <h3>${name}</h3>
    <p>${summary}</p>
    </div>

  <div class="cellc">
    <p>Credits:</p>
    <ul>
      ${
        credits.length
          ? credits
              .map(
                (credit) =>
                  `<li><span>${credit.name}</span> — <span>${credit.role}</span></li>`
              )
              .join("")
          : "<li>None</li>"
      }
    </ul>
  </div>

  <div class="celld">
  <p><span>NSFA ID:</span><span><u>${displayID}</u></span</p>
  <p><span>Medium:</span><span><u>${medium}</u></span></p>
  <p><span>Production Date:</span><span><u>${productionDate}</u></span></p>
  <p><span>Format:</span><span><u>${format}</u></span></p>
  <p><span>Genre:</span><span><u>${genre}</u></span></p> 
  <p><span>Country:</span><span><u>${country}</u></span></p>
  <p><span>Language:</span><span><u>${language}</u></span></p>
  </div>

  <div class="celle">
  <p>If you find any errors in this information please let us know at <u>corrections@nfsa.gov.au</u></p>
  </div>
  `;
  // ^ id like the genre to spit out all the genres in the array, not sure how

  const closeOverlay = () => {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  };

  // Close button
  document
    .getElementById("closeOverlay")
    .addEventListener("click", closeOverlay);

  // Close when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  // Close with Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeOverlay();
      document.removeEventListener("keydown", handleKeyDown);
    }
  };
  document.addEventListener("keydown", handleKeyDown, { once: true });
}

// Carousel stuff
const track = overlay.querySelector(".carousel-track");
const leftArrow = overlay.querySelector(".arrow.left");
const rightArrow = overlay.querySelector(".arrow.right");

// Simulate algorithm call returning an array of random images
// async function fetchRandomItems(count = 5){
//   const allItems = await fetch()
// }

// About overlay functionality

const abt = document.getElementById("aboutBox");
const abtTarget = document.getElementById("abtlink");
const abtClose = document.getElementById("closeabt");
const main = document.querySelector("main");

function openAbt() {
  abt.classList.remove("hide");
  abt.classList.add("show");
  main.classList.add("bg");
  document.addEventListener("keydown", handleKeyDown);
}

function closeAbt() {
  abt.classList.remove("show");
  abt.classList.add("hide");
  main.classList.remove("bg");
  document.removeEventListener("keydown", handleKeyDown);
}

// open
abtTarget.addEventListener("click", openAbt);

// Close
abtClose.addEventListener("click", closeAbt);

function handleKeyDown(e) {
  if (e.key === "Escape") closeAbt();
}

// Adds functionality to the "More button to load more results"

document.getElementById("moreBtn").addEventListener("click", () => {
  currentPage += 1;
  const nextUrl = `${currentQueryUrl}&page=${currentPage}&limit=${limit}`;
  getData(nextUrl, null, true); // append = true
});

// Search button stuff -> Referenced from GPT + https://stackoverflow.com/questions/65152295/input-a-search-from-the-browser-to-an-api-get-request

const searchInput = document.getElementById("searchInput");
const searchIcon = document.getElementById("search-icon");
const form = document.querySelector("form");

const searchBaseURL =
  "https://api.collection.nfsa.gov.au/search?&hasMedia=yes&forms=Art%20work";

// Function to search
function performSearch(query) {
  // reset pagination
  currentPage = 1;

  // Construct the search URL
  currentQueryUrl = `${searchBaseURL}&query=${encodeURIComponent(query)}`;

  // Fetch and display results
  getData(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);
}

// Trigger search on icon click
searchIcon.addEventListener("click", function (e) {
  e.preventDefault();

  const query = searchInput.value.trim(); // get input value without extra spaces
  // If already active and input has value, perform search
  const isActive = searchContainer.classList.contains("active");

  // if (query !== "") {
  //   console.log(query); // document query
  //   performSearch(query);
  // }
  if (isActive && query) {
    performSearch(query);
  } else {
    // Toggle visibility
    searchContainer.classList.toggle("active");
    navbar.classList.toggle("search-open");

    // Focus the input when opening
    if (searchContainer.classList.contains("active")) {
      searchInput.focus();
    }
  }
});

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query !== "") {
    console.log(query); // document query
    performSearch(query);
  }
});

// Mobile search toggle
const searchContainer = document.querySelector(".search");

// Close search if user taps outside
document.addEventListener("click", (e) => {
  if (
    !searchContainer.contains(e.target) &&
    searchContainer.classList.contains("active")
  ) {
    searchContainer.classList.remove("active");
  }
});

currentPage = 1;
limit = 25;
currentQueryUrl =
  "https://api.collection.nfsa.gov.au/search?&hasMedia=yes&forms=Art%20work";

getData(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);
