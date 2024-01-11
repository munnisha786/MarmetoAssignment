document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const gridViewButton = document.getElementById('grid-view');
    const listViewButton = document.getElementById('list-view');
    const productList = document.getElementById('product-list');

    let productsData = [];


    const fetchProducts = async () => {
        try {
            const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }
            const responseData = await response.json();
            console.log(responseData)
            if (Array.isArray(responseData.data)) {
                productsData = responseData.data;
                renderProducts();
            } else {
                console.error('API response data is not an array:', responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderProducts = () => {
        productList.innerHTML = '';

        productsData.forEach((product) => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);
        });
    };

    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('img');
        productImage.src = product.product_image;


        const productTitle = document.createElement('h3');
        productTitle.innerText = product.product_title.toUpperCase();

        const productBadge = document.createElement('span');
        productBadge.className = 'badge';
        productBadge.innerText = product.product_badge;

        const productVariants = document.createElement('div');
        productVariants.className = 'product-variants';
        product.product_variants.forEach((variant) => {
            const variantItem = document.createElement('h6');
            for (const key in variant) {
                if (variant.hasOwnProperty(key)) {
                    variantItem.innerText = ` ${variant[key]} \n \n`.toUpperCase();
                }
            }
            productVariants.appendChild(variantItem);
        });

        productCard.appendChild(productImage);
        productCard.appendChild(productTitle);
        productCard.appendChild(productBadge);
        productCard.appendChild(productVariants);

        return productCard;
    };

    const handleSearch = () => {
        const searchValue = searchBar.value.toLowerCase();
        productList.innerHTML = '';

        productsData.forEach((product) => {
            if (isMatch(product, searchValue)) {
                const productCard = createProductCard(product);
                highlightSearchResult(productCard, searchValue);
                productList.appendChild(productCard);
            }
        });
    };


    const isMatch = (product, searchValue) => {
        const propertiesToSearch = [
            product.product_title.toLowerCase(),
            ...product.product_variants.map((variant) =>
                Object.values(variant).join(' ').toLowerCase()
            )
        ];
        return propertiesToSearch.some((property) => property.includes(searchValue));
    };

    const highlightSearchResult = (productCard, searchValue) => {
        const elementsToHighlight = productCard.querySelectorAll('h3, .product-variants h6');
        elementsToHighlight.forEach((element) => {
            const text = element.innerText;

            if (searchValue.trim() !== '') {
                const highlightedText = text.replace(
                    new RegExp(searchValue, 'gi'),
                    (match) => `<span class="highlight">${match}</span>`
                );
                element.innerHTML = highlightedText;
            } else {
                element.innerHTML = text;
            }
        });
    };



    const switchToGridView = () => {
        productList.classList.remove('list-view');
    };


    const switchToListView = () => {
        productList.classList.add('list-view');
    };


    searchBar.addEventListener('input', handleSearch);
    gridViewButton.addEventListener('click', switchToGridView);
    listViewButton.addEventListener('click', switchToListView);


    fetchProducts();
});