const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionHistory = document.getElementById('transaction-history');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const dateInput = document.getElementById('date');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let editIndex = null; // Tracks the index of the transaction being edited

// Update UI
function updateUI() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    balanceEl.textContent = `₹${balance.toFixed(2)}`;
    incomeEl.textContent = `₹${income.toFixed(2)}`;
    expenseEl.textContent = `₹${expense.toFixed(2)}`;

    transactionHistory.innerHTML = transactions
        .map(
            (t, index) => `
            <li class="${t.type}">
                <span>${t.description} (${t.date})</span>
                <span>₹${t.amount.toFixed(2)}</span>
                <button class="edit-button" onclick="editTransaction(${index})">Edit</button>
                <button class="delete-button" onclick="deleteTransaction(${index})">Delete</button>
            </li>
        `
        )
        .join('');
}

// Add or Edit Transaction
function addTransaction(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const type = typeInput.value;
    const date = dateInput.value;

    if (!description || isNaN(amount) || !date) return;

    if (editIndex === null) {
        transactions.push({ description, amount, type, date });
    } else {
        transactions[editIndex] = { description, amount, type, date };
        editIndex = null; // Reset after editing
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();

    form.reset(); // Clear the form
}

// Edit Transaction
function editTransaction(index) {
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    dateInput.value = transaction.date;

    editIndex = index;
}

// Delete Transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
}

// Event Listener
form.addEventListener('submit', addTransaction);
updateUI();
