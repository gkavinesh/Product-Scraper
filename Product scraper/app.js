document.addEventListener("DOMContentLoaded", () => {
  const trendingProductsDiv = document.getElementById("trending-products");
  const searchResultsDiv = document.getElementById("search-results");
  const preloader = document.getElementById("preloader");

  // Fetch trending products function
  async function fetchTrendingProducts() {
      if (!trendingProductsDiv) return; // Check if the element exists
      const apiHost = "real-time-product-search.p.rapidapi.com";
      const apiKey = "b1b5b0c5aamsh2ffa08b2c0bfd75p1001b6jsn7954d2a329b5";
      const query = "electronics";
      const country = "us";

      try {
          trendingProductsDiv.innerHTML = "Loading trending products...";

          const response = await fetch(
              `https://${apiHost}/search?q=${encodeURIComponent(query)}&country=${country}&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY&min_rating=ANY`,
              {
                  method: "GET",
                  headers: {
                      "x-rapidapi-key": apiKey,
                      "x-rapidapi-host": apiHost,
                  },
              }
          );

          const data = await response.json();

          if (data.status !== "OK" || !data.data.products) {
              trendingProductsDiv.innerHTML = "No trending products found.";
              return;
          }

          trendingProductsDiv.innerHTML = data.data.products
              .map(
                  (product) => `
                  <div class="product-card">
                      <h3>${product.product_title || "No Title"}</h3>
                      <img src="${product.product_photos[0] || ""}" alt="${product.product_title}">
                      <p><strong>Price:</strong> ${
                          product.typical_price_range
                              ? product.typical_price_range.join(" - ")
                              : "Not available"
                      }</p>
                      <p><strong>Rating:</strong> ${product.product_rating || "No rating"} (${product.product_num_reviews || 0} reviews)</p>
                      <p><a href="${product.product_page_url}" target="_blank">View Product</a></p>
                  </div>
              `
              )
              .join("");
      } catch (error) {
          console.error("Error fetching trending products:", error);
          trendingProductsDiv.innerHTML = "Failed to load trending products. Please try again.";
      }
  }

  // Fetch search results function
  async function fetchSearchResults(query) {
      if (!searchResultsDiv || !preloader) return; // Check if elements exist
      const apiHost = "real-time-product-search.p.rapidapi.com";
      const apiKey = "2584577010msh77a82e7bba98997p12d905jsn5157fdba8a09";
      const country = "us";

      try {
          // Show preloader
          preloader.classList.remove("hidden");
          searchResultsDiv.innerHTML = "";

          const response = await fetch(
              `https://${apiHost}/search?q=${encodeURIComponent(query)}&country=${country}&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY&min_rating=ANY`,
              {
                  method: "GET",
                  headers: {
                      "x-rapidapi-key": apiKey,
                      "x-rapidapi-host": apiHost,
                  },
              }
          );

          const data = await response.json();

          if (data.status !== "OK" || !data.data.products) {
              searchResultsDiv.innerHTML = "No products found for your search.";
              return;
          }

          // Hide preloader
          preloader.classList.add("hidden");

          // Display search results
          searchResultsDiv.innerHTML = data.data.products
              .map(
                  (product) => `
                  <div class="product-card">
                      <h3>${product.product_title || "No Title"}</h3>
                      <img src="${product.product_photos[0] || ""}" alt="${product.product_title}">
                      <div class="product-details">
                          <p><strong>Price:</strong> ${
                              product.typical_price_range
                                  ? product.typical_price_range.join(" - ")
                                  : product.price || "Not available"
                          }</p>
                          <p><strong>Rating:</strong> ${product.product_rating || "No rating"} (${product.product_num_reviews || 0} reviews)</p>
                      </div>
                      <p><a href="${product.product_page_url}" target="_blank">View Product</a></p>
                  </div>
              `
              )
              .join("");
      } catch (error) {
          console.error("Error fetching search results:", error);
          searchResultsDiv.innerHTML = "Failed to load search results. Please try again.";
      } finally {
          // Hide preloader in case of errors or after results load
          preloader.classList.add("hidden");
      }
  }

  // Extract the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  // Check which function to run based on the presence of `query`
  if (query) {
      fetchSearchResults(query);
  } else {
      if (preloader) preloader.classList.add("hidden"); // Hide preloader if not needed
      if (searchResultsDiv) searchResultsDiv.innerHTML = "No search query provided.";
      fetchTrendingProducts();
  }
});



