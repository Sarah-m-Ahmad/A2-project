// Global variables
let cachedResults = [];

// Function to fetch data from NFSA API
function getData(url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      if (callback) {
        callback(data);
      } else {
        displayResults(data.results);
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
function displayResults(results) {
  cachedResults = results; // Save current list so we can return to it

  const objectsContainer = document.getElementById("objectsContainer"); // Ensure this exists in HTML
  objectsContainer.innerHTML = ""; // Clear previous results

  results.forEach((item) => {
    console.log("Item:", item); // Step to log each item

    // Extract the preview array
    const imgArr = item.preview || []; // Default to empty array

    // Initialize empty image URL
    let imgurl = "";

    // Loop through the preview array to find an image
    const baseurl = "https://media.nfsacollection.net/";
    for (let i = 0; i < imgArr.length; i++) {
      console.log("Preview object:", imgArr[i]); // Log preview object
      if (imgArr[i].hasOwnProperty("thumbnailFilePath")) {
        imgurl = baseurl + imgArr[i].thumbnailFilePath;
        break; // Use the first valid image
      }
    }

    // 1. Create a container for the item
    const itemContainer = document.createElement("div");

    // 2. Use template literals to embed the item details in HTML
    itemContainer.innerHTML = `
          ${
            imgurl
              ? `<div class="column-item" data-id="${item.id}">
            <img src="${imgurl}" alt="${item.title}">
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
}

// Function to show a single item when clicked -> modified to show overlay using chatGPT
function loadItemDetails(id) {
  console.log("load item: " + id);
  const apiUrl = `https://api.collection.nfsa.gov.au/title/${id}`;

  const overlay = document.getElementById("itemOverlay");
  const overlayInner = document.getElementById("overlayInner");

  // Clear previous content and show loading message
  overlayInner.innerHTML = "<p>Loading item details...</p>";
  overlay.classList.remove("hidden"); // Show overlay
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });

  getData(apiUrl, (item) => {
    const title = item.title || "Untitled";
    const name = item.name || "";
    const preview = Array.isArray(item.preview) ? item.preview : [];
    const imgurl =
      preview.length > 0 && preview[0].filePath
        ? `https://media.nfsacollection.net/${preview[0].filePath}`
        : "";

    overlayInner.innerHTML = `
      <h2>${title}</h2>
      <p>${name}</p>
      ${
        imgurl
          ? `<img src="${imgurl}" alt="${title}" style="max-width:100%; height:auto;">`
          : ""
      }
    `;
  });

  const closeOverlay = () => {
    overlay.classList.remove("visible");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300); // Match this duration with CSS transition duration
  };

  // Close button
  document.getElementById("closeOverlay").addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  // Close when clicking outside the content
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.add("hidden");
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

// function loadItemDetails(id) {
//   console.log("load item: " + id);
//   const apiUrl = `https://api.collection.nfsa.gov.au/title/${id}`;

//   const outputDiv = document.getElementById("objectsContainer");
//   outputDiv.innerHTML = "<p>Loading item details...</p>";

//   getData(apiUrl, (item) => {
//     const title = item.title || "Untitled";
//     const name = item.name || "";
//     const preview = Array.isArray(item.preview) ? item.preview : [];
//     const imgurl =
//       preview.length > 0 && preview[0].filePath
//         ? `https://media.nfsacollection.net/${preview[0].filePath}`
//         : "";

//     outputDiv.innerHTML = `
//       <button id="backBtn">Back</button>
//       <h2>${title}</h2>
//       <p>${name}</p>
//       ${imgurl ? `<img src="${imgurl}" alt="${title}">` : ""}
//     `;

//     document.getElementById("backBtn").addEventListener("click", () => {
//       displayResults(cachedResults); // Just re-render the stored results
//     });
//   });
// }

// Call getData with NFSA API URL

getData(
  "https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&forms=Art%20work"
);
