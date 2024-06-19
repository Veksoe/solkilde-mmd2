const baseUrl = "https://solkilde-api.annikavekso.com/wp-json/wp/v2/posts";

const produktListeContainerEl = document.querySelector(".produktContainer");
const produktListeFavContainerEl = document.querySelector(".produktContainer.favoritter");
const produktListeMoblerContainerEl = document.querySelector(".produktContainer.mobler");
const produktListeBoligdekorationContainerEl = document.querySelector(".produktContainer.boligdekoration");
const produktSideMobilContainerEL = document.querySelector(".produktsideContainerMobil");
const produktRelateredeContainerEl = document.querySelector(".produktContainer.relateredeProdukter");

const closeMenuBtnEl = document.querySelector("nav .mobilMenu button");
const closeFilterBtnEl = document.querySelector(".filterBox button");
const openMenuBtnEl = document.querySelector("nav .menu ");
const mobilMenuEl = document.querySelector("nav .mobilMenu");
const filterBoxEl = document.querySelector(".filterBox");

const inputEl = document.querySelectorAll(".input");
const filterMobelBtnEl = document.querySelector("#mobler");
const filterDekorationBtnEl = document.querySelector("#dekorationer");
const seFlereMoblerBtn = document.querySelector(".produkter.mobler button");
const seFlereBoligdekorationBtn = document.querySelector(".produkter.boligdekoration button");
const filterContainernEl = document.querySelector(".filterContainer");
const toggleEls = document.querySelectorAll(".toggle");
const footerEl = document.querySelector("footer");

/* Variable der kigger query-parametere i url/search-baren i det aktuelle vindue/tab */
const urlParams = new URLSearchParams(window.location.search);
/* Variable der sætter et id, ud fra hvad der står efter "id" i url/search baren */
const id = urlParams.get("id");

/* Array til at holde produkter der er hentet */
let hentetProdukter = [];

/************************************
KALD AF FUNKTIONERNE
*************************************/
if (produktListeFavContainerEl) {
    hentProdukter(produktListeFavContainerEl, "34,37", 4, 0, "35", "", "", "", "", "", "");
}
if (produktListeMoblerContainerEl) {
    hentProdukter(produktListeMoblerContainerEl, "34", 9, hentetProdukter.length);
}
if (produktListeBoligdekorationContainerEl) {
    hentProdukter(produktListeBoligdekorationContainerEl, "37", 9, hentetProdukter.length);
}
if (produktSideMobilContainerEL) {
    hentProduktside(id, produktSideMobilContainerEL);
}
if (produktRelateredeContainerEl) {
    hentProdukter(produktRelateredeContainerEl, "34,37", 4, hentetProdukter.length);
}
if (footerEl) {
    renderFooter();
}

/************************************
EVENTHANDLER
*************************************/
closeMenuBtnEl.addEventListener("click", (event) => {
    mobilMenuEl.classList.toggle("hidden");
});
openMenuBtnEl.addEventListener("click", (event) => {
    mobilMenuEl.classList.toggle("hidden");
});
if (filterMobelBtnEl) {
    filterMobelBtnEl.addEventListener("click", (event) => {
        filterBoxEl.classList.remove("hidden");
    });
    closeFilterBtnEl.addEventListener("click", (event) => {
        filterBoxEl.classList.add("hidden");
    });
}
if (filterDekorationBtnEl) {
    filterDekorationBtnEl.addEventListener("click", (event) => {
        filterBoxEl.classList.remove("hidden");
    });
    closeFilterBtnEl.addEventListener("click", (event) => {
        filterBoxEl.classList.add("hidden");
    });
}

if (seFlereMoblerBtn) {
    seFlereMoblerBtn.addEventListener("click", () => {
        filterMobelProdukter(produktListeMoblerContainerEl);
    });
}
if (seFlereBoligdekorationBtn) {
    seFlereBoligdekorationBtn.addEventListener("click", (event) => {
        filterDekorationsProdukter(produktListeBoligdekorationContainerEl);
        ;
    });
}

