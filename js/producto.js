const productoDOM = document.querySelector(".productos__center")
const carritoDOM = document.querySelector(".carrito")
const carritoCenter = document.querySelector(".carrito__center")
const openCarrito = document.querySelector(".carrito__icon")
const closeCarrito = document.querySelector(".close__carrito")
const overlay = document.querySelector(".carrito__overlay")
const carritoTotal = document.querySelector(".carrito__total")
const clearCarritoBtn = document.querySelector(".clear__carrito")
const itemTotales =document.querySelector(".item__total")
const detalles = document.getElementById('detalles')


//Podemos hacer uso Json de productos
class Productos{
    async getProductos(){
        try{
            const resultado = await fetch('../data/productos.json');
            const data = await resultado.json();
            const productos = data.items
            return productos
        }catch(err){
            console.log(err);
        }
    }
}

let carrito = [];
let buttonDOM = [];


class ProductoVenta {

    

    //nos permite mostrar en el listado del producto en la vista de productos - vista productos.html
    renderProductos(productos){
        let result = ""
        productos.forEach((producto) =>{
            result += `
			<div class="producto">
			<br>
			<div class="image__container mt-10">
			<img src=${producto.image} alt="" height="280px" width="200px">
		</div>
          <div class="producto__footer">
            <h1>${producto.title}</h1>
            <div class="rating">
              <span>
                <i class="bx bxs-star"></i>
              </span>
              <span>
                <i class="bx bxs-star"></i>
              </span>
              <span>
                <i class="bx bxs-star"></i>
              </span>
              <span>
                <i class="bx bxs-star"></i>
              </span>
              <span>
                <i class="bx bx-star"></i>
              </span>
            </div>
            <div class="price">s/. ${producto.price}</div>
          </div>
          <div class="bottom">
            <div class="btn__group">
              <button class="btn addToCart btn btn-secondary" data-id=${producto.id}>Añadir carrito</button>
              <a href="producto-detalles.html?id=${producto.id}" class="btn view">Vista</a>
            </div>
          </div>
        </div>
				`
        });
        productoDOM.innerHTML = result
    }

    //Podremos ver el detalle de cada producto segun el id del producto nos deriva a la vista producto-detalles.html
    detalleProducto(id){
        let filtroDato = productos.filter(item => item.id == id)
        let result = ""
        filtroDato.forEach(producto => {
            result += `
			<article class="detalle-grid">
				<img src=${producto.image} alt="${producto.title}" class="img-fluid">
				<div class="detalles-content">
					<h3>${producto.title}</h3>
					<div class="rating">
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bxs-star"></i>
						</span>
						<span>
							<i class="bx bx-star"></i>
						</span>
					</div>
						<p class="price"><b>Precio: </b> s/. ${producto.price}</p>
						<p class="description">
							<b>Descripcion: </b> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta quae ad ex sint expedita perspiciatis odit eligendi! Et quia ex aperiam dolorum sunt omnis maiores. Repudiandae delectus iste exercitationem vel?</span>
						</p>
						<p class="description">
							<span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque voluptates consequuntur in assumenda odit hic, aut cupiditate dolorem aspernatur! Quibusdam iusto magnam vero maxime quisquam voluptatibus minima aliquam molestias, iure ratione commodi, reiciendis quasi.</span>
						</p>

						<div class="bottom">
							<div class="btn__group">
								<button class="btn addToCart btn btn-danger" data-id=${producto.id}>Añadir carrito</button>
							</div>
						</div>
				</div>
			</article>
			`
        });
        detalles.innerHTML = result;
    }


    getButtons(){
        let buttons = [...document.querySelectorAll(".addToCart")];
   

        buttonDOM = buttons;
        buttons.forEach((button)=> {
            let id = button.dataset.id;
            let inCart = carrito.find(item => item.id === parseInt(id, 10));

            if(inCart){
                button.innerHTML = "En el carrito";
                button.disabled = true;
            }

            button.addEventListener("click", e =>{
                e.preventDefault();
                e.target.innerHTML = "En el carrito";
                e.target.disabled = true;


                // GET productos al carrito
                let carritoItem = {...Storage.getProductos(id), cantidad: 1}

                //agregamos el producto al carrito
                carrito = [...carrito, carritoItem]

                //Guardamos el carrito al localstorage
                Storage.saveCart(carrito)

                //Set cart values
                this.setItemValues(carrito)
                this.addCarritoItem(carritoItem)
                //Show al carrito
            })
        })
    }

    //Realizamos las operaciones para el resultado de la compra en la tienda 
    setItemValues(carrito){
        let tempTotal = 0;
        let itemTotal = 0;
        let igv = 0.18;
        carrito.map(item => {
            tempTotal += (item.price * item.cantidad)*igv + (item.price * item.cantidad);
            itemTotal += item.cantidad;
        });
        carritoTotal.innerText = parseFloat(tempTotal.toFixed(2));
        itemTotales.innerText = itemTotal
    }

