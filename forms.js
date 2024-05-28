//Start of script to define the functions
document.addEventListener('DOMContentLoaded', function () {
    const tripForm = document.getElementById('tripForm');
    const activityFormContainer = document.getElementById('activityForm');
    const summaryContainer = document.getElementById('summaryContainer');
    const remindersContainer = document.getElementById('remindersContainer');
    const remindersHeader = document.getElementById('remindersHeader');
    const generateSummaryButton = document.getElementById('generateSummaryButton');
    const showExample = document.getElementById('showExample');

    //tripForm function
    tripForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const tripStart = new Date(document.getElementById('tripStart').value);
        const tripEnd = new Date(document.getElementById('tripEnd').value);

        if (tripStart > tripEnd) {
            alert('Start date must be before end date.');
            return;
        }

        // Clear previous activity forms, summaries, and reminders
        activityFormContainer.innerHTML = '';
        summaryContainer.innerHTML = '';
        remindersContainer.innerHTML = '';

        const days = (tripEnd - tripStart) / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(tripStart);
            currentDate.setDate(currentDate.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];
            createDateContainer(dateStr);
            createActivityForm(dateStr);
        }

        // Make sure the "Generate Summary" button is visible
        generateSummaryButton.style.display = 'block';
    });

    function createDateContainer(date) {
        let dateContainer = document.getElementById(`date-container-${date}`);
        if (!dateContainer) {
            dateContainer = document.createElement('div');
            dateContainer.id = `date-container-${date}`;
            dateContainer.classList.add('dateContainer');
            dateContainer.innerHTML = `<h2>Activities for ${date}</h2>`;
            const newActivityButton = document.createElement('button');
            newActivityButton.type = 'button';
            newActivityButton.textContent = 'New Activity';
            newActivityButton.classList.add('btn-new-activity');
            newActivityButton.addEventListener('click', function () {
                createActivityForm(date);
            });
            dateContainer.appendChild(newActivityButton);
            activityFormContainer.appendChild(dateContainer);
        }
        return dateContainer;
    }

    function createActivityForm(date) {
        const activityFormContainer = document.getElementById('activityForm');
        const dateContainer = createDateContainer(date);
        const activityForm = document.createElement('form');
        activityForm.classList.add('activityForm');

        activityForm.innerHTML = `
        <div class="activityForm-item">
        <label for="events-${date}">Activity:</label>
        <input type="text" id="events-${date}" name="events-${date}" value="">
    </div>
    <div class="activityForm-item">
        <label for="time-${date}">Time:</label>
        <input type="time" id="time-${date}" name="time-${date}" value="">
    </div>
    <div class="activityForm-item">
        <label for="transportation-${date}">Transportation:</label>
        <input type="text" id="transportation-${date}" name="transportation-${date}" value="">
    </div>
    <div class="activityForm-item">
        <label for="address-${date}">Address:</label>
        <input type="text" id="address-${date}" name="address-${date}" value="">
    </div>
    <div class="activityForm-item">
        <label for="reservation-${date}">Reminder?</label>
        <input type="checkbox" id="reservation-${date}" name="reservation-${date}" value="">
    </div>
    <div class="activityForm-item">
        <label for="additionalInformation-${date}">Additional Information</label>
        <input type="text" id="additionalInformation-${date}" name="additionalInformation-${date}" value="">
    </div>
    <button type="button" class="btn-delete-activity">Delete</button>
`;

        activityForm.querySelector('.btn-delete-activity').addEventListener('click', function () {
            activityForm.remove();
            // Check if there are no activity forms left, and hide the date container if empty
            if (dateContainer.querySelectorAll('.activityForm').length === 0) {
                dateContainer.querySelector('.btn-new-activity').style.display = 'block';
            }
        });

        const newActivityButton = dateContainer.querySelector('.btn-new-activity');
        dateContainer.insertBefore(activityForm, newActivityButton);
    }

    // Event listener for the "Generate Summary" button
    generateSummaryButton.addEventListener('click', function () {
        generateSummary();
        generateReminders();
        // Show the reminders header and container
        remindersHeader.style.display = 'block';
        remindersContainer.style.display = 'block';
        showExample.style.display = 'block';
        submitActivities();
    });

    function submitActivities() {
        const activityForms = document.querySelectorAll('.activityForm');
        let successfulSubmissions = 0;
        let totalSubmissions = activityForms.length;
        
        activityForms.forEach(activityForm => {
            const dateField = activityForm.querySelector('[id^="events-"]');
            if (!dateField) {
                console.error('Date field not found');
                return;
            }
            const date = dateField.id.split('-')[1];
            const events = activityForm.querySelector(`#events-${date}`)?.value || null;
            const transportation = activityForm.querySelector(`#transportation-${date}`)?.value || null;
            const address = activityForm.querySelector(`#address-${date}`)?.value;
            const reservation = activityForm.querySelector(`#reservation-${date}`)?.checked || false;
            const additionalInformation = activityForm.querySelector(`#additionalInformation-${date}`)?.value || null;
            const timeValue = activityForm.querySelector(`#time-${date}`)?.value;
            const time = timeValue ? new Date(`${date}T${timeValue}`) : new Date(date);



            const data = {
                date: date,
                events,
                transportation,
                time: time.toISOString(),
                address,
                reservation,
                additionalInformation
            };
    

            fetch('/planner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.error);
                }
                successfulSubmissions++;

                // Check if all submissions are done
                if (successfulSubmissions === totalSubmissions) {
                    alert('All activities saved successfully!');
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
                alert('Failed to save activity: ' + error.message);
            });
        });
    }





    function generateSummary() {
        summaryContainer.innerHTML = ''; // Clear previous summary

        const dateContainers = document.querySelectorAll('.dateContainer');
        dateContainers.forEach(dateContainer => {
            const date = dateContainer.id.replace('date-container-', '');
            const activityForms = dateContainer.querySelectorAll('.activityForm');
            if (activityForms.length > 0) {
                const dateObj = new Date(date);
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long'
                }) + `<br>` + new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                const daySummary = document.createElement('div');
                daySummary.classList.add('daySummary');
                daySummary.innerHTML = `<h3>${formattedDate}</h3>`;
                activityForms.forEach(activityForm => {
                    const activitySummary = document.createElement('div');
                    activitySummary.classList.add('activitySummary');
                    const activity = activityForm.querySelector(`#events-${date}`).value;
                    const time = activityForm.querySelector(`#time-${date}`).value;
                    const transportation = activityForm.querySelector(`#transportation-${date}`).value;
                    const address = activityForm.querySelector(`#address-${date}`).value;
                    const reservation = activityForm.querySelector(`#reservation-${date}`).checked ? 'Yes' : '';
                    const additionalInformation = activityForm.querySelector(`#additionalInformation-${date}`).value;

                    // Build the summary item only if fields are filled
                    activitySummary.innerHTML = `
                        ${activity ? `<p><strong>Activity:</strong> ${activity}</p>` : ''}
                        ${time ? `<p><strong>Time:</strong> ${time}</p>` : ''}
                        ${transportation ? `<p><strong>Transportation:</strong> ${transportation}</p>` : ''}
                        ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
                        ${reservation ? `<p><strong>Reminder:</strong> ${reservation}</p>` : ''}
                        ${additionalInformation ? `<p><strong>Additional Information:</strong> ${additionalInformation}</p>` : ''}
                    `;
                    daySummary.appendChild(activitySummary);
                });
                summaryContainer.appendChild(daySummary);
            }
        });
    }

    function generateReminders() {
        remindersContainer.innerHTML = ''; // Clear previous reminders

        const dateContainers = document.querySelectorAll('.dateContainer');
        dateContainers.forEach(dateContainer => {
            const date = dateContainer.id.replace('date-container-', '');
            const activityForms = dateContainer.querySelectorAll('.activityForm');
            activityForms.forEach(activityForm => {
                const reservation = activityForm.querySelector(`#reservation-${date}`).checked;
                if (reservation) {
                    const reminder = createReminderElement(date, activityForm);
                    remindersContainer.appendChild(reminder);
                }
            });
        });
    }

    function createReminderElement(date, activityForm) {
        const reminder = document.createElement('div');
        reminder.classList.add('reminder');

        const activity = activityForm.querySelector(`#events-${date}`).value;
        const additionalInformation = activityForm.querySelector(`#additionalInformation-${date}`).value;

        const dateObj = new Date(date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        reminder.innerHTML = `
            <input type="checkbox" class="reminder-checkbox">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Activity:</strong> ${activity}</p>
            <p><strong>Additional Information:</strong> ${additionalInformation}</p>
        `;

        reminder.querySelector('.reminder-checkbox').addEventListener('change', function () {
            if (this.checked) {
                reminder.style.textDecoration = 'line-through';
            } else {
                reminder.style.textDecoration = 'none';
            }
        });

        return reminder;
    }

        remindersContainer.appendChild(reminder);
    }
);
