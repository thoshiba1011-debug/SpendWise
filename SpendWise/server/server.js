const express = require("express");
const cors = require("cors");
require("dotenv").config();

const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());


// =========================================
// GROQ CLIENT
// =========================================

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// =========================================
// TEST ROUTE
// =========================================

app.get("/", (req, res) => {

    res.send("SpendWise AI Server is running!");

});


// =========================================
// AI CHAT ROUTE
// =========================================

app.post("/api/chat", async (req, res) => {

    try {

        const { message, financialData } = req.body;


        if (!message) {

            return res.status(400).json({
                error: "Message is required."
            });

        }


        const response =
            await groq.chat.completions.create({

                messages: [

                    {
                        role: "system",

                        content: `
You are SpendWise AI, a personal finance assistant
inside the SpendWise expense tracking application.

Your job is to answer questions using ONLY the
financial data provided by the SpendWise application.

IMPORTANT RULES:

1. All monetary values are in Indian Rupees (₹).
2. Never use $, USD, dollars, or any other currency.
3. Never invent financial numbers.
4. If the required information is not available,
   clearly tell the user.
5. Give simple, clear and helpful answers.
6. When giving financial suggestions, be practical
   and cautious.
7. Do not claim that a transaction exists unless it
   appears in the provided data.

You can help with:

- Total income
- Total expenses
- Online expenses
- Offline expenses
- Remaining balance
- Budget
- Budget usage
- Spending suggestions
- Comparing online and offline spending

CURRENT SPENDWISE FINANCIAL DATA:

${JSON.stringify(financialData, null, 2)}

Use this data to answer the user's question.

The user may ask any natural-language question related
to their SpendWise finances. Do not require specific
keywords or predefined questions.

Understand the user's intent from the meaning of their
question and answer naturally.

You may perform simple calculations using the provided
financial data when necessary.

For example, if the user asks:
- "Is my spending too high?"
- "Can I afford to spend ₹2,000?"
- "Where should I reduce my expenses?"
- "What does my financial situation look like?"
- "If I spend another ₹1,000, what will my balance be?"
- "Which type of spending is higher?"

answer based on the actual financial data provided.

If the question cannot be answered from the available
SpendWise data, say what information is missing instead
of inventing an answer.
`
                    },

                    {
                        role: "user",

                        content: message

                    }

                ],

                
                model: "openai/gpt-oss-20b",
                temperature: 0.5,

                max_tokens: 500

            });


        const answer =
            response.choices[0]
                .message
                .content;


        res.json({
            answer: answer
        });


    } catch (error) {

        console.error(
            "Groq API Error:",
            error
        );


        res.status(500).json({

            error:
                "Unable to connect to SpendWise AI."

        });

    }

});


// =========================================
// START SERVER
// =========================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `SpendWise server running on http://localhost:${PORT}`
    );

});