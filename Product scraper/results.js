const searchResultsDiv = document.getElementById("search-results");

async function fetchSearchResults(query) {
    const apiHost = "real-time-product-search.p.rapidapi.com";
    const apiKey = "b1b5b0c5aamsh2ffa08b2c0bfd75p1001b6jsn7954d2a329b5";
    const country = "us";

    try {
        // Inform the user that the results are loading
        searchResultsDiv.innerHTML = "<p>Loading electronics results...</p>";

        // API call for searching electronics products
        const response = await fetch(
            `https://${apiHost}/search?q=${encodeURIComponent(query)}%20electronics&country=${country}&language=en&page=1&limit=10&sort_by=BEST_MATCH&product_condition=ANY&min_rating=ANY`,
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
            searchResultsDiv.innerHTML = "<p>No electronics found for your search. Please try another query.</p>";
            return;
        }

        // Render the product cards
        searchResultsDiv.innerHTML = data.data.products
            .map((product) => {
                const productImage = product.product_photos?.[0] || "default-image.jpg"; // Fallback image
                const productPrice = product.typical_price_range
                    ? product.typical_price_range.join(" - ")
                    : product.price || "Not available";

                return `
                    <div class="product-card">
                        <h3>${product.product_title || "No Title"}</h3>
                        <img src="${productImage}" alt="${product.product_title}">
                        <div class="product-details">
                            <p><strong>Price:</strong> ${productPrice}</p>
                            <p><strong>Rating:</strong> ${product.product_rating || "No rating"} (${product.product_num_reviews || 0} reviews)</p>
                        </div>
                        <p><a href="${product.product_page_url}" target="_blank">View Product</a></p>
                    </div>
                `;
            })
            .join("");
    } catch (error) {
        console.error("Error fetching search results:", error);
        searchResultsDiv.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
    }
}

// Extract query parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

// Check for query and invoke the search function
if (query) {
    fetchSearchResults(query);
} else {
    searchResultsDiv.innerHTML = "<p>Please provide a search query to explore electronics.</p>";
}

