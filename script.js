

//sidebar for itinerary page
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

    //Countdown timer fake

    function countdownTimer(targetDate) {
        const countdownElement = document.getElementById('countdown');
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date();
            const timeDifference = targetDate - now;

            if (timeDifference < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "<h2>Welcome back!</h2>";
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            daysElement.textContent = days;
            hoursElement.textContent = hours;
            minutesElement.textContent = minutes;
            secondsElement.textContent = seconds;
        }

        const interval = setInterval(updateCountdown, 1000);
    }

// Initialize the countdown timer
const targetDate = new Date('December 25, 2024 00:00:00');
countdownTimer(targetDate);
;

    //To read JSON to fetch and populate itinerary and reminders data
    fetch('activities.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the data to the console to verify for debugging
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