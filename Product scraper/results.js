const searchResultsDiv = document.getElementById("search-results");

async function fetchSearchResults(query) {
    const apiHost = "real-time-product-search.p.rapidapi.com";
    const apiKey = "2584577010msh77a82e7bba98997p12d905jsn5157fdba8a09";
    const country = "us";

    try {
        searchResultsDiv.innerHTML = "Loading search results...";

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
    }
}

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("query");

if (query) {
    fetchSearchResults(query);
} else {
    searchResultsDiv.innerHTML = "No search query provided.";
}