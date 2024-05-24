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
            createActivityForm(currentDate.toISOString().split('T')[0]);
        }
    });

    function createActivityForm(date) {
        const activityForm = document.createElement('form');
        activityForm.classList.add('activityForm');

        activityForm.innerHTML = `
            <h3>Activity for ${date}</h3>
            <div class="activityForm-item">
                <label for="events">Activity:</label>
                <input type="text" id="events-${date}" name="events" value="">
            </div>
            <div class="activityForm-item">
                <label for="time">Time:</label>
                <input type="time" id="time-${date}" name="time" value="">
            </div>
            <div class="activityForm-item">
                <label for="transportation">Transportation:</label>
                <input type="text" id="transportation-${date}" name="transportation" value="">
            </div>
            <div class="activityForm-item">
                <label for="address">Address:</label>
                <input type="text" id="address-${date}" name="address" value="">
            </div>
            <div class="activityForm-item">
                <label for="reservation">Reminder?</label>
                <input type="checkbox" id="reservation-${date}" name="reservation" value="">
            </div>
            <div class="activityForm-item">
                <label for="additionalinformation">Additional Information</label>
                <input type="text" id="additionalInformation-${date}" name="additionalinformation" value="">
            </div>
            <button type="button" class="btn-add-activity">Add Another Activity</button>
            
        `;


        activityForm.querySelector('.btn-add-activity').addEventListener('click', function () {
            const newActivity = activityForm.cloneNode(true);
            newActivity.querySelector('h3').innerText = `Activity for ${date}`;
            newActivity.querySelector('.btn-add-activity').remove();
            activityFormContainer.appendChild(newActivity);
        });

        activityFormContainer.appendChild(activityForm);
    }
});
