const showcase = document.getElementById("showcase");

function display(value) {
  const lastChar = showcase.value.slice(-1);

  if (/\d/.test(value)) {
    showcase.value += value;
  } else if (['+', '-', '*', '/', '%'].includes(value)) {
    if (lastChar.trim() !== '') {
      showcase.value += ' ' + value + ' ';
    }
  } else if (value === '.' && !getLastNumber(showcase.value).includes('.')) {
    showcase.value += value;
  } else if (value === '+/-') {
    const currentValue = showcase.value;
    const lastNumber = getLastNumber(currentValue);

    if (lastNumber !== '') {
      const toggledValue = parseFloat(lastNumber) * -1;
      const newExpression = currentValue.slice(0, -lastNumber.length) + toggledValue;
      showcase.value = newExpression;
    }
  }
}

function calculate() {
  const expression = showcase.value;
  const result = evaluateExpression(expression);
  showcase.value = result;
}

function clearScreen() {      
  showcase.value = "";
}

function evaluateExpression(expression) {
  const tokens = expression.split(' ');
  let result = parseFloat(tokens[0]);
  let operator = null;

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (['+', '-', '*', '/', '%'].includes(token)) {
      operator = token;
    } else {
      const num = parseFloat(token);

      switch (operator) {
        case '+':
          result += num;
          break;
        case '-':
          result -= num;
          break;
        case '*':
          result *= num;
          break;
        case '/':
          result /= num;
          break;
        case '%':
          result %= num;
          break;
      }
    }
  }

  return result;
}

function getLastNumber(expression) {
  const tokens = expression.split(' ').reverse();

  for (const token of tokens) {
    if (/^\d/.test(token)) {
      return token;
    }
  }

  return '';
}

function handleKeyDown(event) {
  const allowedKeysRegex = /^[\d+\-*/%.]$/;
  const keyPressed = event.key;

  if (keyPressed === 'Backspace') {
    event.preventDefault();
    showcase.value = showcase.value.slice(0, -1); // Remove the last character
  } else if (keyPressed === 'Enter') {
    event.preventDefault();
    calculate();
  } else if (!allowedKeysRegex.test(keyPressed)) {
    event.preventDefault();
  } else {
    if (['+', '-', '*', '/', '%'].includes(keyPressed)) {
      display(keyPressed);
      event.preventDefault();
    } else if (keyPressed === '+/-') {
      display(keyPressed);
      event.preventDefault();
    } else if (keyPressed === '.') {
      display(keyPressed);
      event.preventDefault();
    }
  }
}

showcase.addEventListener("keydown", handleKeyDown);
document.getElementById("equals-button").addEventListener("click", calculate);
document.getElementById("clear-button").addEventListener("click", clearScreen); 













// function display(val) {
//     document.getElementById('result').value += val;
//     console.log(val);
// }

// function solve() {
//     const x = document.getElementById('result').value;
//     const y = calculate(x);
//     document.getElementById('result').value = y;
//     console.log(x);
// }

// function clearScreen() {
//     document.getElementById('result').value = '';
//     console.log(clearScreen);
// }

// function operator(val) {
//     document.getElementById('result').value += val;
//     console.log(operator);
// }

// function calculate(expression) {
//     var operands = expression.split(/[\+\-\*\/]/);
//     var operators = expression.split(/\d+/).filter(Boolean);

//     var result = Number(operands[0]);
//     for (var i = 0; i < operators.length; i++) {
//         const operator = operators[i];
//         const operand = Number(operands[i+1]);  
//         if (operator === '+') {
//             result += operand;
//         } else if (operator === '-') {
//             result -= operand;
//         } else if (operator === '*') {
//             result *= operand;
//         } else if (operator === '/') {
//             result /= operand;
//         }
//     }

//     return result;
// }


  
