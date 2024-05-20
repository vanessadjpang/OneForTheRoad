// Start of Login portion
document.addEventListener("DOMContentLoaded", function() {
    const users = {
        user1: "password1",
        user2: "password2"
    };

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (users[username] && users[username] === password) {
                alert("Login successful!");
                window.location.href = 'planner.html';
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    }
});
//End of login portion

// Logout alert
function logout() {
    alert("You will be redirected to the Login page");
}

//sidebar for planner page
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    sidebar.classList.toggle('visible');
}

//Search function for planner page
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchStatus = document.getElementById('searchStatus');
  
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the form from submitting normally
      const keyword = searchInput.value.trim().toLowerCase();
      if (keyword) {
        // Remove previous highlights
        removeHighlights();
        // Highlight new matches and show status
        const matchCount = highlightText(keyword);
        if (matchCount === 0) {
          searchStatus.textContent = `No matches found for "${keyword}"   `;
        } else {
          searchStatus.textContent = `${matchCount} match(es) found for "${keyword}"   `;
        }
      }
    });
  
    function highlightText(keyword) {
      let matchCount = 0;
      const regex = new RegExp(`(${keyword})`, 'gi');
      walkText(document.body, function (node) {
        const matches = node.textContent.match(regex);
        if (matches) {
          const span = document.createElement('span');
          span.innerHTML = node.textContent.replace(regex, '<span class="highlight">$1</span>');
          node.replaceWith(span);
          matchCount += matches.length;
        }
      });
      return matchCount;
    }
  
    function removeHighlights() {
      const highlights = document.querySelectorAll('.highlight');
      highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize(); // Merge adjacent text nodes
      });
    }
  
    function walkText(node, callback) {
      if (node.nodeType === 3) {
        callback(node);
      } else {
        node.childNodes.forEach(child => walkText(child, callback));
      }
    }
  });


//To read JSON
fetch('activities.json')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the data to the console to verify
                populateItinerary(data); // Call a function to handle the data
            })
            .catch(error => console.error('Error fetching the JSON file:', error));

            function populateItinerary(itineraryData) {
                const daysContainer = document.getElementById('daysContainer');
                itineraryData.forEach(item => {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('day');
                    dayDiv.innerHTML = `
                        <h3>${item.activity}</h3>
                        <p><strong>Time:</strong> ${item.time}</p>
                        <p><strong>Duration:</strong> ${item.duration} hours</p>
                        <p><strong>Address:</strong> ${item.address}</p>
                        <p><strong>Transport:</strong> ${item.transport}</p>
                        <p><strong>Additional Information:</strong> ${item.additionalInformation}</p>
                        <p><strong>Reservation Required:</strong> ${item.reservationRequired ? 'Yes' : 'No'}</p>
                    `;
                    daysContainer.appendChild(dayDiv);
                });
            }

