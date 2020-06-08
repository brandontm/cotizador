let productList;
const API_URL = 'https://itacate.herokuapp.com/api/v1';
fetch(`${API_URL}/products`)
.then(response => response.json())
.then((products) => {
    productList = products;
})
.then(()=>showMenu());

function showMenu(){
  //  const value = 1;
  const category = document.querySelector('#menu');
  category.innerHTML = '';
const ul = document.createElement('ul');
ul.classList.add('tabs');
const li = document.createElement('li');
const a = document.createElement('a');
const span = document.createElement('span');
span.textContent = 'Todos';
span.classList.add('tab-text');
a.onclick = (()=> showProducts(0));
li.dataset.id = 0;
a.appendChild(span);
li.appendChild(a);
ul.appendChild(li);

fetch(`${API_URL}/categories`)
            .then(response => response.json())
            .then((categories) => {
                    categories.forEach((category) => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        const span = document.createElement('span');
                        //a.href= '#tab'+category.id;
                        a.onclick = (()=> showProducts(category.id));
                        span.textContent = category.title;
                        span.classList.add('tab-text');

                        li.dataset.id = category.id;
                        a.appendChild(span);
                        li.appendChild(a);
                        ul.appendChild(li);

                    });
                    category.appendChild(ul);
            })


}

function showProducts(categoryId){

    const productResult = document.querySelector('#result');
    productResult.innerHTML = '';
    if(categoryId ){
        productList.filter((product)=> product.id_category === categoryId)
        .forEach((product) => {
            showProductCard(product);
        })

    }else{

        productList.forEach((product) => {
            showProductCard(product);
        })
    }


}
function showProductCard(product) {
    const productResult = document.querySelector('#result');

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
    //cardQuantity.textContent = quantity;

    const cardQuantityValues = document.createElement('div');
    cardQuantityValues.classList.add('dropdown-menu');

    [...Array(20).keys()].forEach((number) => {
        const value = number + 1;
        const cardQuantValue = document.createElement('a');
        cardQuantValue.classList.add('dropdown-item');

        cardQuantValue.onclick = () => {
            this.putQuotationProduct(product.id, Number(cardQuantValue.textContent));
        };

       /* if (value === quantity)
            cardQuantValue.classList.add('active');*/

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

    productResult.appendChild(div);
}
