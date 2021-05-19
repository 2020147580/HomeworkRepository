fetch('products.json').then(function(response) {
  return response.json();
}).then(function(json) {
  let products = json;
  initialize(products);
}).catch(function(err) {
  console.log('Fetch problem: ' + err.message);
});

window.onscroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
    initialize(products);
  }

}

function initialize(products) {
  const category = document.querySelector('#category');
  const searchTerm = document.querySelector('#searchTerm');
  const searchBtn = document.querySelector('button');
  const main = document.querySelector('main');

  let lastCategory = category.value;
  let lastSearch = '';

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];


  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    e.preventDefault();

    categoryGroup = [];
    finalGroup = [];

    if(category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      
      if(category.value === 'All') {
        categoryGroup = products;
        selectProducts();

      }
	  else {
        let lowerCaseType = category.value.toLowerCase();
        for(let i = 0; i < products.length ; i++) {
          if(products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }
        selectProducts();
      }
    }
  }


  function selectProducts() {
    if(searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      for(let i = 0; i < categoryGroup.length ; i++) {
        if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      updateDisplay();
    }

  }

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if(finalGroup.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No results';
      main.appendChild(para);
    }else {
      for(let i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }

  function fetchBlob(product) {
    let url = 'images/' + product.image;
    fetch(url).then(function(response) {
        return response.blob();
    }).then(function(blob) {
      let objectURL = URL.createObjectURL(blob);
      showProduct(objectURL, product);
    });
  }

  function showProduct(objectURL, product) {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    const para = document.createElement('p');
    const image = document.createElement('img');
    const button = document.createElement('btn');
    button.classList.add('btn');
    button.textContent= 'Click to see more';

    section.setAttribute('class', product.type);

    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    para.textContent = product.price + '원';

    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
	
    function showMore(){
      section.appendChild(heading);
      section.appendChild(para);
    }
    section.appendChild(image);
    section.appendChild(button);
    button.onclick = showMore;

  }
}