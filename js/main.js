const itemsPath = './data/datos.json';

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

const productsElement = document.querySelector('#products');
const quotationElement = document.querySelector('#quotation');
const resultElement = document.querySelector('#result');

fetch(itemsPath)
    .then(response => response.json())
    .then(items => {
        items.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item['producto'];
            productsElement.appendChild(option);
        });
    });

quotationElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(quotationElement);

    console.log(formData);

    showQuotationDetails(1, 1);
});

function showQuotationDetails(idProduct, postalCode) {
    fetch(itemsPath)
        .then(response => response.json())
        .then(items => {
            const result = document.createElement('h1');
            result.textContent = 'Ni idea men, unos 500?';

            resultElement.innerHTML = '';
            resultElement.appendChild(result);
        });
    // Item data
    const name = 'Coyota';
    const price = 100;      // MXN Currency
    const volume = 1;       // centimeters squared
    const weight = 250;     // grams

    const distance = 300;   // kilometers


}
