async function getData() {
  const url = "https://api.collection.nfsa.gov.au/search?query=dog";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}
getData(); 