const showcase = document.getElementById("showcase");

function display(value) {
    const lastChar = showcase.value.slice(-1);

    if (/\d/.test(value)) {
        appendToShowcase(value);
    } else if (["+", "-", "*", "/", "%"].includes(value)) {
        if (lastChar.trim() !== "") {
            showcase.value += " " + value + " ";
        } else if (lastChar === " ") {
            showcase.value = showcase.value.slice(0, -2) + value + " ";
        }
    } else if (value === "." && !getLastNumber(showcase.value).includes(".")) {
        appendToShowcase(value);
    } else if (value === "+/-") {
        const currentValue = showcase.value;
        const lastNumber = getLastNumber(currentValue);

        if (lastNumber !== "") {
            const toggledValue = parseFloat(lastNumber) * -1;
            const newExpression =
                currentValue.slice(0, -lastNumber.length) + toggledValue;
            showcase.value = newExpression;
        } else if (currentValue.startsWith("-")) {
            showcase.value = currentValue.slice(1);
        } else {
            showcase.value = `-${currentValue}`;
        }
    } else if (value === "CE") {
        clearEntry();
    }
}

function calculate() {
    const expression = showcase.value;
    const lastChar = expression.slice(-1);

    // Check if the last character is an operator
    if (["+", "-", "*", "/", "%"].includes(lastChar)) {
        return;
    }

    const result = evaluateExpression(expression);

    if (Number.isFinite(result)) {
        showcase.value = String(result);
    }
}

function clearScreen() {
    showcase.value = "";
}

function clearEntry() {
    const input = showcase;
    const currentValue = input.value;

    if (currentValue.length > 0) {
        input.value = currentValue.slice(0, -1);
    }

    input.focus();
}

function evaluateExpression(expression) {
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "%": (a, b) => a * (b / 100),
    };

    const tokens = expression.split(" ");
    const numbers = [];
    const operatorsStack = [];

    for (const token of tokens) {
        if (operators.hasOwnProperty(token)) {
            while (
                operatorsStack.length > 0 &&
                operators[token](0, 0) <=
                operators[operatorsStack[operatorsStack.length - 1]](0, 0)
            ) {
                const operator = operatorsStack.pop();
                const b = numbers.pop();
                const a = numbers.pop();
                const result = operators[operator](a, b);
                numbers.push(result);
            }
            operatorsStack.push(token);
        } else if (!isNaN(parseFloat(token))) {
            numbers.push(parseFloat(token));
        }
    }

    while (operatorsStack.length > 0) {
        const operator = operatorsStack.pop();
        const b = numbers.pop();
        const a = numbers.pop();
        const result = operators[operator](a, b);
        numbers.push(result);
    }

    return numbers.length === 1 ? numbers[0] : NaN;
}

function getLastNumber(expression) {
    const tokens = expression.split(" ").reverse();

    for (const token of tokens) {
        if (/^\d/.test(token)) {
            return token;
        }
    }

    return "";
}

function appendToShowcase(value) {
    showcase.value += value;
}

function handleKeyDown(event) {
    const allowedKeysRegex = /^[\d+\-*/%.]$/;
    const keyPressed = event.key;

    if (keyPressed === "Backspace") {
        event.preventDefault();
        removeLastCharacter();
    } else if (keyPressed === "Enter") {
        event.preventDefault();
        calculate();
    } else if (
        allowedKeysRegex.test(keyPressed) &&
        (["+",
                "-",
                "*",
                "/",
                "%"
            ].includes(keyPressed) ||
            keyPressed === "." ||
            /\d/.test(keyPressed))
    ) {
        display(keyPressed);
        event.preventDefault();
    } else {
        event.preventDefault();
    }
}

function removeLastCharacter() {
    const currentValue = showcase.value;
    const newValue = currentValue.slice(0, -1);
    showcase.value = newValue;
}

function handlePaste(event) {
    const element = event.target;

    if (element.tagName === "INPUT" && element.type === "text") {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text/plain").trim();

        if (/^[0-9+\-*/%.]+$/.test(pastedText)) {
            const currentValue = element.value;
            const selectionStart = element.selectionStart;
            const selectionEnd = element.selectionEnd;
            const newValue =
                currentValue.substring(0, selectionStart) +
                pastedText +
                currentValue.substring(selectionEnd);

            element.value = newValue;
            element.setSelectionRange(
                selectionStart + pastedText.length,
                selectionStart + pastedText.length
            );

            // Automatically evaluate the pasted expression and display the result
            showcase.value = evaluateExpression(newValue);
        }

        event.preventDefault();
    }
}

showcase.addEventListener("keydown", handleKeyDown);
showcase.addEventListener("paste", handlePaste);
document.getElementById("equals-button").addEventListener("click", calculate);
document.getElementById("clear-button").addEventListener("click", clearScreen);
document.getElementById("ce-button").addEventListener("click", clearEntry);



