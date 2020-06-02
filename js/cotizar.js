let db;
//const API_URL = 'https://itacate.herokuapp.com/api/v1';
const API_URL = 'http://localhost:3000/api/v1'; // TODO: Change to production URL

window.onload = function () {
    const formControl = document.querySelector('#test');

    let request = window.indexedDB.open('cart_db', 1);

    request.onerror = () => {
        // TODO: Error handling
    }

    request.onsuccess = () => {
        db = request.result;

        showCartProducts();
    }

    request.onupgradeneeded = (event) => {
        // Get opened database
        let db = event.target.result;

        // Create object store (table)
        let objectStore = db.createObjectStore('product', { keyPath: 'product_id' });
        objectStore.createIndex('quantity', 'quantity', { unique: false });
    };

    formControl.onsubmit = (event) => {
        event.preventDefault();

        // Add item
        let newItem = { 'product_id': 5, 'quantity': 1 };

        let transaction = db.transaction(['product'], 'readwrite');

        let objectStore = transaction.objectStore('product');

        let request = objectStore.add(newItem);

        request.onsuccess = () => {

        };

        transaction.oncomplete = () => {
            console.log('Transaction completed: database modification finished.');

            showCartProducts();
        };

        transaction.onerror = () => {
            // TODO: Error handling ?
            console.log('Transaction not opened due to error');
        };
    }
}

function showCartProducts() {
    let objectStore = db.transaction('product').objectStore('product');

    const productList = document.querySelector('#result');
    productList.innerHTML = '';

    objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;

        if (cursor) {
            fetch(`${API_URL}/product/${cursor.value.product_id}`)
                .then(response => response.json())
                .then((product) => {
                    const div = document.createElement('div');
                    div.classList.add('col-sm-4');
                    div.classList.add('col-lg-2');
                    div.classList.add('py-2');

                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.classList.add('mb-4');
                    card.classList.add('h-100');

                    const img = document.createElement('img');
                    img.classList.add('card-img-top');
                    img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';


                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    const cardTitle = document.createElement('h6');
                    cardTitle.classList.add('card-text');
                    cardTitle.textContent = `${product.title}`;

                    cardBody.appendChild(cardTitle);

                    card.appendChild(img);
                    card.append(document.createElement('hr')); // add separator
                    card.appendChild(cardBody);

                    div.appendChild(card);

                    productList.appendChild(div);
                });

            cursor.continue();
        }
    }
}

function addToProductQuote() {
    let objectStore = db.transaction('product').objectStore('product');
}
