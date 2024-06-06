const baseUrl = "https://solkilde-api.annikavekso.com/wp-json/wp/v2/posts"

const produktListeContainerEl = document.querySelector(".produktContainer")
const produktListeFavContainerEl = document.querySelector(".produktContainer.favoritter")
const produktListeMoblerContainerEl = document.querySelector(".produktContainer.mobler")
const produktListeBoligdekorationContainerEl = document.querySelector(".produktContainer.boligdekoration")
const produktSideMobilContainerEL = document.querySelector(".produktsideContainerMobil")
const produktRelateredeContainerEl = document.querySelector(".produktContainer.relateredeProdukter")


const closeMenuBtnEl = document.querySelector("nav .mobilMenu button")
const openMenuBtnEl = document.querySelector("nav .menu ")
const mobilMenuEl = document.querySelector("nav .mobilMenu")
const inputEl = document.querySelectorAll(".input");
const filterBtnEl = document.querySelector(".filterBtn")
const filterContainernEl = document.querySelector(".filterContainer")
const toggleEls = document.querySelectorAll(".toggle")
const footerEl = document.querySelector("footer")

/* Variable der kigger query-parametere i url/search-baren i det aktuelle vindue/tab */
const urlParams = new URLSearchParams(window.location.search);
/* Variable der sætter et id, ud fra hvad der står efter "id" i url/search baren */
const id = urlParams.get('id');

/************************************
KALD AF FUNKTIONERNE
*************************************/
if (produktListeFavContainerEl) {
    hentProdukter(produktListeContainerEl, "34,37", 4)
}
if (produktListeMoblerContainerEl) {
    hentProdukter(produktListeMoblerContainerEl, "34", 9)
}
if (produktListeBoligdekorationContainerEl) {
    hentProdukter(produktListeBoligdekorationContainerEl, "37", 9)
}
if (produktSideMobilContainerEL) {
    hentProdukt(id, produktSideMobilContainerEL)
}
if (produktRelateredeContainerEl) {
    hentProdukter(produktRelateredeContainerEl, "34,37", 4)
}

if (footerEl) {
    renderFooter();
}

/************************************
EVENTHANDLER
*************************************/
closeMenuBtnEl.addEventListener("click", event => {
    mobilMenuEl.classList.toggle("hidden")
})
openMenuBtnEl.addEventListener("click", event => {
    mobilMenuEl.classList.toggle("hidden")
})

for (let index = 0; index < inputEl.length; index++) {
    let currentLabel = inputEl[index].parentElement.firstElementChild;
    inputEl[index].addEventListener("focus", function () {
        currentLabel.classList.add("move-up");
    });

}
for (let index = 0; index < inputEl.length; index++) {
    let currentLabel = inputEl[index].parentElement.firstElementChild;
    inputEl[index].addEventListener("blur", function () {
        currentLabel.classList.remove("move-up");
    });

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
function hentProdukt(produktId, placering) {
    fetch(baseUrl + "/" + produktId) /* Fetch link med id fra den specefikke produkt vi ønsker at hente.  */
        .then(res => res.json())
        .then(data => {
            renderFuldProdukt(data, placering) /* Kald funktionen der renderer en produkt med dataet der bliver fetchet og hvor den skal placeres på siden  */
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

function renderFuldProdukt(produkt, placering) {
    let certificeringsIndhold;
    let behandlingsIndhold;
    if (produkt.acf.plantageteak !== "Nej") {
        certificeringsIndhold = `<div class="teak"><div class="imgContainer">
<img src="./assets/img/certificering.png" alt=""></div>
<a href="./om-os.html#fremstilling">Lavet af plantageteak</a>
</div>`
        behandlingsIndhold = `<p>Hvis produktet skal stå ude, og du ønsker at bevare farven, giv produktet olie 1-2 gang årligt.
<a href="./om-os.html#behandlingOgPleje">Læs mere om behandling.</a>
</p>`
    } else {
        certificeringsIndhold = "";
        behandlingsIndhold = "";
    }

    placering.innerHTML += ` <div class="imgContainer"><img src="${produkt.acf.billeder.billede_1.sizes.medium}" alt="${produkt.acf.billeder.billede_1.alt}"></div>
    <div class="produktInfo">
<h1>${produkt.title.rendered}</h1>
<p class="pris">${produkt.acf.pris}</p>
<div class="size">
    <p>Bredde ${produkt.acf.bredde}</p>
    <p>Dybde ${produkt.acf.dybde}</p>
    <p>Højde ${produkt.acf.hojde}</p>
</div>
${certificeringsIndhold}
<p>${produkt.acf.beskrivelse}</p>
${behandlingsIndhold}

</div>`
}


function renderFooter() {
    footerEl.innerHTML += `
    <a href="./index.html" class="logo">Solkilde</a>
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

/* Opdater titlen i tabsene  */
function opdaterTabTitle(title) {
    /* Fang title tagget og sæt den tekst lige med parameteret/titlen der bliver sat når funktionen bliver kaldt.*/
    document.querySelector("title").textContent = title

}
