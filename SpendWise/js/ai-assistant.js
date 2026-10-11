// =========================================
// SPENDWISE AI ASSISTANT
// =========================================


// Get saved SpendWise transactions

let transactions =
    JSON.parse(
        localStorage.getItem("spendwiseTransactions")
    ) || [];


// Get saved budget

let budget =
    Number(
        localStorage.getItem("spendwiseBudget")
    ) || 0;


// Get chat elements

const chatMessages =
    document.getElementById("chatMessages");

const chatInput =
    document.getElementById("chatInput");

const sendMessage =
    document.getElementById("sendMessage");


// =========================================
// GET FINANCIAL DATA
// =========================================

function getFinancialData() {

    let onlineExpenses = 0;

    let offlineExpenses = 0;

    let totalExpenses = 0;

    let totalIncome = 0;


    transactions.forEach(
        function(transaction) {

            const amount =
                Number(transaction.amount);


            if (
                transaction.type === "income"
            ) {

                totalIncome += amount;

            }


            else if (
                transaction.type === "expense"
            ) {

                totalExpenses += amount;


                if (
                    transaction.mode === "online"
                ) {

                    onlineExpenses += amount;

                }


                else if (
                    transaction.mode === "offline"
                ) {

                    offlineExpenses += amount;

                }

            }

        }
    );


    const remainingBalance =
        totalIncome - totalExpenses;


    return {

        onlineExpenses,

        offlineExpenses,

        totalExpenses,

        totalIncome,

        remainingBalance,

        budget

    };

}


// =========================================
// ADD MESSAGE
// =========================================

function addMessage(
    message,
    type
) {

    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        type === "user"
            ? "user-message"
            : "bot-message";


    messageDiv.textContent =
        message;


    chatMessages.appendChild(
        messageDiv
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// =========================================
// SEND MESSAGE TO GROQ BACKEND
// =========================================

async function sendChatMessage() {

    const question =
        chatInput.value.trim();


    if (
        question === ""
    ) {

        return;

    }


    // Show user message

    addMessage(
        question,
        "user"
    );


    // Clear input

    chatInput.value = "";


    // Show loading message

    addMessage(
        "🤔 Thinking...",
        "bot"
    );


    try {

        // Get current financial data

        const financialData =
            getFinancialData();


        // Send question to backend

        const response =
            await fetch(
                "http://localhost:3000/api/chat",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                question,

                            financialData:
                                financialData

                        })

                }
            );


        const result =
            await response.json();


        // Remove Thinking message

        const messages =
            chatMessages.querySelectorAll(
                ".bot-message"
            );


        if (
            messages.length > 0
        ) {

            messages[
                messages.length - 1
            ].remove();

        }


        // Check server response

        if (
            !response.ok
        ) {

            throw new Error(
                result.error ||
                "Server error"
            );

        }


        // Display AI response

        addMessage(
            result.answer,
            "bot"
        );


    }

    catch (error) {

        console.error(
            "AI Error:",
            error
        );


        // Remove Thinking message

        const messages =
            chatMessages.querySelectorAll(
                ".bot-message"
            );


        if (
            messages.length > 0
        ) {

            messages[
                messages.length - 1
            ].remove();

        }


        // Display error

        addMessage(

            "❌ Sorry, I couldn't connect to SpendWise AI. Please make sure the backend server is running.",

            "bot"

        );

    }

}


// =========================================
// SEND BUTTON
// =========================================

sendMessage.addEventListener(
    "click",
    sendChatMessage
);


// =========================================
// ENTER KEY
// =========================================

chatInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            sendChatMessage();

        }

    }
);