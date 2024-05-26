//Declaramos una variable de ámbito global que contendrá el json

let myJson;

// Creamos una función que inserta las cards

function insertCards(json) {
    const $catalogo = document.getElementById("catalago");
    json.forEach(element => {
        //Se crea un fragmento en memoria para introduciar las cards
        const $fragmentCard = document.createDocumentFragment();

        //Creamos los elementos
        const $div = document.createElement("div")
        $div.id = "card_" + element.id;
        $div.classList.add("card")
        const $p = document.createElement("p");
        $p.classList.add("p")
        $p.textContent = element.title;
        $div.appendChild($p);
        const $pId = document.createElement("p");
        $pId.classList.add("pId")
        $pId.textContent = element.id;
        $div.appendChild($pId);
        const $a = document.createElement("a")
        $a.href = element.url
        $a.target = "_blank"
        $a.rel = "noopener noreferrer";
        $img = document.createElement("img");
        $img.src = element.thumbnailUrl
        $img.alt = element.title
        $a.appendChild($img)
        $div.appendChild($a);

        //Introducimos el div en el fragmento

        $fragmentCard.appendChild($div)

        //Introducimos el fragmento dentro del catálogo
        $catalogo.appendChild($fragmentCard);
    });

}

//Obtenemos el json através de una petición al servidor remoto

fetch('https://jsonplaceholder.typicode.com/albums/1/photos')
    //la respuesta es un json que se convierte en un array
    .then((response) => response.json())
    .then((json) => {

        //colocamos el array en la variable de ámbito global para poder acceder a ella
        myJson = json;

        /* 

            <select id="sort">
                <option value="asc" selected="selected">Ascendente</option>
                <option value="des">Descendente</option>
            </select>
            <select id="type">
                <option value="id" selected="selected" >Id</option>
                <option value="title">Título</option>
            </select>
   
        
        */
        // Se crea un fragmento en memoria donde se colocan los 2 selects (sort y type)
        const $fragmentSelects = document.createDocumentFragment();

        // Se crea un elemento select

        const $selectSort = document.createElement("select");
        $selectSort.id = "sort";

        //Se crea el optionsAsc y optionDesc y se introducen dentro del SelectSort

        const $optionAsc = document.createElement("option");
        $optionAsc.value = "asc";
        $optionAsc.textContent = "Ascendente"
        $optionAsc.selected = "selected";
        $selectSort.appendChild($optionAsc);

        const $optionDes = document.createElement("option");
        $optionDes.value = "des";
        $optionDes.textContent = "Descendente"
        $selectSort.appendChild($optionDes);

        //Se crea un selectType

        const $selectType = document.createElement("select");
        $selectType.id = "type";

        //Se crea el elemento optionID y optionTitle en memoria y se mete dentro del select
        const $optionId = document.createElement("option");
        $optionId.value = "id";
        $optionId.textContent = "Id"
        $optionId.selected = "selected";
        $selectType.appendChild($optionId);

        const $optionTitle = document.createElement("option");
        $optionTitle.value = "title";
        $optionTitle.textContent = "Título"
        $selectType.appendChild($optionTitle)

        //Introducimos los selects en el fragmento

        $fragmentSelects.appendChild($selectSort);
        $fragmentSelects.appendChild($selectType);

        //Introducimos el fragment dentro del elemento que hemos buscado por el ID

        document.getElementById("selects").appendChild($fragmentSelects)

        //Llamamos a la funcion insertCards


        insertCards(json);
    })
    // En caso de que haya un error entrará en el  catch
    .catch((e) => {
        console.log(e);
        const $p = document.createElement("p")
        $p.classList.add("err")
        $p.textContent = "Se ha producido un error, vuelva a intentarlo"
        $catalogo.appendChild($p);
    })

//Creamos un evento de escucha de tipo change con parámetro e (evento)   
document.addEventListener("change", (e) => {

    //Sólo debe entrar al condicional los elementos con ID sort o type
    if (e.target.id == "sort" || e.target.id == "type") {

        //obtenemos sus valores
        const sort = document.getElementById("sort").value;
        const type = document.getElementById("type").value;

        //Hacemos el proceso de ordenado del array según los valores type o sort

        let arraySort;
        if (type === "title") {
            arraySort = myJson.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                } else if (a.title == b.title) {
                    return 0;
                } else {
                    return -1;
                }
            })
            if (sort !== "asc") {
                arraySort = arraySort.reverse()
            }
        } else {
            arraySort = myJson.sort((a, b) => {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id == b.id) {
                    return 0;
                } else {
                    return -1;
                }
            })
            if (sort !== "asc") {
                arraySort = arraySort.reverse();
            }

        }

        //obtenemos el elemento con Id catálogo
        const catalogo = document.getElementById("catalago");

        //los hijos del elemento catálogo los eliminamos

        while (catalogo.hasChildNodes()) {
            catalogo.removeChild(catalogo.lastChild);
        }
        //document.getElementById("catalago").innerHTML = ""; alternativa no recomendada https://stackoverflow.com/questions/5402525/remove-all-child-nodes

        //Llamamos la función pasándole el array ordenado

        insertCards(arraySort);

    }

})

