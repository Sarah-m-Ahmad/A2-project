// Global variables
let cachedResults = [];
let currentPage = 1;
let currentQueryUrl = "";
let limit = 25;

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
      if (callback) {
        callback(data);
      } else {
        displayResults(data.results, append);
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

function displayResults(results, append = false) {
  const objectsContainer = document.getElementById("objectsContainer"); // Ensure this exists in HTML

  // Handle cache + clear
  if (!append) {
    cachedResults = results; // Save current list so we can return to it
    document.getElementById("objectsContainer").innerHTML = ""; // Clear if not appending
  } else {
    cachedResults = cachedResults.concat(results); // Append new results to cache
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
}

// Function to show a single item when clicked -> modified to show overlay using chatGPT

function loadItemDetails(id) {
  const overlay = document.getElementById("itemOverlay");
  const overlayInner = document.getElementById("overlayInner");

  // Find the thumbnail and title from the cachedResults
  const record = cachedResults.find((item) => item.id == id);
  if (!record) return;

  const title = record.title || "Untitled";
  const name = record.name || "";
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
    <h2>${title}</h2>
    <p>${name}</p>
    ${
      imgurl
        ? `<img src="${imgurl}" alt="${title}">`
        : "<p>No image available</p>"
    }
  `;

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

currentPage = 1;
limit = 25;
currentQueryUrl =
  "https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&forms=Art%20work";
getData(`${currentQueryUrl}&page=${currentPage}&limit=${limit}`);
