// Function to fetch data from NFSA API
async function getData(url) {
  try {
      // Fetch data from NFSA API
      const response = await fetch(url);

      // Convert response to JSON
      const data = await response.json();

      // Log the full response to inspect structure
      console.log("Full API Response:", data);

      // Call function to display results
      displayResults(data.results);
  } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("objectsContainer").innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }
}

// Function to display API results
function displayResults(results) {
  const objectsContainer = document.getElementById("objectsContainer"); // Ensure this exists in HTML

  results.forEach(item => {
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
          ${imgurl ? `<div class="object-item"><img src="${imgurl}" alt="${item.title}"></div>` : ""}
      `;

      // 3. Append the item container to the objects container
      objectsContainer.appendChild(itemContainer);

  });
}

// Call getData with NFSA API URL
getData("https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&forms=Art%20work");
