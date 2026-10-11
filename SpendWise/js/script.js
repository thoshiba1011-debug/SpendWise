/* =========================================
   SPENDWISE
   Smart Online & Offline Expense Tracker
========================================= */


/* =========================================
   1. STORE DATA
========================================= */

let transactions =
    JSON.parse(
        localStorage.getItem("spendwiseTransactions")
    ) || [];


let budget =
    Number(
        localStorage.getItem("spendwiseBudget")
    ) || 0;


/* =========================================
   2. GET HTML ELEMENTS
========================================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionTable =
    document.getElementById("transactionTable");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const filterType =
    document.getElementById("filterType");

const filterMode =
    document.getElementById("filterMode");

const filterCategory =
    document.getElementById("filterCategory");

const themeToggle =
    document.getElementById("themeToggle");

const notificationBtn =
    document.getElementById("notificationBtn");

const offlineCheckinBtn =
    document.getElementById("offlineCheckinBtn");

const budgetInput =
    document.getElementById("budgetInput");

const saveBudgetBtn =
    document.getElementById("saveBudgetBtn");


/* =========================================
   3. SAVE TRANSACTIONS
========================================= */

function saveTransactions() {

    localStorage.setItem(
        "spendwiseTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================================
   4. SAVE BUDGET
========================================= */

function saveBudget() {

    localStorage.setItem(
        "spendwiseBudget",
        budget
    );

}


/* =========================================
   5. FORMAT MONEY
========================================= */

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================
   6. ADD TRANSACTION
========================================= */

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const type =
            document.getElementById(
                "transactionType"
            ).value;


        const mode =
            document.getElementById(
                "paymentMode"
            ).value;


        const amount =
            Number(
                document.getElementById(
                    "amount"
                ).value
            );


        const category =
            document.getElementById(
                "category"
            ).value;


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const date =
            document.getElementById(
                "date"
            ).value;


        /* Validate data */

        if (
            amount <= 0 ||
            category === "" ||
            description === "" ||
            date === ""
        ) {

            alert(
                "Please fill all fields correctly."
            );

            return;

        }


        /* Create transaction object */

        const transaction = {

            id: Date.now(),

            type: type,

            mode: mode,

            amount: amount,

            category: category,

            description: description,

            date: date

        };


        /* Add to array */

        transactions.push(
            transaction
        );


        /* Save */

        saveTransactions();


        /* Clear form */

        transactionForm.reset();


        /* Update application */

        updateDashboard();

        displayTransactions();


        alert(
            "Transaction added successfully! ✅"
        );

    }
);


/* =========================================
   7. DISPLAY TRANSACTIONS
========================================= */

