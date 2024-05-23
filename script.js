document.addEventListener("DOMContentLoaded", function() {
    const hardcodedUsers = [
        { username: "user1", password: "password1" },
        { username: "user2", password: "password2" },
        { username: "user3", password: "password3" }
    ];

    const loginForm = document.getElementById("loginForm");
    const loginContainer = document.getElementById("loginContainer");
    const plannerContainer = document.getElementById("plannerContainer");
    const loginError = document.getElementById("loginError");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = hardcodedUsers.find(user => user.username === username && user.password === password);

        if (user) {
            alert("Login successful!");
            window.location.href = "planner.html"; // Redirect to planner.html
        } else {
            loginError.style.display = "block";
            alert("Invalid username or password.");
        }
    });
});

//for signup
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("emailAddress").value;
    const password = document.getElementById("signupPassword").value;

    const newUser = { username: username, password: password };

    alert("Signup successful!");

    // to redirect to login page after signup
    window.location.href = "index.html";
});
//end of signup

//sidebar for planner page
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    sidebar.classList.toggle('visible');
    content.classList.toggle('shifted');
}
// Add event listener for the sidebar menu
document.querySelector('.sidebar').addEventListener('click', toggleSidebar);

// Add event listener for the content to hide the sidebar when clicked
document.querySelector('.content').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    if (sidebar.classList.contains('visible')) {
        sidebar.classList.remove('visible');
        body.classList.remove('shifted');
        content.classList.remove('shifted');
    }
});

// Export PDF function for planner page
document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const content = document.querySelector("#content");
  
    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      const ratio = imgWidth / pdfWidth;
      const adjustedHeight = imgHeight / ratio;
  
      let heightLeft = adjustedHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, adjustedHeight);
  
      heightLeft -= pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - adjustedHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, adjustedHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save("TripItinerary.pdf");
    });
  });


