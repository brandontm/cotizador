let db;
const API_URL = 'https://itacate.herokuapp.com/api/v1';

window.onload = function () {
    this.loadDatabase();
}

function showQuotationProducts() {
    const transaction = db.transaction('product');
    const objectStore = transaction.objectStore('product');

    const productList = document.querySelector('#result');
    productList.innerHTML = ''; // clean product list

    objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;

        if (cursor) {
            const quantity = cursor.value.quantity;

            fetch(`${API_URL}/product/${cursor.value.product_id}`)
                .then(response => response.json())
                .then((product) => {
                    //#region show product card
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
                    //#endregion
                })
                .catch(() => {
                    const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
                    errorModalBody.textContent = 'Hubo un error al obtener los productos de la cotización. Favor de intentar de nuevo.';
                    $('#errorModal').modal('show');
                })

            cursor.continue();
        }
    }
}

function loadDatabase() {
    const request = window.indexedDB.open('cart_db', 1);

    request.onerror = () => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error interno de la aplicación. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    }

    request.onsuccess = () => {
        db = request.result;

        this.showQuotationProducts();
    }

    request.onupgradeneeded = (event) => {
        // Get opened database
        db = event.target.result;

        // Create object store (table)
        const objectStore = db.createObjectStore('product', { keyPath: 'product_id' });
        objectStore.createIndex('quantity', 'quantity', { unique: false });
    };
}

function putQuotationProduct(productId, productQuantity) {
    const newItem = { 'product_id': productId, 'quantity': productQuantity };

    const transaction = db.transaction(['product'], 'readwrite');

    const objectStore = transaction.objectStore('product');

    const request = objectStore.put(newItem);

    request.onsuccess = () => {

    };

    transaction.oncomplete = () => {
        this.showQuotationProducts();
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
        this.showQuotationProducts();
    };

    transaction.onerror = () => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error al intentar eliminar un producto de la cotización. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    };
}