function displayTransactions() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedType =
        filterType.value;


    const selectedMode =
        filterMode.value;


    const selectedCategory =
        filterCategory.value;


    /* Filter transactions */

    const filteredTransactions =
        transactions.filter(
            function(transaction) {


                const matchesSearch =

                    transaction.description
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    transaction.category
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesType =

                    selectedType === "all"

                    ||

                    transaction.type ===
                    selectedType;


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
                    matchesType &&
                    matchesMode &&
                    matchesCategory
                );

            }
        );


    /* Clear table */

    transactionTable.innerHTML = "";


    /* If no transactions */

    if (
        filteredTransactions.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    /* Display transactions */

    filteredTransactions
        .slice()
        .reverse()
        .forEach(
            function(transaction) {

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
                        ${
                            transaction.type === "income"
                            ? "Income"
                            : "Expense"
                        }
                    </td>

                    <td>
                        ${amountSign}
                        ${formatMoney(
                            transaction.amount
                        )}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="
                                deleteTransaction(
                                    ${transaction.id}
                                )
                            "
                        >
                            Delete
                        </button>

                    </td>

                `;


                transactionTable.appendChild(
                    row
                );

            }
        );

}


/* =========================================
   8. DELETE TRANSACTION
========================================= */

function deleteTransaction(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmation) {

        return;

    }


    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();


    updateDashboard();

    displayTransactions();

}


/* =========================================
   9. UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    let income = 0;

    let onlineExpense = 0;

    let offlineExpense = 0;


    transactions.forEach(
        function(transaction) {


            /* Income */

            if (
                transaction.type === "income"
            ) {

                income +=
                    transaction.amount;

            }


            /* Online expense */

            if (
                transaction.type === "expense" &&
                transaction.mode === "online"
            ) {

                onlineExpense +=
                    transaction.amount;

            }


            /* Offline expense */

            if (
                transaction.type === "expense" &&
                transaction.mode === "offline"
            ) {

                offlineExpense +=
                    transaction.amount;

            }

        }
    );


    /* Total expense */

    const totalExpense =
        onlineExpense +
        offlineExpense;


    /* Available balance */

    const balance =
        income -
        totalExpense;


    /* Update HTML */

    document.getElementById(
        "incomeAmount"
    ).textContent =
        formatMoney(income);


    document.getElementById(
        "onlineExpense"
    ).textContent =
        formatMoney(onlineExpense);


    document.getElementById(
        "offlineExpense"
    ).textContent =
        formatMoney(offlineExpense);


    document.getElementById(
        "totalExpense"
    ).textContent =
        formatMoney(totalExpense);


    document.getElementById(
        "balanceAmount"
    ).textContent =
        formatMoney(balance);


    /* Update analytics */

    updateAnalytics(
        onlineExpense,
        offlineExpense
    );


    /* Update budget */

    updateBudget(
        totalExpense
    );

}


/* =========================================
   10. ONLINE VS OFFLINE ANALYSIS
========================================= */

function updateAnalytics(
    onlineExpense,
    offlineExpense
) {

    const total =
        onlineExpense +
        offlineExpense;


    /* No expenses */

    if (total === 0) {

        document.getElementById(
            "onlinePercentage"
        ).textContent = "0%";


        document.getElementById(
            "offlinePercentage"
        ).textContent = "0%";


        document.getElementById(
            "onlineProgress"
        ).style.width = "0%";


        document.getElementById(
            "offlineProgress"
        ).style.width = "0%";


        return;

    }


    /* Calculate percentages */

    const onlinePercentage =
        Math.round(
            (onlineExpense / total) * 100
        );


    const offlinePercentage =
        100 -
        onlinePercentage;


    /* Display percentage */

    document.getElementById(
        "onlinePercentage"
    ).textContent =
        onlinePercentage + "%";


    document.getElementById(
        "offlinePercentage"
    ).textContent =
        offlinePercentage + "%";


    /* Update progress bars */

    document.getElementById(
        "onlineProgress"
    ).style.width =
        onlinePercentage + "%";


    document.getElementById(
        "offlineProgress"
    ).style.width =
        offlinePercentage + "%";

}


/* =========================================
   11. MONTHLY BUDGET
========================================= */

saveBudgetBtn.addEventListener(
    "click",
    function() {

        const value =
            Number(
                budgetInput.value
            );


        if (value < 0) {

            alert(
                "Budget cannot be negative."
            );

            return;

        }


        budget =
            value;


        saveBudget();


        updateDashboard();


        alert(
            "Monthly budget saved! 💰"
        );

    }
);


/* =========================================
   12. UPDATE BUDGET
========================================= */

function updateBudget(
    totalExpense
) {

    document.getElementById(
        "budgetAmount"
    ).textContent =
        formatMoney(budget);


    const remaining =
        budget -
        totalExpense;


    document.getElementById(
        "budgetRemaining"
    ).textContent =
        formatMoney(remaining);


    /* Budget exceeded */

    if (remaining < 0) {

        document.getElementById(
            "budgetRemaining"
        ).style.color =
            "#dc2626";

    }

    else {

        document.getElementById(
            "budgetRemaining"
        ).style.color =
            "";

    }

}


/* =========================================
   13. SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    displayTransactions
);


/* =========================================
   14. FILTERS
========================================= */

filterType.addEventListener(
    "change",
    displayTransactions
);


filterMode.addEventListener(
    "change",
    displayTransactions
);


filterCategory.addEventListener(
    "change",
    displayTransactions
);


/* =========================================
   15. DARK MODE
========================================= */

themeToggle.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        themeToggle.textContent =
            darkMode
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "spendwiseDarkMode",
            darkMode
        );

    }
);


/* =========================================
   16. LOAD DARK MODE
========================================= */

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "spendwiseDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark"
        );


        themeToggle.textContent =
            "☀️";

    }

}


/* =========================================
   17. NOTIFICATIONS
========================================= */

notificationBtn.addEventListener(
    "click",
    async function() {


        /* Check browser support */

        if (
            !(
                "Notification"
                in window
            )
        ) {

            alert(
                "Your browser does not support notifications."
            );

            return;

        }


        /* Ask permission */

        const permission =
            await Notification
                .requestPermission();


        /* Permission granted */

        if (
            permission === "granted"
        ) {

            new Notification(
                "SpendWise 🔔",
                {
                    body:
                        "Don't forget to record today's offline expenses!"
                }
            );


            notificationBtn.textContent =
                "✅ Reminder Enabled";

        }

    }
);


/* =========================================
   18. OFFLINE CHECK-IN
========================================= */

offlineCheckinBtn.addEventListener(
    "click",
    function() {


        /* Automatically select Expense */

        document.getElementById(
            "transactionType"
        ).value =
            "expense";


        /* Automatically select Offline */

        document.getElementById(
            "paymentMode"
        ).value =
            "offline";


        /* Add default description */

        document.getElementById(
            "description"
        ).value =
            "Daily offline spending";


        /* Scroll to transaction section */

        document.getElementById(
            "transactions"
        ).scrollIntoView({
            behavior: "smooth"
        });


        /* Focus amount */

        document.getElementById(
            "amount"
        ).focus();

    }
);


/* =========================================
   19. INITIALIZE APPLICATION
========================================= */

loadTheme();

updateDashboard();

displayTransactions();