document.addEventListener("DOMContentLoaded", function() {
    let currentUser = 'user1'; // Default user for this example
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

    document.getElementById('generateDaysButton')?.addEventListener('click', function() {
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
        calendarView.innerHTML = '<h3>Calendar View</h3>';
        const calendarTable = document.createElement('table');
        calendarTable.innerHTML = '<tr><th>Date</th><th>Activity</th><th>Time</th><th>Address</th><th>Transport</th><th>Additional Info</th><th>Reservation</th></tr>';

        const calendarStartDate = new Date(tripStart);
        Array.from(dayPlans).forEach((dayPlan, index) => {
            const dayRow = document.createElement('tr');
            dayRow.innerHTML = `
                <td>${calendarStartDate.toDateString()}</td>
                <td>${dayPlan.querySelector(`#activity-${index + 1}`).value || 'No activity entered'}</td>
                <td>${dayPlan.querySelector(`#time-${index + 1}`).value || 'No time entered'}</td>
                <td>${dayPlan.querySelector(`#address-${index + 1}`).value || 'No address entered'}</td>
                <td>${dayPlan.querySelector(`#transport-${index + 1}`).value || 'No transport entered'}</td>
                <td>${dayPlan.querySelector(`#additionalInfo-${index + 1}`).value || 'No additional information'}</td>
                <td>${dayPlan.querySelector(`#reservation-${index + 1}`).checked ? 'Yes' : 'No'}</td>
            `;
            calendarTable.appendChild(dayRow);
            calendarStartDate.setDate(calendarStartDate.getDate() + 1);
        });

        calendarView.appendChild(calendarTable);
    }
});




// End of Chat GPT's script

/*
function handleSelectionChange() {
    var select = document.getElementById('Destinationdropdown');
    var selectedValues = Array.from(select.selectedOptions).map(option => option.value);
    console.log('Selected Values:', selectedValues);
}

//Set dynamic dropdown list
document.addEventListener('DOMContentLoaded', function() {
   var selectElement = document.getElementById('Destinationdropdown');

   selectElement.addEventListener('change', function()
    {
      console.log('Value changed:', this.value);
      var selectedDestination = this.value.replace(/\s+/g, '');  // Remove spaces for image filenames

      var values = Array.from(selectElement.selectedOptions).map(option => option.value);
      console.log(values); // Log selected values to the console

       // Example: Changing an image based on the selection
       var imageElement = document.getElementById('destinationImage');
       if (imageElement) {
           imageElement.src = './images/' + selectedDestination + '.webp';
           imageElement.alt = selectedDestination;
       }

       // Example: Updating text content
       var descriptionElement = document.getElementById('destinationDescription');
       if (descriptionElement) {
           descriptionElement.textContent = 'You selected ' + selectedDestination;
       }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    addFlightSegment();  // Add the first segment by default
});

function addFlightSegment() {
    const container = document.getElementById('flightSegments');
    const index = container.children.length + 1;
    const segment = document.createElement('div');
    segment.innerHTML = `
        <strong>Segment ${index}</strong><br>
        Departure City: <input type="text" name="departureCity${index}" required>
        Destination City: <input type="text" name="destinationCity${index}" required>
        Date: <input type="date" name="date${index}" required>
        Time: <input type="time" name="timeofflight${index}" required>
        <button type="button" onclick="removeFlightSegment(this)">Remove Segment</button>
    `;
    container.appendChild(segment);
}

function removeFlightSegment(button) {
    button.parentElement.remove();
}

document.getElementById('itineraryForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    // Gather all data here and possibly make an API call or form submission
    console.log('Form submitted. Handle accordingly.');
});

document.addEventListener('DOMContentLoaded', function() {
    addTravelDay();  // Add the first day by default
});

function addTravelDay() {
    const container = document.getElementById('travelDays');
    const dayIndex = container.children.length + 1;
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day-section');
    dayDiv.innerHTML = `
        <h3>Day ${dayIndex}</h3>
        Date: <input type="date" name="date${dayIndex}" required>
        <div class="activities">
            <button type="button" onclick="addActivity(this.parentNode)">Add Activity</button>
        </div>
    `;
    container.appendChild(dayDiv);
}

function addActivity(activityContainer) {
    const activityIndex = activityContainer.querySelectorAll('.activity').length + 1;
    const activityDiv = document.createElement('div');
    activityDiv.classList.add('activity');
    activityDiv.innerHTML = `
        Activity ${activityIndex}: <input type="text" name="activity${activityIndex}" placeholder="Enter activity details" required>
        <button type="button" onclick="this.parentNode.remove()">Remove Activity</button>
    `;
    activityContainer.insertBefore(activityDiv, activityContainer.lastChild);

    document.getElementById('eventForm').style.display = 'block';
}

document.getElementById('itineraryForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent traditional form submission
    // Gather all data here and handle accordingly
    console.log('Itinerary submitted. Handle accordingly.');
});


document.addEventListener('DOMContentLoaded', function() {
    const reservationCheckbox = document.getElementById('reservation');
    const checklistDiv = document.getElementById('checklistItems');

    reservationCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Add an item to the checklist and ensure it's visible
            const li = document.createElement('li');
            li.textContent = 'Booking needed for ' + document.getElementById('events').value;
            document.getElementById('checklistItems').appendChild(li);
            checklistDiv.style.display = 'block'; // Make sure to show the checklist
        } else {
            // Optionally, hide the checklist if no items are needed
            document.getElementById('checklistItems').innerHTML = ''; // Clear the list
            checklistDiv.style.display = 'none'; // Hide if not needed
        }
             // If unchecked, remove from the checklist
            const itemToRemove = document.getElementById('checklistItems');
            if (itemToRemove) {
            checklistItems.removeChild(itemToRemove);
                    }
    });
}); */
