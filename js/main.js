
let db;
const API_URL = 'https://itacate.herokuapp.com/api/v1';

window.onload = function () {
    this.loadDatabase();
}

function loadDatabase() {
    this.showLoading();

    const request = window.indexedDB.open('cart_db', 1);

    request.onerror = () => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error interno de la aplicación. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');

        hideLoading();
    }

    request.onsuccess = () => {
        db = request.result;

        showQuotationProducts();
    }

    request.onupgradeneeded = (event) => {
        // Get opened database
        db = event.target.result;

        // Create object store (table)
        const objectStore = db.createObjectStore('product', { keyPath: 'product_id' });
        objectStore.createIndex('quantity', 'quantity', { unique: false });

        showQuotationProducts();
    };
}
function showQuotationProducts() {
    this.showLoading();

    const productList = document.querySelector('#result');

    const transaction = db.transaction('product');
    const objectStore = transaction.objectStore('product');

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const registries = new Map();

        const fetchData = async () => {
            productList.innerHTML = ''; // clean product list

            const ids = event.target.result.map((results) => {
                registries.set(results.product_id, results.quantity);

                return results.product_id;
            }).join(';')

            const response = await fetch(`${API_URL}/products/${ids}`);
            const results = await response.json();

            if (ids && results.length > 0) {
                return results;
            } else {
                return null;
            }
        }
        fetchData()
            .then((products) => {
                hideLoading();

                if (products) {
                    productList.innerHTML = ''; // clean product list
                    products.forEach((product) => showProductCard(product, registries.get(product.id)));
                } else {
                    const noProductsFound = document.querySelector('#result > #noProductsFound');
                    noProductsFound.hidden = false;
                }
            })
            .catch(() => {
                const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
                errorModalBody.textContent = 'Hubo un error obteniendo productos. Favor de intentar de nuevo.';
                $('#errorModal').modal('show');

                hideLoading();
            });
    };
}
function putQuotationProduct(productId, productQuantity) {
    const newItem = { 'product_id': productId, 'quantity': productQuantity };

    const transaction = db.transaction(['product'], 'readwrite');

    const objectStore = transaction.objectStore('product');

    const request = objectStore.put(newItem);

    transaction.oncomplete = () => {
        showQuotationProducts();
    };

    transaction.onerror = () => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error al insertar producto a la cotización. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    };
}

function removeProductFromQuotation(productId) {
    const transaction = db.transaction(['product'], 'readwrite');

    const objectStore = transaction.objectStore('product');

    const request = objectStore.delete(productId);

    transaction.oncomplete = () => {
        showQuotationProducts();
    };

    transaction.onerror = () => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error al intentar eliminar un producto de la cotización. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    };
}
function showProductCard(product, quantity) {
    const productList = document.querySelector('#result');

    const div = document.createElement('div');
    div.classList.add('col-sm-4', 'col-lg-3', 'py-2');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'h-100');

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-text');

    const cardQuantityDropdown = document.createElement('div');
    cardQuantityDropdown.classList.add('dropdown');

    const cardQuantity = document.createElement('button');
    cardQuantity.classList.add('btn', 'btn-secondary', 'dropdown-toggle', 'float-right');
    cardQuantity.type = 'button';
    cardQuantity.id = 'productQuantityDropdownButton';
    cardQuantity.dataset.toggle = 'dropdown';
    cardQuantity.ariaHasPopup = 'true';
    cardQuantity.ariaExpanded = 'false';
    cardQuantity.textContent = quantity;

    const cardQuantityValues = document.createElement('div');
    cardQuantityValues.classList.add('dropdown-menu');

    [...Array(20).keys()].forEach((number) => {
        const value = number + 1;
        const cardQuantValue = document.createElement('a');
        cardQuantValue.classList.add('dropdown-item');

        cardQuantValue.onclick = () => {
            this.putQuotationProduct(product.id, Number(cardQuantValue.textContent));
        };

        if (value === quantity)
            cardQuantValue.classList.add('active');

        cardQuantValue.href = '#';
        cardQuantValue.textContent = value;

        cardQuantityValues.appendChild(cardQuantValue);
    });

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const removeProductButton = document.createElement('button');
    removeProductButton.classList.add('btn', 'btn-link', 'float-left');
    removeProductButton.textContent = 'Eliminar';
    removeProductButton.onclick = () => {
        this.removeProductFromQuotation(product.id);
    };

    cardQuantityDropdown.appendChild(cardQuantity);
    cardQuantityDropdown.appendChild(cardQuantityValues);

    cardTitle.textContent = `${product.title}`;

    cardBody.appendChild(cardTitle);

    cardFooter.appendChild(removeProductButton);
    cardFooter.appendChild(cardQuantityDropdown);

    // card.appendChild(img);
    // card.append(document.createElement('hr')); // add separator
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    div.appendChild(card);

    productList.appendChild(div);
}



//Design of index
$(document).ready(function(){
	$('ul.tabs li a:first').addClass('active');
	$('.secciones article').hide();
	$('.secciones article:first').show();

	$('ul.tabs li a').click(function(){
		$('ul.tabs li a').removeClass('active');
		$(this).addClass('active');
		$('.secciones article').hide();

		var activeTab = $(this).attr('href');
		$(activeTab).show();
		return false;
	});
});

