document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.calculator-screen');
    const keys = document.querySelector('.calculator-keys');
    let displayValue = '0';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;

    keys.addEventListener('click', event => {
        const { target } = event;
        if (!target.matches('button')) return;

        switch (target.value) {
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(target.value);
                break;
            case '=':
                calculate();
                break;
            case 'clear':
                clear();
                break;
            case '.':
                inputDecimal();
                break;
            default:
                inputDigit(target.value);
        }
        updateDisplay();
    });

    function updateDisplay() {
        display.value = displayValue;
    }

    function inputDigit(digit) {
        displayValue = waitingForSecondOperand ? digit : displayValue === '0' ? digit : displayValue + digit;
        waitingForSecondOperand = false;
    }

    function inputDecimal() {
        if (!displayValue.includes('.')) displayValue += '.';
    }

    function clear() {
        displayValue = '0';
        firstOperand = null;
        waitingForSecondOperand = false;
        operator = null;
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);
        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }
        if (firstOperand == null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }
        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    };

    function calculate() {
        if (operator && !waitingForSecondOperand) {
            const result = performCalculation[operator](firstOperand, parseFloat(displayValue));
            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
            operator = null;
            waitingForSecondOperand = false;
        }
    }

    updateDisplay();
});