 // --- VARIABLES ---
let nav = 0;
let selectedDate = new Date();
const calendarGrid = document.getElementById('calendar-grid');

// Sidebar Elements
const sliderTrack = document.getElementById('slider-track');
const sidebarTitle = document.getElementById('sidebar-title');
const sidebarSub = document.getElementById('sidebar-sub');
const sidebarContent = document.getElementById('sidebar-content');
const detailsContent = document.getElementById('details-content');
const backBtn = document.getElementById('back-to-list');

// Event Data
const eventData = [
    { id: 1, date: '2025-11-05', title: "Q4 Strategy Meeting", time: "10:00 AM - 11:30 AM", type: "meeting", location: "Room 404", desc: "Discussing Q4 goals and marketing spend for the upcoming holiday season." },
    { id: 2, date: '2025-11-20', title: "Design Review", time: "1:00 PM - 2:00 PM", type: "meeting", location: "Zoom", desc: "Reviewing the new dashboard mockups with the product team." },
    { id: 3, date: '2025-11-20', title: "Team Happy Hour 🍻", time: "5:30 PM", type: "launch", location: "The Local Pub", desc: "Drinks are on the house! Come celebrate the recent release." },
    { id: 4, date: '2025-12-01', title: "Project Launch", time: "9:00 AM", type: "launch", location: "Auditorium", desc: "Go live date for the new customer portal." }
];

// --- CALENDAR LOGIC ---

function loadCalendar() {
    const dt = new Date();
    if (nav !== 0) dt.setMonth(new Date().getMonth() + nav);

    const month = dt.getMonth();
    const year = dt.getFullYear();
    
    document.getElementById('month-display').innerText = dt.toLocaleDateString('en-us', { month: 'long', year: 'numeric' });

    calendarGrid.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(d => {
        const el = document.createElement('div');
        el.classList.add('weekday');
        el.innerText = d;
        calendarGrid.appendChild(el);
    });

    for(let i=0; i<firstDayIndex; i++) {
        const pad = document.createElement('div');
        pad.classList.add('day-cell');
        pad.style.background = "#fcfcfc";
        calendarGrid.appendChild(pad);
    }

    for(let i=1; i<=daysInMonth; i++) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell');
        
        const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        cell.innerHTML = `<span class="date-num">${i}</span>`;

        const selKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
        if(dateKey === selKey) cell.classList.add('selected-day');
        
        const today = new Date();
        if(i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }

        const events = eventData.filter(e => e.date === dateKey);
        if(events.length > 0) {
            events.forEach(e => {
                const dot = document.createElement('div');
                dot.classList.add('event-dot');
                if(e.type === 'launch') dot.classList.add('launch');
                cell.appendChild(dot);
            });
        }

        cell.addEventListener('click', () => {
            selectedDate = new Date(year, month, i);
            loadCalendar();
            showListPanel(); // Ensure we are looking at the list
            renderSidebarList();
        });

        calendarGrid.appendChild(cell);
    }
}

// --- SIDEBAR LOGIC ---

// 1. Render the List View
function renderSidebarList() {
    const fullDateStr = selectedDate.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' });
    sidebarSub.innerText = selectedDate.getFullYear();
    sidebarTitle.innerText = fullDateStr;

    const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
    const dayEvents = eventData.filter(e => e.date === dateKey);

    sidebarContent.innerHTML = '';

    if(dayEvents.length === 0) {
        sidebarContent.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">💤</span>
                <p>No events scheduled.</p>
            </div>`;
    } else {
        const ul = document.createElement('ul');
        ul.classList.add('events-list');
        
        dayEvents.forEach(evt => {
            const li = document.createElement('li');
            li.classList.add('event-card');
            if(evt.type === 'launch') li.classList.add('launch');
            
            li.innerHTML = `
                <div class="event-title">${evt.title}</div>
                <div class="event-time">🕒 ${evt.time}</div>
            `;
            
            // Click Card -> Trigger Slide to Details
            li.addEventListener('click', () => showDetailsPanel(evt));
            ul.appendChild(li);
        });
        sidebarContent.appendChild(ul);
    }
}

// 2. Render the Details View
function renderDetails(evt) {
    detailsContent.innerHTML = `
        <span class="detail-badge ${evt.type}">${evt.type}</span>
        <h3 class="detail-title">${evt.title}</h3>
        <div class="detail-time">🕒 ${evt.time}</div>
        <p class="detail-desc">${evt.desc}</p>
        
        <div class="detail-row">
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div>${evt.location}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Date</div>
                <div>${selectedDate.toLocaleDateString()}</div>
            </div>
        </div> 
        <button id="share-btn" class="share-btn">Share Event</button>
    `;
}

// --- SLIDING VIEW NAVIGATION ---

function showDetailsPanel(evt) {
    // 1. Populate data
    renderDetails(evt);
    
    // 2. Add Share Logic
    const shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: evt.title,
                text: `Event: ${evt.title}\nTime: ${evt.time}\nLocation: ${evt.location}\n\n${evt.desc}`,
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    alert('Share feature not supported on this device/browser.');
                }
            } catch (err) {
                console.error('Error sharing:', err);
            }
        });
    }

    // 3. Slide track to left (-50%)
    sliderTrack.style.transform = 'translateX(-50%)';
}

function showListPanel() {
    // Slide track back to 0
    sliderTrack.style.transform = 'translateX(0)';
}

// Back Button Logic
backBtn.addEventListener('click', showListPanel);

// Calendar Navigation
document.getElementById('next-btn').addEventListener('click', () => { nav++; loadCalendar(); });
document.getElementById('prev-btn').addEventListener('click', () => { nav--; loadCalendar(); });

// Init
loadCalendar();
renderSidebarList();