for (let index = 0; index < inputEl.length; index++) {
    let currentLabel = inputEl[index].parentElement.firstElementChild;
    inputEl[index].addEventListener("focus", function () {
        currentLabel.classList.add("moveUp");
    });
}
for (let index = 0; index < inputEl.length; index++) {
    let currentLabel = inputEl[index].parentElement.firstElementChild;
    inputEl[index].addEventListener("blur", function () {
        currentLabel.classList.remove("moveUp");
    });
}
if (toggleEls && filterMobelBtnEl) {
    toggleEls.forEach((toggle) => {
        toggle.addEventListener("change", () => {
            /* Fjern hvad der står i placeringen i øjeblikket */
            produktListeContainerEl.innerHTML = "";
            hentetProdukter = [];
            filterMobelProdukter(produktListeContainerEl);
        }
        );
    });
}
if (toggleEls && filterDekorationBtnEl) {
    toggleEls.forEach((toggle) => {
        toggle.addEventListener("change", () => {
            /* Fjern hvad der står i placeringen i øjeblikket */
            produktListeContainerEl.innerHTML = "";
            hentetProdukter = [];
            filterDekorationsProdukter(produktListeContainerEl);
        }
        );
    });
}

/************************************
HENT PRODUKTER PÅ FORSKELLIGE MÅDER
*************************************/

/* Hent alle produkter og tag en placering, en kategori, et antal og et offset ind */
function hentProdukter(placering, kategori, antal, offset, favoritter, bredde, dybde, fremstillingsmetode,
    hojde, pris, produkt_type) {

    /* Variable til at holde url'et til filtreringen af produkter */
    let filteretUrl = baseUrl + "?categories=" + kategori + "&per_page=" + antal + "&offset=" + offset;
    /* Variable til at holde det vi vil filtere ud fra */
    let query = "";

    /* Tjekker om vi sætter noget i parameteret */
    if (bredde && bredde.length !== 0) {
        /* Hvis den er sat, ligger vi det til vores query variable, sammen med teksten til den kategori */
        query += "&bredde=" + bredde;
    }

    if (dybde && dybde.length !== 0) {
        query += "&dybde=" + dybde;
    }
    if (favoritter && favoritter.length !== 0) {
        query += "&favoritter=" + favoritter;
    }
    if (fremstillingsmetode && fremstillingsmetode.length !== 0) {
        query += "&fremstillingsmetode=" + fremstillingsmetode;
    }

    if (hojde && hojde.length !== 0) {
        query += "&hojde=" + hojde;
    }
    if (pris && pris.length !== 0) {
        query += "&pris=" + pris;
    }

    if (produkt_type && produkt_type.length !== 0) {
        query += "&produkt_type=" + produkt_type;
    }

    fetch(filteretUrl + query)
        .then((res) => res.json())
        .then((data) => {
            hentetProdukter = hentetProdukter.concat(data);

            /* Tjek om længden af det der bliver hentet, er det samme som det antal vi har sat i antal-parameteren */
            if (data.length !== antal) {
                /* Hvis det ikke er ens, tjek om der er en seFlere-button på siden, og så sæt display=none på knappen. */
                if (seFlereMoblerBtn) {
                    seFlereMoblerBtn.style.display = "none"
                }
                if (seFlereBoligdekorationBtn) {
                    seFlereBoligdekorationBtn.style.display = "none"
                }
            } else {
                if (seFlereMoblerBtn) {
                    seFlereMoblerBtn.style.display = "flex"
                }
                if (seFlereBoligdekorationBtn) {
                    seFlereBoligdekorationBtn.style.display = "flex"
                }
            }
            if (hentetProdukter.length === 0 && data.length === 0) {
                /* Hvis der ikke er noget data  sæt teksten ind i placeringen sat i functions kaldet */
                placering.innerHTML += `<p>Der er desværre ingen produkter der matcher dit valg</p>`;
            } else {
                /* Tag arrayet med hentet produkter, og sæt det sammen med det data der bliver hentet. */
                data.forEach((produkt) =>
                    /* Hvis der er noget data kør kør funktionen til at rendere preview af en produkt/produkt card for hver data */
                    renderPreviewProdukt(produkt, placering)
                );
            }

        })
        .catch((err) => console.log("Noget gik galt: " + err));
}

/* Hent et produkt og tag et id og en placering ind */
function hentProduktside(produktId, placering) {
    /* Fetch link med id fra den specefikke produkt vi ønsker at hente.  */
    fetch(baseUrl + "/" + produktId)
        .then((res) => res.json())
        .then((data) => {
            /* Kald funktionen der renderer en produkt med dataet der bliver fetchet og hvor den skal placeres på siden  */
            renderFuldProdukt(data, placering);
        })
        .catch((err) => console.log("Noget gik galt: " + err));
}


