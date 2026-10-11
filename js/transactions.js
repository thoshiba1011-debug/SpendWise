// =========================================
// SPENDWISE TRANSACTIONS PAGE
// =========================================


// Get saved transactions
let transactions =
    JSON.parse(
        localStorage.getItem("spendwiseTransactions")
    ) || [];


// =========================================
// ELEMENTS
// =========================================

const transactionSearch =
    document.getElementById("transactionSearch");

const paymentFilter =
    document.getElementById("paymentFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const transactionList =
    document.getElementById("transactionList");


// =========================================
// DISPLAY TRANSACTIONS
// =========================================

function displayTransactionsPage() {

    const searchTerm =
        transactionSearch.value
            .toLowerCase()
            .trim();

    const selectedMode =
        paymentFilter.value;

    const selectedCategory =
        categoryFilter.value;


    // Filter transactions
    const filteredTransactions =
        transactions.filter(function(transaction) {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesMode =
                selectedMode === "all"

                ||

                transaction.mode ===
                selectedMode;


            const matchesCategory =
                selectedCategory === "all"

                ||

                transaction.category ===
                selectedCategory;


            return (
                matchesSearch &&
                matchesMode &&
                matchesCategory
            );

        });


    // Clear table
    transactionList.innerHTML = "";


    // No transactions
    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No transactions found.
                </td>
            </tr>
        `;

        updateSummary();

        return;
    }


    // Display transactions
    filteredTransactions
        .slice()
        .reverse()
        .forEach(function(transaction) {

            const row =
                document.createElement("tr");


            const amountSign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            row.innerHTML = `

                <td>
                    ${transaction.date}
                </td>

                <td>
                    ${transaction.description}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${
                        transaction.mode === "online"
                            ? "💳 Online"
                            : "💵 Offline"
                    }
                </td>

                <td>
                    ${amountSign}
                    ₹${Number(transaction.amount).toLocaleString("en-IN")}
                </td>

            `;


            transactionList.appendChild(row);

        });


    updateSummary();
}


// =========================================
// UPDATE SUMMARY
// =========================================

function updateSummary() {

    let online =
        0;

    let offline =
        0;

    let total =
        0;


    transactions.forEach(function(transaction) {

        // Only count expenses
        if (transaction.type !== "expense") {
            return;
        }


        const amount =
            Number(transaction.amount);


        total += amount;


        if (transaction.mode === "online") {

            online += amount;

        }

        else if (transaction.mode === "offline") {

            offline += amount;

        }

    });


    document.getElementById("onlineTotal").textContent =
        "₹" + online.toLocaleString("en-IN");


    document.getElementById("offlineTotal").textContent =
        "₹" + offline.toLocaleString("en-IN");


    document.getElementById("totalExpenses").textContent =
        "₹" + total.toLocaleString("en-IN");
}


// =========================================
// SEARCH
// =========================================

transactionSearch.addEventListener(
    "input",
    displayTransactionsPage
);


// =========================================
// PAYMENT FILTER
// =========================================

paymentFilter.addEventListener(
    "change",
    displayTransactionsPage
);


// =========================================
// CATEGORY FILTER
// =========================================

categoryFilter.addEventListener(
    "change",
    displayTransactionsPage
);


// =========================================
// INITIAL LOAD
// =========================================

displayTransactionsPage();