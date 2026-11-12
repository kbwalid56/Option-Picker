const optionInput = document.getElementById("optionInput");
const addBtn = document.getElementById("addBtn");
const optionList = document.getElementById("optionList");
const optionCount = document.getElementById("optionCount");

const bottle = document.getElementById("bottle");
const wheelOptions = document.getElementById("wheelOptions");

const spinBtn = document.getElementById("spinBtn");
const resetBtn = document.getElementById("resetBtn");
const spinAgainBtn = document.getElementById("spinAgainBtn");

const resultSection = document.getElementById("resultSection");
const resultText = document.getElementById("resultText");

let options = [];
let isSpinning = false;
let currentRotation = 0;


// Add option
function addOption() {

    const value = optionInput.value.trim();

    if (!value) {
        alert("Please enter an option!");
        return;
    }

    if (options.some(o =>
        o.toLowerCase() === value.toLowerCase()
    )) {
        alert("This option already exists!");
        return;
    }

    options.push(value);

    optionInput.value = "";

    updateOptions();
}


// Display options in the left panel
function updateOptions() {

    optionList.innerHTML = "";

    options.forEach((option, index) => {

        const item = document.createElement("div");
        item.className = "option-item";

        const text = document.createElement("span");
        text.textContent = option;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.className = "remove-btn";

        removeBtn.addEventListener("click", () => {

            if (isSpinning) return;

            options.splice(index, 1);

            resultSection.classList.add("hidden");

            currentRotation = 0;
            bottle.style.transition = "none";
            bottle.style.transform = "rotate(0deg)";

            updateOptions();
        });

        item.appendChild(text);
        item.appendChild(removeBtn);

        optionList.appendChild(item);
    });

    optionCount.textContent = `${options.length} options added`;

    spinBtn.disabled = options.length < 2;

    // Update circular wheel
    renderWheel();
}


// Arrange options around the bottle
function renderWheel() {

    wheelOptions.innerHTML = "";

    const total = options.length;

    const center = 210;
    const radius = 155;

    options.forEach((option, index) => {

        // Distribute options equally around the circle
        const angle = (-90 + (index * 360 / total)) * Math.PI / 180;

        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const item = document.createElement("div");

        item.className = "wheel-option";
        item.textContent = option;

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        item.dataset.index = index;

        wheelOptions.appendChild(item);
    });
}


// Spin bottle toward the selected option
function spinBottle() {

    if (isSpinning || options.length < 2) return;

    isSpinning = true;

    spinBtn.disabled = true;
    resetBtn.disabled = true;

    resultSection.classList.add("hidden");

    // Select a random winner
    const winnerIndex = Math.floor(
        Math.random() * options.length
    );

    const winner = options[winnerIndex];

    // Calculate the exact angle of the winner
    const targetAngle = winnerIndex * (360 / options.length);

    // Add several full rotations
    const fullSpins = 360 * 6;

    const finalRotation = currentRotation +
        fullSpins +
        targetAngle;

    // Animate the bottle
    bottle.style.transition =
        "transform 5s cubic-bezier(0.15, 0.65, 0.15, 1)";

    bottle.style.transform =
        `rotate(${finalRotation}deg)`;

    currentRotation = finalRotation;

    // Show result after spinning
    setTimeout(() => {

        // Highlight winning option
        document.querySelectorAll(".wheel-option").forEach(item => {

            item.classList.remove("winner");

            if (Number(item.dataset.index) === winnerIndex) {
                item.classList.add("winner");
            }

        });

        resultText.textContent = winner;

        resultSection.classList.remove("hidden");

        isSpinning = false;

        spinBtn.disabled = false;
        resetBtn.disabled = false;

    }, 5100);
}


// Reset everything
function resetOptions() {

    if (isSpinning) return;

    options = [];

    currentRotation = 0;

    bottle.style.transition = "none";
    bottle.style.transform = "rotate(0deg)";

    resultSection.classList.add("hidden");

    updateOptions();
}


// Event listeners
addBtn.addEventListener("click", addOption);

spinBtn.addEventListener("click", spinBottle);

resetBtn.addEventListener("click", resetOptions);

spinAgainBtn.addEventListener("click", spinBottle);

optionInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addOption();
    }

});


// Initial setup
updateOptions();
