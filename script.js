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
/* ==========================================
   script.js - Part 2
   Form Data + Project Builder
========================================== */


/* ---------- SAFE VALUE FUNCTION ---------- */

function getValue(id){

    const element = getElement(id);

    if(element){

        return element.value;

    }

    return "";

}


function getNumber(id){

    const value = Number(getValue(id));

    return isNaN(value) ? 0 : value;

}


/* ---------- GET PLOT INFORMATION ---------- */


function getPlotInformation(){

    return {

        marla:getNumber("marla"),

        length:getNumber("length"),

        width:getNumber("width"),

        stories:getNumber("stories"),

        roadWidth:getNumber("roadWidth"),

        frontSpace:getNumber("frontSpace"),

        backSpace:getNumber("backSpace"),

        leftSpace:getNumber("leftSpace"),

        rightSpace:getNumber("rightSpace"),

        direction:
        document.querySelector(
        'input[name="direction"]:checked'
        )?.value || "North",

        corner:
        getElement("cornerPlot")?.checked || false,

        commercial:
        getElement("commercialFacing")?.checked || false,

        parkFacing:
        getElement("parkFacing")?.checked || false

    };

}



/* ---------- GET ROOMS INFORMATION ---------- */


function getRoomInformation(){

    return {

        bedrooms:getNumber("bedrooms"),

        masterBedrooms:getNumber("masterBedrooms"),

        kitchens:getNumber("kitchens"),

        washrooms:getNumber("washrooms"),

        drawingRooms:getNumber("drawingRooms"),

        tvLounges:getNumber("tvLounges"),

        diningRooms:getNumber("diningRooms"),

        guestRooms:getNumber("guestRooms"),

        garage:getNumber("garage"),

        garden:getNumber("garden"),

        storeRoom:getNumber("storeRoom"),

        studyRoom:getNumber("studyRoom"),

        prayerRoom:getNumber("prayerRoom"),

        servantRoom:getNumber("servantRoom"),

        stairs:getNumber("stairs"),

        lift:getNumber("lift"),

        balcony:getNumber("balcony"),

        terrace:getNumber("terrace")

    };

}



/* ---------- GET AI SETTINGS ---------- */


function getAISettings(){

    return {

        style:
        getValue("designStyle"),

        construction:
        getValue("constructionType"),

        view:
        getValue("viewMode"),

        floor:
        getValue("floorSelect"),


        optimize:
        getElement("optimizeRooms")?.checked || false,


        parking:
        getElement("maximizeParking")?.checked || false,


        garden:
        getElement("maximizeGarden")?.checked || false,


        light:
        getElement("naturalLight")?.checked || false,


        ventilation:
        getElement("crossVentilation")?.checked || false,


        energy:
        getElement("energySaving")?.checked || false,


        vastu:
        getElement("vastuMode")?.checked || false

    };

}



/* ---------- VALIDATION ---------- */


function validateProject(){

    const length =
    getNumber("length");


    const width =
    getNumber("width");


    const marla =
    getNumber("marla");


    if(
        length<=0 ||
        width<=0 ||
        marla<=0
    ){

        alert(
        "Please enter valid Plot Size, Length and Width"
        );

        return false;

    }


    return true;

}



/* ---------- BUILD PROJECT OBJECT ---------- */


function buildProject(){


    if(!validateProject()){

        return null;

    }


    houseProject = {


        name:
        getValue("projectName"),


        owner:
        getValue("ownerName"),


        city:
        getValue("city"),


        country:
        getValue("country"),


        plot:
        getPlotInformation(),


        rooms:
        getRoomInformation(),


        design:
        getAISettings(),


        updated:
        new Date().toISOString()


    };


    console.log(
    "Project Created",
    houseProject
    );


    return houseProject;

}



/* ---------- CONNECT GENERATE BUTTON ---------- */


const generateButton =
getElement("generateAI");


if(generateButton){

    generateButton.addEventListener(
        "click",
        ()=>{


            const project =
            buildProject();


            if(project){

                alert(
                "Project data ready for AI Layout Generation"
                );


            }


        }
    );

       }
/* ==========================================
   script.js - Part 3
   Smart AI Layout Generator
========================================== */


/* ---------- FLOOR PLAN DATA ---------- */

let generatedLayout = [];



/* ---------- AI LAYOUT GENERATOR ---------- */


function generateAILayout(){


    const project = buildProject();


    if(!project){

        return;

    }


    generatedLayout = [];


    const rooms = project.rooms;

    const plot = project.plot;



    let startX = 50;

    let startY = 80;


    let roomWidth = 180;

    let roomHeight = 120;



    // Scale adjustment according to plot size

    if(plot.length > 50){

        roomWidth = 220;

    }


    if(plot.width > 35){

        roomHeight = 150;

    }



    /* ---------- Bedrooms ---------- */


    for(
        let i=1;
        i<=rooms.bedrooms;
        i++
    ){

        addRoom(

            "Bedroom "+i,

            startX,

            startY,

            roomWidth,

            roomHeight

        );


        startX += roomWidth + 20;


        if(startX > 850){

            startX = 50;

            startY += roomHeight + 30;

        }

    }



    /* ---------- Kitchen ---------- */


    for(
        let i=1;
        i<=rooms.kitchens;
        i++
    ){

        addRoom(

            "Kitchen "+i,

            startX,

            startY,

            150,

            100

        );


        startX +=170;

    }



    /* ---------- Washrooms ---------- */


    for(
        let i=1;
        i<=rooms.washrooms;
        i++
    ){

        addRoom(

            "Washroom "+i,

            startX,

            startY,

            100,

            80

        );


        startX +=120;

    }



    /* ---------- Other Rooms ---------- */


    createExtraRooms(
        rooms,
        startX,
        startY
    );



    console.log(
        "AI Layout Generated",
        generatedLayout
    );


    drawFloorPlan();


}



/* ---------- ADD ROOM FUNCTION ---------- */


function addRoom(
    name,
    x,
    y,
    width,
    height
){

    generatedLayout.push({

        name:name,

        x:x,

        y:y,

        width:width,

        height:height

    });


}



/* ---------- EXTRA ROOMS ---------- */


function createExtraRooms(
    rooms,
    x,
    y
){


    const extras = [

        [
        "Drawing Room",
        rooms.drawingRooms
        ],

        [
        "TV Lounge",
        rooms.tvLounges
        ],

        [
        "Dining Room",
        rooms.diningRooms
        ],

        [
        "Guest Room",
        rooms.guestRooms
        ],

        [
        "Garage",
        rooms.garage
        ],

        [
        "Garden",
        rooms.garden
        ],

        [
        "Store",
        rooms.storeRoom
        ],

        [
        "Study Room",
        rooms.studyRoom
        ],

        [
        "Prayer Room",
        rooms.prayerRoom
        ]

    ];



    extras.forEach(item=>{


        let name=item[0];

        let count=item[1];


        for(
            let i=1;
            i<=count;
            i++
        ){

            addRoom(

                name+" "+i,

                x,

                y,

                160,

                100

            );


            x +=180;


            if(x>850){

                x=50;

                y+=130;

            }

        }


    });


}



/* ---------- GENERATE BUTTON ---------- */


const aiGenerateBtn =
getElement("generateAI");


if(aiGenerateBtn){

    aiGenerateBtn.addEventListener(
        "click",
        ()=>{

            generateAILayout();

        }
    );

       }