    //podremos ingresar a cada producto dentro del carrito 
    addCarritoItem({image, price, title, id}){
        let div = document.createElement("div")
        div.classList.add("carrito__item")

        div.innerHTML = `
		<img src=${image} alt=${title}>
		<div>s
			<h3>${title}</h3>
			<p class="price">s/. ${price}</p>
		</div>
		<div>
			<span class="increase" data-id=${id}>
				<i class="bx bxs-up-arrow"></i>
			</span>
			<p class="item__cantidad">1</p>
			<span class="decrease" data-id=${id}>
				<i class="bx bxs-down-arrow"></i>
			</span>
		</div>
		<div>
			<span class="remove__item" data-id=${id}>
				<i class="bx bx-trash"></i>
			</span>
		</div>
		`
        carritoCenter.appendChild(div)
    }


    show(){
        carritoDOM.classList.add("show")
        overlay.classList.add("show")
    }


    hide(){
        carritoDOM.classList.remove("show")
        overlay.classList.remove("show")
    }

    populate(carrito){
        carrito.forEach(item => this.addCarritoItem(item))
    }


    setAPP(){
        carrito = Storage.getCart()
        this.setItemValues(carrito)
        this.populate(carrito)
        openCarrito.addEventListener("click", this.show)
        closeCarrito.addEventListener("click", this.hide)
    }


   


    cartLogic(){
        clearCarritoBtn.addEventListener("click", () =>{
            this.clearCarrito()
            this.hide()
        });

        carritoCenter.addEventListener("click", e =>{
            let target = e.target.closest("span")
            let targetElement = target.classList.contains("remove__item");
            
            if(!target) return
            if(targetElement){
                let id = parseInt(target.dataset.id);
                this.removeItem(id)
                carritoCenter.removeChild(target.parentElement.parentElement)
            }else if(target.classList.contains("increase")){
                let id = parseInt(target.dataset.id, 10);
                let tempItem = carrito.find(item => item.id === id);
                tempItem.cantidad++;
                Storage.saveCart(carrito)
                this.setItemValues(carrito)
                target.nextElementSibling.innerText = tempItem.cantidad
            }else if(target.classList.contains("decrease")){
                let id = parseInt(target.dataset.id, 10);
                let tempItem = carrito.find(item => item.id === id);
                tempItem.cantidad--;

                if(tempItem.cantidad > 0){
                    Storage.saveCart(carrito);
                    this.setItemValues(carrito);
                    target.previousElementSibling.innerText = tempItem.cantidad;
                }else{
                    this.removeItem(id);
                    carritoCenter.removeChild(target.parentElement.parentElement)
                }
            }
        });
    }


    removeItem(id){
        carrito = carrito.filter(item => item.id !== id);
        this.setItemValues(carrito)
        Storage.saveCart(carrito)
        let button = this.singleButton(id);
        if(button){
            button.disabled = false;
            button.innerText = "Añadir carrito"
        }
    }

    //Limpiar el carrito 
    clearCarrito(){
        let cartItems = carrito.map(item => item.id)
        cartItems.forEach(id => this.removeItem(id))

        while(carritoCenter.children.length > 0){
            carritoCenter.removeChild(carritoCenter.children[0])
        }
    }
   
    singleButton(id){
        return buttonDOM.find(button => parseInt(button.dataset.id) === id)
    }
}

let category = "";
let productos  = [];

//filtrar la categoria de los productos
function categoryValue(){
    var categoriaProducto = new ProductoVenta();

    category = document.getElementById("category").value
    if(category.length > 0){
        const producto = productos.filter(regx => regx.category === category)
        categoriaProducto.renderProductos(producto)
        categoriaProducto.getButtons();
    }else{
        categoriaProducto.renderProductos(productos)
        categoriaProducto.getButtons();

    }
}


class Storage {
    static saveProduct(obj){
        localStorage.setItem("productos", JSON.stringify(obj))
    }
    static saveCart(carrito){
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    static getProductos(id){
        const producto = JSON.parse(localStorage.getItem("productos"))
        return producto.find(product =>product.id === parseFloat(id, 10))
    }
    static getCart(){
        return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];
    }
}


const query = new URLSearchParams(window.location.search)
let id = query.get('id')

document.addEventListener("DOMContentLoaded", async () =>{
    let productosLista = new Productos();
    let identificarProducto = new ProductoVenta();

    identificarProducto.setAPP()

    productos = await productosLista.getProductos()
    if(id){
        identificarProducto.detalleProducto(id)
        Storage.saveProduct(productos)
        identificarProducto.getButtons();
        identificarProducto.cartLogic();
    }else{
        identificarProducto.renderProductos(productos)
        Storage.saveProduct(productos)
        identificarProducto.getButtons();
        identificarProducto.cartLogic();
    }
})



