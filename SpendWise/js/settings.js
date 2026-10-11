const reminderTime =
    document.getElementById("reminderTime");

const setReminder =
    document.getElementById("setReminder");

const reminderStatus =
    document.getElementById("reminderStatus");


setReminder.addEventListener("click", function () {

    const selectedTime =
        reminderTime.value;

    if (!selectedTime) {

        reminderStatus.textContent =
            "⚠️ Please select a reminder time.";

        return;
    }


    localStorage.setItem(
        "spendwiseReminderTime",
        selectedTime
    );


    reminderStatus.textContent =
        "✅ Reminder set for " +
        formatReminderTime(selectedTime);

});


function formatReminderTime(time) {

    const parts =
        time.split(":");

    let hours =
        Number(parts[0]);

    const minutes =
        parts[1];

    const period =
        hours >= 12 ? "PM" : "AM";

    hours =
        hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}
    const savedReminderTime =
    localStorage.getItem("spendwiseReminderTime");

if (savedReminderTime) {

    reminderTime.value =
        savedReminderTime;

    reminderStatus.textContent =
        "✅ Reminder set for " +
        formatReminderTime(savedReminderTime);
}
/* =========================================
   DAILY REMINDER NOTIFICATION
========================================= */

function checkReminder() {

    const savedTime =
        localStorage.getItem("spendwiseReminderTime");


    if (!savedTime) {
        return;
    }


    const now =
        new Date();


    const currentHours =
        String(now.getHours()).padStart(2, "0");


    const currentMinutes =
        String(now.getMinutes()).padStart(2, "0");


    const currentTime =
        `${currentHours}:${currentMinutes}`;


    if (currentTime === savedTime) {

        const today =
            now.toISOString().split("T")[0];


        const lastReminder =
            localStorage.getItem(
                "spendwiseLastReminder"
            );


        if (lastReminder !== today) {

            showReminderNotification();


            localStorage.setItem(
                "spendwiseLastReminder",
                today
            );

        }

    }

}


/* =========================================
   SHOW NOTIFICATION
========================================= */

function showReminderNotification() {

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "💰 SpendWise Reminder",
            {
                body:
                    "Don't forget to enter your offline spending for today!"
            }
        );

    }

}


/* =========================================
   REQUEST NOTIFICATION PERMISSION
========================================= */

if ("Notification" in window) {

    if (
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }

}


/* Check every minute */

setInterval(
    checkReminder,
    60000
);
