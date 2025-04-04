let currNumber = "";
const maxValidNum = 10;
const values = [];
let isPointEnabled = true;
const validOperators = ["+", "-", "*", "/"];
const operatorRegex = /[+\-*/]/;
let returnVal = null;
const display = document.querySelector("#display");
display.textContent = 0;
const body = document.querySelector("#body");

body.addEventListener("click", (e) => {
  const val = e.target.value;
  if (val) {
    handleInput(val);
  }
});

const buttons = document.querySelectorAll("button[value]");
const keys = Array.from(buttons).map((elem) => elem.value);
body.addEventListener("keydown", (e) => {
  const val = e.key;
  e.preventDefault();
  if (keys.includes(val)) {
    handleInput(val);
  }
});

function updateCurr() {
  if (isPointEnabled === true && returnVal) {
    if (returnVal.includes(".")) {
      isPointEnabled = false;
    }
  }
  if (returnVal) currNumber = returnVal;
}

function checkSpecialInputs(val) {
  const isCurrEmpty = !currNumber;
  if (val === "Escape") {
    fullClear();
    return true;
  } else if (val === "Backspace") {
    if (isCurrEmpty) updateCurr();
    if (currNumber.at(-1) === ".") isPointEnabled = true;
    currNumber = currNumber.slice(0, -1);
    returnVal &&= currNumber;
    display.textContent = currNumber || "0";
    return true;
  } else if (val === "point") {
    if (isCurrEmpty) updateCurr();
    if (isPointEnabled) {
      currNumber += currNumber ? "." : "0.";
      display.textContent = currNumber;
      isPointEnabled = false;
    }
    return true;
  }
  return false;
}

function handleInput(val) {
  const isOperator = validOperators.includes(val);
  if (checkSpecialInputs(val)) return;
  if (!isNaN(val)) { // if it's a digit
    if (currNumber.length < maxValidNum) {
      currNumber += val;
      display.textContent = currNumber;
    }
  } else {
    processOperator(isOperator, val);
    // if the index is 1 and user presses any other operator update the operator
    const index = values.findIndex((el) => validOperators.includes(el));
    if (index !== -1 && values.length === 2 && val !== "=") {
      values[index] = val;
    }
  }
}

function processOperator(isOperator, val) {
  pushNum();
  pushVal(isOperator, val);
  callParse();
  handleReturn(isOperator, val);
}

function handleReturn(isOperator, val) {
  if (values.length > 0) {
    returnVal = null;
    return;
  }
  if (isOperator && returnVal) {
    values.push(returnVal);
    values.push(val); // operator
  } else if (val === "=") {
    return;
  }
  returnVal = null;
}

function fullClear() {
  cleanInput();
  returnVal = null;
  currNumber = "";
  display.textContent = 0;
  isPointEnabled = true;
  if (activeBtn) {
    activeBtn.classList.remove("active");
  }
}

const operatorButtons = document.querySelectorAll(".buttons.operations");
let activeBtn = null;
function pushVal(isOperator, val) {
  if (values.length > 0 && values.length < 2) {
    values.push(val);
  }
  if (isOperator) {
    operatorButtons.forEach((btn) => {
      const isThisBtn = btn.value === val;
      if (isThisBtn) activeBtn = btn;
      btn.classList.toggle("active", isThisBtn);
    });
  } else {
    activeBtn.classList.remove("active");
  }
}

function pushNum() {
  if (currNumber) {
    values.push(currNumber);
    currNumber = "";
    isPointEnabled = true;
  }
}

function callParse() {
  if (values.length === 3) {
    const str = values.join("");
    parse(str);
  }
}

function parse(str) {
  let isNegative = false;
  if (str.startsWith("-")) {
    isNegative = true;
    str = str.slice(1);
  }

  let [x, y] = str.split(operatorRegex);
  const operatorMatch = str.match(operatorRegex);
  if (!operatorMatch) return cleanInput();
  const operator = operatorMatch[0];

  x = Number(x);
  y = Number(y);

  if (isNaN(x) || isNaN(y)) return cleanInput();
  if (isNegative) {
    x *= -1;
    isNegative = false;
  }
  operate(x, operator, y);
}

function add(x, y) {
  const res = x + y;
  resStr = res.toString().includes(".") ? res.toFixed(2) : res.toString();
  cleanInput();
  if (resStr.length > maxValidNum) {
    const check = resStr.includes(".") || resStr.includes("-");
    resStr = check ? resStr.slice(0, maxValidNum) : "9".repeat(maxValidNum);
  }
  returnVal = resStr;
  display.textContent = resStr;
}

function subtract(x, y) {
  const res = x - y;
  resStr = res.toString().includes(".") ? res.toFixed(2) : res.toString();
  cleanInput();
  if (resStr.length > maxValidNum) {
    const check = resStr.includes(".") || resStr.includes("-");
    resStr = check ? resStr.slice(0, maxValidNum) : "9".repeat(maxValidNum);
  }
  returnVal = resStr;
  display.textContent = resStr;
}

function multiply(x, y) {
  const res = x * y;
  resStr = res.toString().includes(".") ? res.toFixed(2) : res.toString();
  cleanInput();
  if (resStr.length > maxValidNum) {
    const check = resStr.includes(".") || resStr.includes("-");
    resStr = check ? resStr.slice(0, maxValidNum) : "9".repeat(maxValidNum);
  }
  returnVal = resStr;
  display.textContent = resStr;
}

function divide(x, y) {
  const res = x / y;
  resStr = res.toString().includes(".") ? res.toFixed(2) : res.toString();
  cleanInput();
  if (resStr.length > maxValidNum) {
    const check = resStr.includes(".") || resStr.includes("-");
    resStr = check ? resStr.slice(0, maxValidNum) : "9".repeat(maxValidNum);
  }
  returnVal = resStr;
  display.textContent = resStr;
}

function operate(x, operator, y) {
  switch (operator) {
    case "+":
      add(x, y);
      break;
    case "-":
      subtract(x, y);
      break;
    case "*":
      multiply(x, y);
      break;
    case "/":
      divide(x, y);
      break;
    default:
      console.log("Operator can't be found");
  }
}

function cleanInput() {
  values.length = 0; // []
  display.textContent = "";
}

function maintainFocus() {
  if (document.activeElement !== body) {
    setTimeout(() => {
      body.focus();
    }, 0);
  }
}

body.addEventListener("blur", maintainFocus);
maintainFocus();
