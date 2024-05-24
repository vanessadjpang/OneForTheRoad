document.addEventListener('DOMContentLoaded', function () {
    const tripForm = document.getElementById('tripForm');
    const activityFormContainer = document.getElementById('activityForm');
    const summaryContainer = document.getElementById('summaryContainer');
    const generateSummaryButton = document.getElementById('generateSummaryButton');

    tripForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const tripStart = new Date(document.getElementById('tripStart').value);
        const tripEnd = new Date(document.getElementById('tripEnd').value);

        if (tripStart > tripEnd) {
            alert('Start date must be before end date.');
            return;
        }

        // Clear previous activity forms and summary
        activityFormContainer.innerHTML = '';
        summaryContainer.innerHTML = '';

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
        const dateContainer = createDateContainer(date);
        const activityForm = document.createElement('form');
        activityForm.classList.add('activityForm');

        activityForm.innerHTML = `
            <div class="activityForm-item">
                <label for="events-${date}">Activity:</label>
                <input type="text" id="events-${date}" name="events" value="">
            </div>
            <div class="activityForm-item">
                <label for="time-${date}">Time:</label>
                <input type="time" id="time-${date}" name="time" value="">
            </div>
            <div class="activityForm-item">
                <label for="transportation-${date}">Transportation:</label>
                <input type="text" id="transportation-${date}" name="transportation" value="">
            </div>
            <div class="activityForm-item">
                <label for="address-${date}">Address:</label>
                <input type="text" id="address-${date}" name="address" value="">
            </div>
            <div class="activityForm-item">
                <label for="reservation-${date}">Reminder?</label>
                <input type="checkbox" id="reservation-${date}" name="reservation" value="">
            </div>
            <div class="activityForm-item">
                <label for="additionalinformation-${date}">Additional Information</label>
                <input type="text" id="additionalInformation-${date}" name="additionalinformation" value="">
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
    });

    function generateSummary() {
        summaryContainer.innerHTML = ''; // Clear previous summary

        const dateContainers = document.querySelectorAll('.dateContainer');
        dateContainers.forEach(dateContainer => {
            const date = dateContainer.id.replace('date-container-', '');
            const activityForms = dateContainer.querySelectorAll('.activityForm');
            if (activityForms.length > 0) {
                const daySummary = document.createElement('div');
                daySummary.classList.add('daySummary');
                daySummary.innerHTML = `<h3>${date}</h3>`;
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
});
