const array = ['Todos','Comida','Helados','Botana','Agregar'];
showMenu();
function showMenu(){
    const value = 1;
  const category = document.querySelector('#menu');
  category.innerHTML = '';
const ul = document.createElement('ul');
ul.classList.add('tabs');
    for(let i = 0; i<array.length;i++){

    const li = document.createElement('li');
    const a = document.createElement('a');
    const span = document.createElement('span');
    a.href= '#tab'+i;
    span.textContent = array[i];
    span.classList.add('tab-text');


    a.appendChild(span);
    li.appendChild(a);
    ul.appendChild(li);
    category.appendChild(ul);
    }

}
