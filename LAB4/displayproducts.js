fetch('https://2020147580.github.io/HomeworkRepository/LAB4/product.json ').then(function(response) {
  return response.json();
}).then(function(json) {
  let products = json;
  initialize(products);
}).catch(function(err) {
  console.log('Fetch problem: ' + err.message);
});


function initialize(products) {
  const category = document.querySelector('#category');
  const searchTerm = document.querySelector('#searchTerm');
  const searchBtn = document.querySelector('button');
  const main = document.querySelector('main');

  let categoryBefore = category.value;
  let searchBefore = '';

  let categoryProducts;
  let productToPrint;

  productToPrint = products;
  // at first, every products have to be displayed
  display();

  categoryProducts = [];
  productToPrint = [];

  // if find button has been clicked, display appropriate products.
  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
	// first, select products by category.
    e.preventDefault();

    categoryProducts = [];
    productToPrint = [];
    
	// if category and searchterm didn't changed, no changes in html.
    if(category.value === categoryBefore && searchTerm.value.trim() === searchBefore) {
      return;
    } else {
	  // if category has changed.
      categoryBefore = category.value;
      searchBefore = searchTerm.value.trim();
      
      if(category.value === 'All') {
        categoryProducts = products;
        selecting();
      }
	  else {;
        for(let i = 0; i < products.length ; i++) {
          if(products[i].type === category.value.toLowerCase()) {
            categoryProducts.push(products[i]);
          }
        }
        selecting();
      }
    }
  }


  function selecting() {
	// after selecting by category, select final products to print
    if(searchTerm.value.trim() === '') {
	  // every thing that came from selectCategory.
      productToPrint = categoryProducts;
      display();
    } else {
      for(let i = 0; i < categoryProducts.length ; i++) {
		// if there is same term in product name, save at productToPrint.
        if(categoryProducts[i].name.indexOf( searchTerm.value.trim().toLowerCase() ) !== -1) {
          productToPrint.push(categoryProducts[i]);
        }
      }
      display();
    }

  }

  function display() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    if(productToPrint.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No results';
      main.appendChild(para);
    }else {
      for(let i = 0; i < productToPrint.length; i++) {
        fetchBlob(productToPrint[i]);
      }
    }
  }

  function fetchBlob(product) {
    let url = 'https://2020147580.github.io/HomeworkRepository/LAB4/' + product.image;
    fetch(url).then(function(response) {
        return response.blob();
    }).then(function(blob) {
      let objectURL = URL.createObjectURL(blob);
      print(objectURL, product);
    });
  }

  function print(objectURL, product) {
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