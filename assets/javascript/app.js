const baseUrl = "https://solkilde-api.annikavekso.com/wp-json/wp/v2/posts"

const produktListeContainerEl = document.querySelector(".produktContainer")
const produktListeIndexContainerEl = document.querySelector(".produktContainer.index")

const filterBtnEl = document.querySelector(".filterBtn")
const filterContainernEl = document.querySelector(".filterContainer")
const toggleEls = document.querySelectorAll(".toggle")
const navEl = document.querySelector("nav")
const footerEl = document.querySelector("footer")

/************************************
KALD AF FUNKTIONERNE
*************************************/
if (produktListeIndexContainerEl) {
    hentProdukter(produktListeContainerEl, 4)
}

/************************************
HENT PRODUKTER PÅ FORSKELLIGE MÅDER
*************************************/

/* Hent alle produkter og tag en placering ind */
function hentProdukter(placering, antal) {
    fetch(baseUrl + "?per_page=" + antal)
        .then(res => res.json())
        .then(data => {
            data.forEach(produkt => renderPreviewProdukt(produkt, placering)) /* For hvert object i datet, kør funktionen til at rendere preview af en produkt/produkt card. */
            console.log("her")
        })
        .catch(err => console.log("Noget gik galt: " + err));

}

/************************************
DYNAMISK OPSÆTNING AF HTML
*************************************/

/* Render preview til en produkt / produkt card */
function renderPreviewProdukt(produkt, placering) {
    let previewBillede;
    if (produkt.acf.billeder.billede_1 !== false) {
        previewBillede = produkt.acf.billeder.billede_1.sizes.medium;
    } else {
        previewBillede = "";
    }
    /* Brug innerHTML på placeringen sat i funktions kaldet til at indsætte indholdet */
    placering.innerHTML += ` 
                       <article class="produktPreview">
                    <a href="./produkt-side.html?id=${produkt.id}">
                        <img src="${previewBillede}" alt="${produkt.acf.billeder.billede_1.alt}" >
                        <h3>${produkt.title.rendered}</h3>
                    </a>
                </article>

            </div>`
}
