const baseUrl = "https://solkilde-api.annikavekso.com/wp-json/wp/v2/posts"

const produktListeContainerEl = document.querySelector(".produktContainer")
const produktListeIndexContainerEl = document.querySelector(".produktContainer.index")
const produktListeMoblerContainerEl = document.querySelector(".produktContainer.mobler")
const produktListeBoligdekorationContainerEl = document.querySelector(".produktContainer.boligdekoration")

const filterBtnEl = document.querySelector(".filterBtn")
const filterContainernEl = document.querySelector(".filterContainer")
const toggleEls = document.querySelectorAll(".toggle")
const navEl = document.querySelector("nav")
const footerEl = document.querySelector("footer")

/************************************
KALD AF FUNKTIONERNE
*************************************/
if (produktListeIndexContainerEl) {
    hentProdukter(produktListeContainerEl, "34,37", 4)
}
if (produktListeMoblerContainerEl) {
    hentProdukter(produktListeMoblerContainerEl, "34", 9)
}
if (produktListeBoligdekorationContainerEl) {
    hentProdukter(produktListeBoligdekorationContainerEl, "37", 9)
}

if (footerEl) {
    renderFooter();
}
if (navEl) {
    renderNav();
}

/************************************
HENT PRODUKTER PÅ FORSKELLIGE MÅDER
*************************************/

/* Hent alle produkter og tag en placering ind */
function hentProdukter(placering, kategori, antal) {
    fetch(baseUrl + "?categories=" + kategori + "&per_page=" + antal)
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

function renderNav() {
    navEl.innerHTML += `
    <p class="logo">Solkilde</p>
    <button aria-label="menu"><i class="fa-solid fa-bars"></i></button>
    <!--https://fontawesome.com/icons/bars?f=classic&s=solid-->
`
}

function renderFooter() {
    footerEl.innerHTML += `
    <p class="logo">Solkilde</p>
    <p>Åbent hver weekend og <br> helligdage fra 12-16 og efter aftale.</p>
    <div class="telefon">
        <i class="fa-solid fa-phone"></i><a href="tel:+4523951990">+45 2395
            1990</a><!--https://fontawesome.com/icons/phone?f=classic&s=solid-->
    </div>
    <div>
        <i class="fa-brands fa-instagram"></i> <a href="">solkilde.tversted</a>
        <!--https://fontawesome.com/icons/instagram?f=brands&s=solid-->
    </div>
    <div>
        <i class="fa-regular fa-envelope"></i> <a
            href="mailto:solkilde.tversted@gmail.com ">solkilde.tversted@gmail.com </a>
        <!--https://fontawesome.com/icons/envelope?f=classic&s=regular-->
    </div>
    <div>
        <i class="fa-solid fa-store"></i>
        <address>Tannisbugtvej 103 <br>
            9881 Bindslev<br>
            Danmark</address> <!--https://fontawesome.com/icons/store?f=classic&s=solid-->
    </div>
    <div class="copyright">
        <i class="fa-regular fa-copyright"></i>
        <p>Solkilde</p> <!--https://fontawesome.com/icons/copyright?f=classic&s=regular-->
    </div>
`
}