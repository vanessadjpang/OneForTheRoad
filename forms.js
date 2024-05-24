document.addEventListener('DOMContentLoaded', function () {
    const tripForm = document.getElementById('tripForm');
    const activityFormContainer = document.getElementById('activityForm');

    tripForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const tripStart = new Date(document.getElementById('tripStart').value);
        const tripEnd = new Date(document.getElementById('tripEnd').value);

        if (tripStart > tripEnd) {
            alert('Start date must be before end date.');
            return;
        }

        // Clear previous activity forms
        activityFormContainer.innerHTML = '';

        const days = (tripEnd - tripStart) / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(tripStart);
            currentDate.setDate(currentDate.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];
            createDateContainer(dateStr);
            createActivityForm(dateStr);
        }
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
});
