//Clock
function currentTime() {
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    // document.getElementById("clock").innerText = hour + ":" + min + ":" + sec;
    let t = setTimeout(function () {
        currentTime();
    }, 1000);
}

currentTime();

document.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("Text", event.target.innerHTML);
});

const ageCheckLabel = document.getElementById("age-check-label");
const phoneCheckLabel = document.getElementById("phone-check-label");

const onBlur = (ele) => {
    const n = ele.value;
    switch (ele.name) {
        case "age": {
            if (+n < 18 || +n > 100) {
                ageCheckLabel.style.display = "inline";
            }
            break;
        }
        case "number": {
            if (!n.match(/^[789]\d{9}$/g)) {
                phoneCheckLabel.style.display = "inline";
            }
            break;
        }
        default: {
            break;
        }
    }
};
const onFocus = (ele) => {
    switch (ele.name) {
        case "Age": {
            ageCheckLabel.style.display = "none";
            break;
        }
        case "Phone": {
            phoneCheckLabel.style.display = "none";
            break;
        }
        default: {
            break;
        }
    }
};

