// SCRIPT RESPONSÁVEL PELO SCORM

var scorm = pipwerks.SCORM;
scorm.version = "1.2";
var sco = true;
window.contVid = null;
var isLMS = true;
var isBarra = true;
var percentage = 0;

var data = {
    lessonLocation: "1",
    lessonStatus: "incomplete",
    scoreRaw: "0",
    suspendData: ""
}

this.iniciar = function() {
    if (sco) {
        isLMS = pipwerks.SCORM.init() ? true : false;
        if (isLMS) {
            sincronizar();
        }
    }
}

function sincronizar() {
    pipwerks.SCORM.set("cmi.core.score.min", "0");
    pipwerks.SCORM.set("cmi.core.score.max", "100");
    pipwerks.SCORM.set("cmi.core.score.raw", data.scoreRaw);
    pipwerks.SCORM.set("cmi.core.lesson_location", data.lessonLocation);
    pipwerks.SCORM.set("cmi.core.lesson_status", data.lessonStatus);
}

function setLocation(loc) {
    loc = Math.round(loc);
    data.lessonLocation = loc.toString();
    sincronizar();
    console.log("chamou setLocation" + loc);
}

function setScore(perc) {
    perc = Math.round(perc);
    if (perc == 100) {
        data.lessonStatus = "passed";
    } else {
        data.lessonStatus = "incomplete";
    }
    if (pipwerks.SCORM.get("cmi.core.lesson_status") == "passed") {
        data.scoreRaw = '100';
    } else {
        data.scoreRaw = perc.toString();
    }
    sincronizar();
}

function getLocation() {
    data.lessonLocation = pipwerks.SCORM.get("cmi.core.lesson_location");
    return data.lessonLocation;
}

this.iniciar();

$(window).scroll(function() {
    var barra = document.getElementById("myBar");
    var scrollPercentage = ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) / 0.01;
    var compare = Math.round(scrollPercentage);
    console.log(compare);
    console.log(compare >= percentage);
    if (compare >= percentage) {
        percentage = compare;
    }
    console.log(percentage);
    if (isBarra) {
        barra.style.width = percentage + "%";
    }
    if (percentage == 100) {
        console.log('limite');
        isBarra = false;
        barra.style.background = '#00bb00';
        setScore(percentage);
    } else {
        if (isBarra) {
            setScore(percentage);
        }
    }
});

// var modalPoint = document.querySelectorAll('.modalPoint');


// modalPoint = () => {
//     if (modalPoint.length >= 0) {
//         console.log('Modal Point: ' + modalPoint.length);
//     }
// }

$('.flip-container').each(function(i, el) {
    console.log(el);
    el.addEventListener( 'click', function() {
        el.classList.toggle('is-flipped');
    });
});