/************************************
FILTERING AF PRODUKTER
*************************************/

/* Filtrer produkt i møbler og tag en placering */
function filterMobelProdukter(placering) {
    /* Variablen med tomt array til at holde taxonomier i den aktuelle kategori */
    let tilladtBredder = [];
    let tilladtDybder = [];
    let tilladtHojder = [];
    let tilladtPriser = [];
    let tilladtFremstilling = [];
    let tilladtType = [];

    /* Hvis elementet i HTMLet med et bestemt id er checked */
    if (document.querySelector("#breddeUnder50MobelFilter").checked ||
        document.querySelector("#breddeUnder50MobelFilterDesktop").checked) {
        /* Hvis den er checked, indsæt dens værdi i det aktuelle array */
        tilladtBredder.push(
            document.querySelector("#breddeUnder50MobelFilter").value
        );
    }
    if (document.querySelector("#bredde50-100MobelFilter").checked || document.querySelector("#bredde50-100MobelFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde50-100MobelFilter").value
        );
    }
    if (document.querySelector("#bredde101-150MobelFilter").checked || document.querySelector("#bredde101-150MobelFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde101-150MobelFilter").value
        );
    }
    if (document.querySelector("#bredde151-200MobelFilter").checked || document.querySelector("#bredde151-200MobelFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde151-200MobelFilter").value
        );
    }

    if (document.querySelector("#dybdeUnder50MobelFilter").checked || document.querySelector("#dybdeUnder50MobelFilterDesktop").checked) {
        tilladtDybder.push(
            document.querySelector("#dybdeUnder50MobelFilter").value
        );
    }
    if (document.querySelector("#dybde50-100MobelFilter").checked || document.querySelector("#dybde50-100MobelFilterDesktop").checked) {
        tilladtDybder.push(document.querySelector("#dybde50-100MobelFilter").value);
    }
    if (document.querySelector("#dybde101-150MobelFilter").checked || document.querySelector("#dybde101-150MobelFilterDesktop").checked) {
        tilladtDybder.push(
            document.querySelector("#dybde101-150MobelFilter").value
        );
    }

    if (document.querySelector("#hojdeUnder50MobelFilter").checked || document.querySelector("#hojdeUnder50MobelFilterDesktop").checked) {
        tilladtHojder.push(
            document.querySelector("#hojdeUnder50MobelFilter").value
        );
    }
    if (document.querySelector("#hojde50-100MobelFilter").checked || document.querySelector("#hojde50-100MobelFilterDesktop").checked) {
        tilladtHojder.push(document.querySelector("#hojde50-100MobelFilter").value);
    }
    if (document.querySelector("#hojde101-150MobelFilter").checked) {
        tilladtHojder.push(
            document.querySelector("#hojde101-150MobelFilter").value
        );
    }

    if (document.querySelector("#prisUnder500MobelFilter").checked || document.querySelector("#prisUnder500MobelFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#prisUnder500MobelFilter").value
        );
    }
    if (document.querySelector("#pris500-1000MobelFilter").checked || document.querySelector("#pris500-1000MobelFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris500-1000MobelFilter").value
        );
    }
    if (document.querySelector("#pris1001-2000MobelFilter").checked || document.querySelector("#pris1001-2000MobelFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris1001-2000MobelFilter").value
        );
    }
    if (document.querySelector("#pris2001-4000MobelFilter").checked || document.querySelector("#pris2001-4000MobelFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris2001-4000MobelFilter").value
        );
    }
    if (document.querySelector("#pris4001-6000MobelFilter").checked || document.querySelector("#pris4001-6000MobelFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris4001-6000MobelFilter").value
        );
    }

    if (document.querySelector("#handlavetMobelFilter").checked || document.querySelector("#handlavetMobelFilterDesktop").checked) {
        tilladtFremstilling.push(
            document.querySelector("#handlavetMobelFilter").value
        );
    }
    if (document.querySelector("#masseproduceretMobelFilter").checked || document.querySelector("#masseproduceretMobelFilterDesktop").checked) {
        tilladtFremstilling.push(
            document.querySelector("#masseproduceretMobelFilter").value
        );
    }

    if (document.querySelector("#stolFilter").checked || document.querySelector("#stolFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#stolFilter").value);
    }
    if (document.querySelector("#benkFilter").checked || document.querySelector("#benkFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#benkFilter").value);
    }
    if (document.querySelector("#bordFilter").checked || document.querySelector("#bordFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#bordFilter").value);
    }
    if (document.querySelector("#multiFilter").checked || document.querySelector("#multiFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#multiFilter").value);
    }

    /* Kør funktionen der henter produkter ud fra taxonomier, og indsæt variablerne med de 
    valgte/tilladte felter der er blevet checked, sammen med antallet der skal vises og 
    hvor det skal vises. */
    hentProdukter(placering, "34", 9, hentetProdukter.length, "", tilladtBredder, tilladtDybder, tilladtFremstilling,
        tilladtHojder, tilladtPriser, tilladtType);
}
/* Filtrer produkt i dekorationer og tag en placering */
function filterDekorationsProdukter(placering) {

    let tilladtBredder = []; /* Variablen med tomt array til at holde taxonomier i den aktuelle kategori */
    let tilladtDybder = [];
    let tilladtHojder = [];
    let tilladtPriser = [];
    let tilladtFremstilling = [];
    let tilladtType = [];

    /* Hvis elementet i HTMLet med et bestemt id er checked */
    if (document.querySelector("#breddeUnder50DekoFilter").checked || document.querySelector("#breddeUnder50DekoFilterDesktop").checked) {
        /* Hvis den er checked, indsæt dens værdi i det aktuelle array */
        tilladtBredder.push(
            document.querySelector("#breddeUnder50DekoFilter").value
        );
    }
    if (document.querySelector("#bredde50-100DekoFilter").checked || document.querySelector("#bredde50-100DekoFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde50-100DekoFilter").value
        );
    }
    if (document.querySelector("#bredde101-150DekoFilter").checked || document.querySelector("#bredde101-150DekoFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde101-150DekoFilter").value
        );
    }
    if (document.querySelector("#bredde151-200DekoFilter").checked || document.querySelector("#bredde151-200DekoFilterDesktop").checked) {
        tilladtBredder.push(
            document.querySelector("#bredde151-200DekoFilter").value
        );
    }

    if (document.querySelector("#dybdeUnder50DekoFilter").checked || document.querySelector("#dybdeUnder50DekoFilterDesktop").checked) {
        tilladtDybder.push(document.querySelector("#dybdeUnder50DekoFilter").value);
    }
    if (document.querySelector("#dybde50-100DekoFilter").checked || document.querySelector("#dybde50-100DekoFilterDesktop").checked) {
        tilladtDybder.push(document.querySelector("#dybde50-100DekoFilter").value);
    }
    if (document.querySelector("#dybde101-150DekoFilter").checked || document.querySelector("#dybde101-150DekoFilterDesktop").checked) {
        tilladtDybder.push(document.querySelector("#dybde101-150DekoFilter").value);
    }

    if (document.querySelector("#hojdeUnder50DekoFilter").checked || document.querySelector("#hojdeUnder50DekoFilterDesktop").checked) {
        tilladtHojder.push(document.querySelector("#hojdeUnder50DekoFilter").value);
    }
    if (document.querySelector("#hojde50-100DekoFilter").checked || document.querySelector("#hojde50-100DekoFilterDesktop").checked) {
        tilladtHojder.push(document.querySelector("#hojde50-100DekoFilter").value);
    }
    if (document.querySelector("#hojde101-150DekoFilter").checked || document.querySelector("#hojde101-150DekoFilterDesktop").checked) {
        tilladtHojder.push(document.querySelector("#hojde101-150DekoFilter").value);
    }

    if (document.querySelector("#prisUnder500DekoFilter").checked || document.querySelector("#prisUnder500DekoFilterDesktop").checked) {
        tilladtPriser.push(document.querySelector("#prisUnder500DekoFilter").value);
    }
    if (document.querySelector("#pris500-1000DekoFilter").checked || document.querySelector("#pris500-1000DekoFilterDesktop").checked) {
        tilladtPriser.push(document.querySelector("#pris500-1000DekoFilter").value);
    }
    if (document.querySelector("#pris1001-2000DekoFilter").checked || document.querySelector("#pris1001-2000DekoFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris1001-2000DekoFilter").value
        );
    }
    if (document.querySelector("#pris2001-4000DekoFilter").checked || document.querySelector("#pris2001-4000DekoFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris2001-4000DekoFilter").value
        );
    }
    if (document.querySelector("#pris4001-6000DekoFilter").checked || document.querySelector("#pris4001-6000DekoFilterDesktop").checked) {
        tilladtPriser.push(
            document.querySelector("#pris4001-6000DekoFilter").value
        );
    }

    if (document.querySelector("#handlavetDekoFilter").checked || document.querySelector("#handlavetDekoFilterDesktop").checked) {
        tilladtFremstilling.push(
            document.querySelector("#handlavetDekoFilter").value
        );
    }
    if (document.querySelector("#masseproduceretDekoFilter").checked || document.querySelector("#masseproduceretDekoFilterDesktop").checked) {
        tilladtFremstilling.push(
            document.querySelector("#masseproduceretDekoFilter").value
        );
    }

    if (document.querySelector("#tekstilFilter").checked || document.querySelector("#tekstilFilterDesktop").checked) {
        console.log(document.querySelector("#tekstilFilter").value)
        tilladtType.push(document.querySelector("#tekstilFilter").value);
    }
    if (document.querySelector("#bakkerOgFadeFilter").checked || document.querySelector("#bakkerOgFadeFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#bakkerOgFadeFilter").value);
    }
    if (document.querySelector("#kokkentilbehorFilter").checked || document.querySelector("#kokkentilbehorFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#kokkentilbehorFilter").value);
    }
    if (document.querySelector("#boligdekorationFilter").checked || document.querySelector("#boligdekorationFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#boligdekorationFilter").value);
    }
    if (document.querySelector("#skulpturFilter").checked || document.querySelector("#skulpturFilterDesktop").checked) {
        tilladtType.push(document.querySelector("#skulpturFilter").value);
    }

    /* Kør funktionen der henter produkter ud fra taxonomier, og indsæt variablerne med de valgte/tilladte felter der er blevet checked, sammen med antallet der skal vises og hvor det skal vises. */
    hentProdukter(placering, "37", 9, hentetProdukter.length, "", tilladtBredder, tilladtDybder, tilladtFremstilling,
        tilladtHojder, tilladtPriser, tilladtType);
}

