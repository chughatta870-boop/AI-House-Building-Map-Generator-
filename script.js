/* ==========================================
   AI House Building Map Generator PWA
   script.js - Part 1
========================================== */


/* ---------- APP INITIALIZATION ---------- */

document.addEventListener("DOMContentLoaded", () => {

    console.log("AI House Map Generator Started");

    initializeApp();

});


function initializeApp(){

    setupCanvas();

    setupTheme();

    setupInstallButton();

}


/* ---------- DOM SELECTORS ---------- */

const getElement = (id)=>{

    return document.getElementById(id);

};


/* ---------- CANVAS SETUP ---------- */

let canvas;
let ctx;

let zoomLevel = 1;

let showGrid = true;

let showLabels = true;


function setupCanvas(){

    canvas = getElement("floorPlanCanvas");

    if(!canvas){

        console.log("Canvas not found");

        return;

    }


    ctx = canvas.getContext("2d");


    drawEmptyCanvas();

}



function drawEmptyCanvas(){

    if(!ctx) return;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.font="20px Arial";

    ctx.fillStyle="#1565c0";

    ctx.fillText(
        "AI Floor Plan Preview",
        40,
        50
    );


}



/* ---------- THEME SYSTEM ---------- */


function setupTheme(){

    const themeBtn =
    getElement("themeBtn");


    if(themeBtn){

        themeBtn.addEventListener(
            "click",
            toggleTheme
        );

    }


}



function toggleTheme(){

    document.body.classList.toggle(
        "dark"
    );


    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );

}



function loadTheme(){

    const savedTheme =
    localStorage.getItem("theme");


    if(savedTheme==="dark"){

        document.body.classList.add("dark");

    }

}



loadTheme();



/* ---------- PWA INSTALL ---------- */


let deferredPrompt;


function setupInstallButton(){

    const installBtn =
    getElement("installBtn");


    window.addEventListener(
        "beforeinstallprompt",
        (event)=>{

            event.preventDefault();

            deferredPrompt = event;


            if(installBtn){

                installBtn.style.display="block";

            }

        }
    );


    if(installBtn){

        installBtn.addEventListener(
            "click",
            async()=>{


                if(!deferredPrompt){

                    alert(
                    "Install option not available yet"
                    );

                    return;

                }


                deferredPrompt.prompt();


                await deferredPrompt.userChoice;


                deferredPrompt=null;


            }
        );

    }

}



/* ---------- BASIC APP DATA ---------- */


let houseProject = {

    name:"",

    owner:"",

    plot:{},

    rooms:{},

    design:{},

    created:
    new Date().toISOString()

};



console.log(
"App Ready",
houseProject
);
