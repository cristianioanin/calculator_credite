const results = document.getElementById('results');
const loader = document.getElementById('loading');

// Submit event-listener
document.querySelector('#loan-form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Hide results
    results.style.display = 'none';

    // Show loading image
    loader.style.display = 'block';
    setTimeout( () => calculateResults(), 1500);
    
});

// Define DOM elements
const input = {
    amount: document.getElementById('amount'),
    interest: document.getElementById('interest'),
    years: document.getElementById('years')
}

const output = {
    monthlyPayment: document.getElementById('monthly-payment'),
    totalPayment: document.getElementById('total-payment'),
    totalInterest: document.getElementById('total-interest'),
}

input.amount.addEventListener('keyup', (event) => {
    const value = removeComma(event.target.value);

    event.target.value = formatNumber(value);
});

// Calculate the results
function calculateResults() {
    const principal = parseFloat(removeComma(input.amount.value));
    const calculatedInterest = parseFloat(input.interest.value) / 100 / 12;
    const calculatedPayments = parseFloat(input.years.value / 12) * 12;

    // Compute monthly payments
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
        output.monthlyPayment.textContent = formatNumber(monthly.toFixed(2));
        output.totalPayment.textContent = formatNumber((monthly * calculatedPayments).toFixed(2));
        output.totalInterest.textContent = formatNumber(((monthly * calculatedPayments) - principal).toFixed(2));

        results.style.display = 'block';
        loader.style.display = 'none';
    } else {
        showError('A apărut o eroare privind valorile introduse...');    
    }
}

function showError(msg) {
    const errorDiv = document.createElement('div');
    results.style.display = 'none';
    loader.style.display = 'none';

    // Get elements from DOM
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');

    errorDiv.className = 'alert alert-danger';
    errorDiv.appendChild(document.createTextNode(msg));

    // Insert error to DOM
    card.insertBefore(errorDiv, heading);

    // Clear error after 3s
    setTimeout(clearError, 3000);
}

function clearError() {
    document.querySelector('.alert').remove();
}

// Format numbers to pattern 123,456,789.00
function formatNumber(input) {
    const string = typeof input === 'string' ? input : input.toFixed(2).toString();

    [integer, decimal] = string.split('.');

    function reverseString(str) {
        return str.split('').reverse().join('');
    }

    const reverseInteger = reverseString(integer);
    let reverseFormatted = '';

    for (let i = 0; i < reverseInteger.length; i++) {
        reverseFormatted += reverseInteger[i];
        if ((i + 1) % 3 === 0 && i !== reverseInteger.length - 1) reverseFormatted += ',';
    }

    const formattedInteger = reverseString(reverseFormatted);
    let stringFormatted = formattedInteger;
    if (decimal) stringFormatted += `.${decimal}`;

    return stringFormatted;
}

function removeComma(string) {
    let noCommaString = '';
    for (let i = 0; i < string.length; i++) {
        if (string[i] === ',') continue;
        noCommaString += string[i];
    }
    return noCommaString;
}