/************************************
DYNAMISK OPSÆTNING AF HTML
*************************************/

/* Render preview til en produkt / produkt card */
function renderPreviewProdukt(produkt, placering) {
    let previewBillede;
    /* Tjek at der er noget sat i billede_1 */
    if (produkt.acf.billeder.billede_1 !== false) {
        /* Hvis der er noget sat, gem htmlen for billedet og hent billeder fra produkt-parameteren i en variable. */
        previewBillede = `
        <img srcset="${produkt.acf.billeder.billede_1.sizes.medium} 300w, 
                     ${produkt.acf.billeder.billede_1.sizes.large} 1024w"
        sizes="(max-width: 650px)  300px, 1024px"
        src="${produkt.acf.billeder.billede_1.sizes.medium}" alt="${produkt.acf.billeder.billede_1.alt}" >`;
    } else {
        /* Hvis den ikke er sat, sæt variablen til at være med en tom string.*/
        previewBillede = "";
    }
    /* Brug innerHTML på placeringen sat i funktions kaldet til at indsætte indholdet */
    /* Indsæt variablen til preview billede samt indhold hentet fra produkt-parameteren */
    placering.innerHTML += ` 
            <article class="produktPreview">
                 <a href="./produkt-side.html?id=${produkt.id}">
                    ${previewBillede}
                    <h3>${produkt.title.rendered}</h3>
                 </a>
             </article>`;
}

