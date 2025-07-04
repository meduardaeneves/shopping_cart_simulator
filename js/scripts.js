class StoreCart {
    constructor(cartItems) {
        this.cartItems = cartItems;
        this.totalItems = 0;
        this.totalAmount = 0; 
        this.idList = this.generateIDlist()
    }

    generateIDlist() {
        let id_list = []
        for (let element of this.cartItems) {
            id_list.push(element['id'])    
        }
        return id_list
    }

    resetManagerArea() {
        const idText = document.getElementById("new-item-id-input")
        const idname = document.getElementById("new-item-name-input")
        const idprice = document.getElementById("new-item-price-input") 
        const managerText = document.getElementById("output-final-results")

        idText.value = ''
        idname.value = ''
        idprice.value = ''
        managerText.innerText = 'No new item was added'
    }

    displayNewItemArea() {
        const newItemArea = document.getElementById('final-new-item-area')
        const btn = document.getElementById('btn-new-item')

        if (newItemArea.classList.contains('hide')) {
            newItemArea.classList.remove('hide');
            btn.classList.add('active')
            // btn.style.backgroundColor = 'rgb(157, 99, 22)';     
            // btn.style.color = 'white';
            btn.innerText = "Hide new item area"; 
            // this.resetManagerArea(); 
                     
        }  else {
            newItemArea.classList.add('hide');
            btn.classList.remove('active')
            // btn.style.backgroundColor = 'rgb(241, 231, 217)';    
            // btn.style.color = 'black'; 
            btn.innerText = "Add new item to store"; 
            this.resetManagerArea();   
        }  
    }

    updateShoppingCart() {
        const totalItems = document.getElementById('total-qnt-value')    
        const totalAmount = document.getElementById('total-amount-value')  
        
        totalItems.innerText = this.totalItems;
        totalAmount.innerText = `$ ${this.totalAmount.toFixed(2)}`;
        
    }

    validateNewItem() {
        let idText = document.querySelector("#new-item-id-input").value
        let idname = document.querySelector("#new-item-name-input").value
        let idprice = document.querySelector("#new-item-price-input").value
        const managerTextArea = document.getElementById("output-final-results")
        
        let valueNum = Number(idText)
        let valuePrice = Number(idprice)
        
        let newElement = {}
        if (!isNaN(valueNum) && !(this.idList.includes(valueNum)) && (idText != '') && valueNum > 0) {
            newElement['id'] = valueNum
        } else {
            managerTextArea.innerText = `Insert a valid ID`
            return
        }

        if (idname == '' || !isNaN(Number(idname))) {
            managerTextArea.innerText = `Insert a valid name for the product`
            return
        } else {
            newElement['name'] = idname
            newElement['qty'] = 0 
        }
        
        if (!isNaN(valuePrice) && (idprice != '') && (valuePrice > 0)) {
            newElement['unit'] = valuePrice
        } else {
            managerTextArea.innerText = `Insert a valid price for the item`
            return
        }
        
        this.cartItems.push(newElement)
        this.idList.push(valueNum)
        this.resetManagerArea()
        managerTextArea.innerText = `Item "${idname}" was added to store.`

        this.addNewItem(newElement)

    }

    updateTableHeadText() {
        const element = document.getElementById("qnt-table-head")
        if (window.innerWidth < 541) {
            element.innerText = "QTY";
        } else {
            element.innerText = "QUANTITY";
        }
            }
    
    addQntEvent(template,unit) {
        let btnPlus = template.querySelector('.qnt-value-div-plus');
        let btnMinus = template.querySelector('.qnt-value-div-minus');
        let templateQty = template.querySelector(".qnt-value-div-total");
        let templateTotal = template.querySelector(".subtotal-value");
        let templateId = template.querySelector(".id-value");

        let qty = Number(templateQty.textContent); 
        let itemId = Number(templateId.textContent); // pega o ID mostrado na linha

        // Função para atualizar lista original
        const updateCartItemQty = (newQty) => {
            const item = this.cartItems.find(el => Number(el.id) === itemId);
            if (item) {
                item.qty = newQty;
            }
        };


        btnPlus.addEventListener("click", () => {
            qty++;
            templateQty.textContent = qty;
            templateTotal.textContent = (unit * qty).toFixed(2);
            this.totalItems ++
            this.totalAmount += unit
            this.updateShoppingCart()
            updateCartItemQty(qty);
        });

        btnMinus.addEventListener("click", () => {
            if (qty > 0) {
                qty--;
                templateQty.textContent = qty;
                templateTotal.textContent = (unit * qty).toFixed(2);
                this.totalItems --
                this.totalAmount -= unit
                this.updateShoppingCart()
                updateCartItemQty(qty);
            }
        });
    }

    addNewItem(item) {
       //Clonar Template
       let template = document.querySelector('.item-line-table.hide').cloneNode(true);
       // remove classe hide
       template.classList.remove('hide');

       //manipular texto
       let templateId = template.querySelector(".id-value")
       let templateProduct = template.querySelector(".product-value")
       let templateUnit = template.querySelector(".price-value")
       let templateQty = template.querySelector(".qnt-value-div-total")
       let templateTotal = template.querySelector(".subtotal-value")

       
       // Preencher dados
        let unit = Number(item['unit']);
        let qty = Number(item['qty']);
        
        templateId.textContent = item['id']
        templateProduct.textContent = item['name'];
        templateUnit.textContent = unit;
        templateQty.textContent = qty;
        templateTotal.textContent = (unit * qty).toFixed(2);

       //Adicionando na lista de TASK:
       let tableBody = document.querySelector('#table-body');
       //Inserir na lista:
       tableBody.appendChild(template)

       //adiciona eventos as tasks:
       this.addQntEvent(template,unit);
    
    //    this.cartItems.push(item)

    } 

    inicializeTable() {
        for (let item of this.cartItems) {
            this.addNewItem(item)
        }
    }

    updateClassByScroll() {
        const wrapper = document.getElementById('page-wrapper');
        const scrollHeight = document.documentElement.scrollHeight;
        const bodyHeight = window.innerHeight;

        if (scrollHeight > bodyHeight) {
            wrapper.classList.remove('no-scroll');
            wrapper.classList.add('scroll');
        } else {
           wrapper.classList.remove('scroll');
            wrapper.classList.add('no-scroll'); 
        }
    }
}

// Para que o resize funcione preciso envolver meu código no DOM


document.addEventListener("DOMContentLoaded", function () {
    let itemsToAdd = [
        {id: 1, name: 'T-Shirt', qty: 0, unit: 20},
        {id: 2, name: 'Pants', qty: 0, unit: 50},
    ];

    let storeCart = new StoreCart(itemsToAdd);

    // Atualiza o texto do cabeçalho baseado no tamanho da tela
    // Atualiza também a disposição do body com base na existência ou não de scroll
    storeCart.updateTableHeadText();
    storeCart.updateClassByScroll();
    window.addEventListener("resize", storeCart.updateTableHeadText.bind(storeCart));
    window.addEventListener("resize", storeCart.updateClassByScroll.bind(storeCart));

    // Inicializa a tabela com os itens
    storeCart.inicializeTable();

    // Eventos dos botões
    let newItemBtn = document.querySelector("#btn-new-item");
    let validateNewItemBtn = document.querySelector("#btn-new-item-validate");

    newItemBtn.addEventListener('click', function () {
        storeCart.displayNewItemArea();
    });

    validateNewItemBtn.addEventListener('click', function () {
        storeCart.validateNewItem();
    });
});