//To read JSON
// Fetch and populate itinerary data
fetch('activities.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the data to the console to verify
        populateItinerary(data); // Call a function to handle the data
    })
    .catch(error => console.error('Error fetching the JSON file:', error));

    function populateItinerary(itineraryData) {
    const daysContainer = document.getElementById('daysContainer');
    const remindersContainer = document.getElementById('remindersContainer').querySelector('.list-group');
    daysContainer.innerHTML = ''; // Clear any existing content
    remindersContainer.innerHTML = ''; // Clear any existing reminders
    daysContainer.classList.add('daysContainer'); // Add the class to apply CSS

    // Sort the activities by date
    itineraryData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group activities by date
    const groupedByDate = itineraryData.reduce((acc, item) => {
        (acc[item.date] = acc[item.date] || []).push(item);
        return acc;
    }, {});

    // Iterate through each date group and create a box for each date
    for (const [date, activities] of Object.entries(groupedByDate)) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('day');

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long'
        }) + `<br>` + new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        dateDiv.innerHTML = `<h3>${formattedDate}</h3>`;

        activities.forEach(item => {
            const activityDiv = document.createElement('div');
            activityDiv.classList.add('activity');

            // Parse time if available
            const time = item.time ? new Date(`${item.date}T${item.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

            let htmlContent = `<h4>${item.activity}</h4>`;

            if (time) {
                htmlContent += `<p><b>Time:</b> ${time}</p>`;
            }
            if (item.duration) {
                htmlContent += `<p><b>Duration:</b> ${item.duration} hours</p>`;
            }
            if (item.address) {
                htmlContent += `<p><b>Address:</b> ${item.address}</p>`;
            }
            if (item.transport) {
                htmlContent += `<p><b>Transport:</b> ${item.transport}</p>`;
            }
            if (item.additionalInformation) {
                htmlContent += `<p><b>Additional Information:</b> ${item.additionalInformation}</p>`;
            }
            if (item.reservationRequired) {
                htmlContent += `<p><i>Reservation Required?</i> Yes</p>`;

                // Add to reminders checklist
                const reminderItem = document.createElement('li');
                reminderItem.classList.add('list-group-item');
                reminderItem.innerHTML = `
                    <label> <input type="checkbox" id="reminder-${item.activity}">
                    <label for="reminder-${item.activity}"> <b>${item.activity} </b> <br> <i>${item.additionalInformation}</i> <br> ${formattedDate}</label>
                </label>`;
                remindersContainer.appendChild(reminderItem);
             // Add event listener to handle checkbox state change
             const checkbox = reminderItem.querySelector('input[type="checkbox"]');
             checkbox.addEventListener('change', () => handleReminderCompletion(reminderItem, checkbox.checked));
         }

            activityDiv.innerHTML = htmlContent;
            dateDiv.appendChild(activityDiv);
        });

        daysContainer.appendChild(dateDiv);
    }
        // Initial sorting
        sortReminders();
}
// Function to handle reminder completion
function handleReminderCompletion(item, isCompleted) {
    if (isCompleted) {
        item.classList.add('completed');
        // Move to the bottom of the list
        item.parentNode.appendChild(item);
    } else {
        item.classList.remove('completed');
 // Re-sort reminders after completion change
    sortReminders();
    }
    // Function to sort reminders based on date and completion status
    function sortReminders() {
    const remindersContainer = document.getElementById('remindersContainer').querySelector('.list-group');
    const reminderItems = Array.from(remindersContainer.children);

    reminderItems.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        const isCompletedA = a.classList.contains('completed');
        const isCompletedB = b.classList.contains('completed');

        if (isCompletedA && !isCompletedB) return 1;
        if (!isCompletedA && isCompletedB) return -1;
        return dateA - dateB;
    });

    reminderItems.forEach(item => remindersContainer.appendChild(item));
};}

//End of JSON


document.addEventListener("DOMContentLoaded", function() {
    let tripStart, tripEnd;

    function showPlanner() {
        document.querySelector('nav.sidebar').style.display = 'block';
        document.querySelector('main').style.display = 'block';
    }

    function hidePlanner() {
        document.querySelector('nav.sidebar').style.display = 'none';
        document.querySelector('main').style.display = 'none';
    }

    function loadSavedItineraries() {
        const savedItinerariesDiv = document.getElementById('savedItineraries');
        savedItinerariesDiv.innerHTML = '';

        const itineraries = document.querySelectorAll('.itinerary');
        itineraries.forEach(plan => {
            const planDiv = document.createElement('div');
            planDiv.innerHTML = `<strong>${plan.querySelector('.itinerary-name').textContent}</strong><br>${plan.innerHTML}`;
            savedItinerariesDiv.appendChild(planDiv);
        });
    }

    showPlanner();
    loadSavedItineraries();

    document.getElementById('generateDaysButton').addEventListener('click', function() {
        tripStart = document.getElementById("tripStart").value;
        tripEnd = document.getElementById("tripEnd").value;

        if (tripStart && tripEnd) {
            const days = calculateDays(tripStart, tripEnd);
            const tabContainer = document.getElementById("tabContainer");
            const daysContainer = document.getElementById("daysContainer");
            tabContainer.innerHTML = '';
            daysContainer.innerHTML = '';
            days.forEach((day, index) => {
                const dayId = `Day${index + 1}`;
                const tab = document.createElement("button");
                tab.classList.add("tablinks");
                tab.textContent = `Day ${index + 1}`;
                tab.setAttribute("onclick", `openDay(event, '${dayId}')`);
                tabContainer.appendChild(tab);

                const dayContent = document.createElement("div");
                dayContent.id = dayId;
                dayContent.classList.add("tabcontent");
                dayContent.innerHTML = `
                    <h3>Day ${index + 1}</h3>
                    <span id="${dayId}-summary" class="day-summary">No details entered</span>
                    <button type="button" onclick="showForm('${dayId}-form')">Add Details</button>
                    <button type="button" onclick="hideForm('${dayId}-form')">Hide Details</button>
                    <div id="${dayId}-form" style="display:none;">
                        <label for="activity-${index + 1}">Activity:</label>
                        <input type="text" id="activity-${index + 1}" placeholder="Enter activity" oninput="updateSummary('${dayId}')">
                        <label for="time-${index + 1}">Time:</label>
                        <input type="time" id="time-${index + 1}" oninput="updateSummary('${dayId}')">
                        <label for="address-${index + 1}">Address:</label>
                        <input type="text" id="address-${index + 1}" placeholder="Enter address" oninput="updateSummary('${dayId}')">
                        <label for="transport-${index + 1}">Transport:</label>
                        <input type="text" id="transport-${index + 1}" placeholder="Enter transport" oninput="updateSummary('${dayId}')">
                        <label for="additionalInfo-${index + 1}">Additional Information:</label>
                        <textarea id="additionalInfo-${index + 1}" placeholder="Enter additional information" oninput="updateSummary('${dayId}')"></textarea>
                        <label for="reservation-${index + 1}">Reservation required:</label>
                        <input type="checkbox" id="reservation-${index + 1}" onchange="updateSummary('${dayId}')">
                    </div>
                `;
                daysContainer.appendChild(dayContent);
            });
            document.getElementById('plannerForm').style.display = 'block';
        }
    });

    document.getElementById('plannerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveItinerary();
    });

    window.openDay = function(evt, dayId) {
        const tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(dayId).style.display = "block";
        evt.currentTarget.className += " active";
    }

    window.showForm = function(formId) {
        document.getElementById(formId).style.display = 'block';
    }

    window.hideForm = function(formId) {
        document.getElementById(formId).style.display = 'none';
    }

    window.updateSummary = function(dayId) {
        const activity = document.querySelector(`#${dayId}-form input[id^='activity-']`).value;
        const time = document.querySelector(`#${dayId}-form input[id^='time-']`).value;
        const address = document.querySelector(`#${dayId}-form input[id^='address-']`).value;
        const transport = document.querySelector(`#${dayId}-form input[id^='transport-']`).value;
        const additionalInfo = document.querySelector(`#${dayId}-form textarea[id^='additionalInfo-']`).value;
        const reservation = document.querySelector(`#${dayId}-form input[id^='reservation-']`).checked;

        const summary = `${activity ? 'Activity: ' + activity : ''} ${time ? '| Time: ' + time : ''} ${address ? '| Address: ' + address : ''} ${transport ? '| Transport: ' + transport : ''} ${additionalInfo ? '| Additional Info: ' + additionalInfo : ''} ${reservation ? '| Reservation Required' : ''}`;
        
        document.getElementById(`${dayId}-summary`).textContent = summary.trim() || 'No details entered';
    }

    function calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = [];
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d));
        }
        return days;
    }

    function saveItinerary() {
        const daysContainer = document.getElementById('daysContainer');
        const dayPlans = daysContainer.getElementsByClassName('tabcontent');
        const calendarView = document.getElementById('calendarView');
        calendarView.innerHTML = '';
        const itineraryName = document.getElementById('itineraryName').value;

        if (!itineraryName) {
            alert('Please enter an itinerary name');
            return;
        }

        const itineraryContent = document.createElement('div');
        itineraryContent.classList.add('itinerary');
        const itineraryTitle = document.createElement('h3');
        itineraryTitle.classList.add('itinerary-name');
        itineraryTitle.textContent = itineraryName;
        itineraryContent.appendChild(itineraryTitle);

        const tripStartDate = new Date(tripStart);
        Array.from(dayPlans).forEach((dayPlan, index) => {
            const dayTitle = `Day ${index + 1} - ${tripStartDate.toDateString()}`;
            tripStartDate.setDate(tripStartDate.getDate() + 1);

            const activity = dayPlan.querySelector(`#activity-${index + 1}`).value;
            const time = dayPlan.querySelector(`#time-${index + 1}`).value;
            const address = dayPlan.querySelector(`#address-${index + 1}`).value;
            const transport = dayPlan.querySelector(`#transport-${index + 1}`).value;
            const additionalInfo = dayPlan.querySelector(`#additionalInfo-${index + 1}`).value;
            const reservation = dayPlan.querySelector(`#reservation-${index + 1}`).checked;

            if (activity || time || address || transport || additionalInfo || reservation) {
                const dayItem = document.createElement('div');
                dayItem.innerHTML = `
                    <strong>${dayTitle}:</strong>
                    <ul>
                        <li>Activity: ${activity || 'No activity entered'}</li>
                        <li>Time: ${time || 'No time entered'}</li>
                        <li>Address: ${address || 'No address entered'}</li>
                        <li>Transport: ${transport || 'No transport entered'}</li>
                        <li>Additional Information: ${additionalInfo || 'No additional information'}</li>
                        <li>Reservation Required: ${reservation ? 'Yes' : 'No'}</li>
                    </ul>
                `;
                itineraryContent.appendChild(dayItem);
            }
        });

        document.getElementById('savedItineraries').appendChild(itineraryContent);

        // Create Calendar View
        calendarView.innerHTML = '<h4>Calendar View</h4>';
        const calendarTable = document.createElement('table');
        calendarTable.classList.add('calendar-table');
        calendarTable.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Time</th>
                    <th>Address</th>
                    <th>Transport</th>
                    <th>Additional Info</th>
                    <th>Reservation</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const calendarStartDate = new Date(tripStart);
        Array.from(dayPlans).forEach((dayPlan, index) => {
            const dayRow = document.createElement('tr');
            dayRow.innerHTML = `
                <td>${calendarStartDate.toDateString()}</td>
                <td>${dayPlan.querySelector(`#activity-${index + 1}`).value || ' '}</td>
                <td>${dayPlan.querySelector(`#time-${index + 1}`).value || ' '}</td>
                <td>${dayPlan.querySelector(`#address-${index + 1}`).value || ' '}</td>
                <td>${dayPlan.querySelector(`#transport-${index + 1}`).value || ' '}</td>
                <td>${dayPlan.querySelector(`#additionalInfo-${index + 1}`).value || ' '}</td>
                <td>${dayPlan.querySelector(`#reservation-${index + 1}`).checked ? 'Yes' : ''}</td>
            `;
                calendarTable.querySelector('tbody').appendChild(dayRow);
                calendarStartDate.setDate(calendarStartDate.getDate() + 1);
        });

        calendarView.appendChild(calendarTable);
    }


    //Countdown timer fake
    function countdownTimer(targetDate) {
        const countdownElement = document.getElementById('countdown-fake');
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
    
        function updateCountdown() {
            const now = new Date();
            const timeDifference = targetDate - now;
    
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
            daysElement.textContent = days;
            hoursElement.textContent = hours;
            minutesElement.textContent = minutes;
            secondsElement.textContent = seconds;
    
            if (timeDifference < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "<h2>Welcome back!</h2>";
            }
        }
    
        const interval = setInterval(updateCountdown, 1000);
    }
    
    const targetDate = new Date('December 25, 2024 00:00:00');
    countdownTimer(targetDate);
    
});