function renderFuldProdukt(produkt, placering) {

    let certificeringsIndhold;
    let behandlingsIndhold;
    /* Tjek om produktet sat i parameteren har værdien "nej" i plantageteak*/
    if (produkt.acf.plantageteak !== "Nej") {
        /* Hvis der ikke står nej, gem HTMLen i variablerne */
        certificeringsIndhold = `
        <div class="teak"><div class="imgContainer">
            <img src="./assets/img/certificering.png" alt=""></div>
            <a href="./om-os.html#fremstilling">Lavet af plantageteak</a>
        </div>`;
        behandlingsIndhold = `
        <p>Hvis produktet skal stå ude, og du ønsker at bevare farven, giv produktet olie 1-2 gang årligt.
          <a href="./om-os.html#behandlingOgPleje">Læs mere om behandling.</a>
        </p>`;
    } else {
        /* Hvis der står nej, gem en tom string i variablerne */
        certificeringsIndhold = "";
        behandlingsIndhold = "";
    }

    let ekstrabillede1;
    let ekstrabillede2;
    let ekstrabillede3;
    let ekstrabillede4;
    let ekstrabillede5;
    /* Tjek at der er noget sat i billede_2 */
    if (produkt.acf.billeder.billede_2) {
        /* Hvis der er noget sat, gem htmlen for billedet og hent billedet fra produkt-parameteren i en variable. */
        ekstrabillede1 = `
        <img src="${produkt.acf.billeder.billede_2.sizes.medium}" 
        alt="${produkt.acf.billeder.billede_2.alt}">`
    } else {
        /* Hvis den ikke er sat, sæt variablen til at være med en tom string.*/
        ekstrabillede1 = ""
    }
    if (produkt.acf.billeder.billede_3) {
        ekstrabillede2 = `
        <img src="${produkt.acf.billeder.billede_3.sizes.medium}" 
        alt="${produkt.acf.billeder.billede_3.alt}">`
    } else {
        ekstrabillede2 = ""
    }
    if (produkt.acf.billeder.billede_4) {
        ekstrabillede3 = `
        <img src="${produkt.acf.billeder.billede_4.sizes.medium}" 
        alt="${produkt.acf.billeder.billede_4.alt}">`
    } else {
        ekstrabillede3 = ""
    }
    if (produkt.acf.billeder.billede_5) {
        ekstrabillede4 = `
        <img src="${produkt.acf.billeder.billede_5.sizes.medium}" 
        alt="${produkt.acf.billeder.billede_5.alt}">`
    } else {
        ekstrabillede4 = ""
    }
    if (produkt.acf.billeder.billede_6) {
        ekstrabillede5 = `
        <img src="${produkt.acf.billeder.billede_6.sizes.medium}" 
        alt="${produkt.acf.billeder.billede_6.alt}">`
    } else {
        ekstrabillede5 = ""
    }

    placering.innerHTML += ` 
   <div class="produktImgContainer">
    <div class="imgContainer mainImg">
        <img  srcset="${produkt.acf.billeder.billede_1.sizes.medium_large} 700w, 
        ${produkt.acf.billeder.billede_1.sizes.large} 950w"
        sizes="(max-width: 600px)  700px, 950px"
        src="${produkt.acf.billeder.billede_1.sizes.medium_large}" 
        alt="${produkt.acf.billeder.billede_1.alt}">
    </div>
    <div class="imgsContainer">
        ${ekstrabillede1}
        ${ekstrabillede2}
        ${ekstrabillede3}
        ${ekstrabillede4}
        ${ekstrabillede5}
            </div>
    </div>
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
    </div>`;
    /* Kør funktionen der opdatere titlen i tabben, og indsæt prduktet titel */
    opdaterTabTitle(produkt.title.rendered + " - Solkilde");
}

/* Render footeren */
function renderFooter() {
    footerEl.innerHTML += `
    <div>
    <a href="./index.html" class="logo">Solkilde</a>
    <p>Åbent hver weekend og <br> helligdage fra 12-16 og efter aftale.</p>
    </div>
    <div class="kontakt">
    <div class="telefon">
        <i class="fa-solid fa-phone"></i><a href="tel:+4523951990">+45 2395
            1990</a><!--https://fontawesome.com/icons/phone?f=classic&s=solid-->
    </div>
    <div>
        <i class="fa-brands fa-instagram"></i> <a href="https://www.instagram.com/solkilde.tversted/">solkilde.tversted</a>
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
    </div>
`;
}

/* Opdater titlen i tabsene  */
function opdaterTabTitle(title) {
    /* Fang title tagget og sæt den tekst lige med parameteret/titlen der bliver sat når funktionen bliver kaldt.*/
    document.querySelector("title").textContent = title;
}
