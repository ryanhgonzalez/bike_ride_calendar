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
    { id: 1, date: "2025-12-01", title: "Winter Warm-Up Ride", time: "9:00 AM", type: "ride", location: "City Trailhead", desc: "Easy-paced ride to kick off the month and shake off cold-weather rust." },
    { id: 2, date: "2025-12-02", title: "Hill Climb Tuesday", time: "6:00 PM", type: "training", location: "Oakridge Hills", desc: "Group tackles a series of local climbs for strength-building." },
    { id: 3, date: "2025-12-03", title: "Sunset Social Spin", time: "4:30 PM", type: "social", location: "Riverside Loop", desc: "Short evening ride finishing with hot chocolate at the trailhead." },
    { id: 4, date: "2025-12-04", title: "Gravel Grinder Thursday", time: "5:00 PM", type: "gravel", location: "Pine Creek Trails", desc: "A 20-mile mixed-terrain ride for gravel bike enthusiasts." },
    { id: 5, date: "2025-12-05", title: "Night Lights Ride", time: "7:00 PM", type: "night", location: "City Park", desc: "A relaxed night ride—bright lights and reflective gear required." },
    { id: 6, date: "2025-12-06", title: "Saturday Long Haul", time: "8:00 AM", type: "endurance", location: "County Road Route", desc: "Weekly long-distance endurance ride (40–60 miles)." },
    { id: 7, date: "2025-12-07", title: "Recovery Coffee Cruise", time: "9:30 AM", type: "social", location: "Bike & Bean Cafe", desc: "Slow social ride ending with a stop for coffee and pastries." },
    { id: 8, date: "2025-12-08", title: "Commuter Skills Session", time: "6:00 PM", type: "workshop", location: "Community Center", desc: "Learn winter commuting tips, route safety, and cold-weather gear prep." },
    { id: 9, date: "2025-12-09", title: "Singletrack Tuesday", time: "5:30 PM", type: "mtb", location: "Forest Ridge Trails", desc: "Mountain bikers hit fast, flowy singletrack sections." },
    { id: 10, date: "2025-12-10", title: "Midweek Tempo Ride", time: "6:00 PM", type: "training", location: "Lakeside Loop", desc: "Steady moderate-speed group ride to build pace consistency." },
    { id: 11, date: "2025-12-11", title: "Winter Gear Workshop", time: "6:30 PM", type: "workshop", location: "Bike Shop HQ", desc: "Indoor meetup teaching bike maintenance and cold-weather layering." },
    { id: 12, date: "2025-12-12", title: "Frosty Friday Ride", time: "6:00 PM", type: "ride", location: "Neighborhood Loop", desc: "Casual community ride for all skill levels." },
    { id: 13, date: "2025-12-13", title: "Weekend Climbing Challenge", time: "8:00 AM", type: "training", location: "Summit Ridge", desc: "Riders attempt a cumulative elevation goal together." },
    { id: 14, date: "2025-12-14", title: "Family & Kids Bike Day", time: "10:00 AM", type: "family", location: "Central Park Loop", desc: "Kid-friendly loop with safety demos and activities." },
    { id: 15, date: "2025-12-15", title: "Urban Exploration Ride", time: "6:00 PM", type: "ride", location: "Downtown Plaza", desc: "Discover lesser-known bike-friendly routes around the city." },
    { id: 16, date: "2025-12-16", title: "Lakeside Sunrise Cruise", time: "6:30 AM", type: "scenic", location: "Lakeshore Path", desc: "Early morning scenic ride along the waterfront." },
    { id: 17, date: "2025-12-17", title: "Midweek MTB Skills Clinic", time: "5:30 PM", type: "mtb", location: "Trailside Park", desc: "Focus on cornering, braking, and control on dirt trails." },
    { id: 18, date: "2025-12-18", title: "Bikepacking 101 Night", time: "6:00 PM", type: "workshop", location: "Adventure Hub", desc: "Intro session covering gear, route planning, and overnight tips." },
    { id: 19, date: "2025-12-19", title: "Winter Solstice Ride (Early Edition)", time: "5:00 PM", type: "ride", location: "Old Mill Loop", desc: "Celebrating the approaching longest night with a festive group ride." },
    { id: 20, date: "2025-12-20", title: "Saturday Scenic 50", time: "8:00 AM", type: "endurance", location: "Country Roads", desc: "Beautiful countryside route, moderate pace, no-drop policy." },
    { id: 21, date: "2025-12-21", title: "Solstice Night Ride", time: "7:00 PM", type: "night", location: "Riverfront Path", desc: "Special nighttime group ride with holiday lights and music." },
    { id: 22, date: "2025-12-22", title: "Icebreaker Intervals", time: "6:00 PM", type: "training", location: "Track Oval", desc: "Short high-intensity interval session for performance-focused riders." },
    { id: 23, date: "2025-12-23", title: "Charity Toy Delivery Ride", time: "5:00 PM", type: "charity", location: "Community Center", desc: "Riders deliver toys or donations by bike to a local shelter." },
    { id: 24, date: "2025-12-24", title: "Christmas Eve Ride", time: "3:00 PM", type: "holiday", location: "City Park", desc: "Relaxed festive ride—holiday decorations encouraged." },
    { id: 25, date: "2025-12-25", title: "Christmas Day Mini Spin", time: "10:00 AM", type: "holiday", location: "Neighborhood Loop", desc: "Optional low-mileage social ride for anyone looking to stay active." },
    { id: 26, date: "2025-12-26", title: "Boxing Day Trail Ride", time: "9:00 AM", type: "mtb", location: "Woodland Trails", desc: "Post-holiday mountain bike ride through wooded trails." },
    { id: 27, date: "2025-12-27", title: "End-of-Year Mileage Push", time: "8:30 AM", type: "endurance", location: "County Loop", desc: "Group ride aimed at helping riders hit their yearly mileage goals." },
    { id: 28, date: "2025-12-28", title: "Bike & Brunch", time: "9:00 AM", type: "social", location: "Harbor Loop", desc: "Short morning ride followed by a group brunch." },
    { id: 29, date: "2025-12-29", title: "Cold Weather Endurance Test", time: "8:00 AM", type: "endurance", location: "Frostline Route", desc: "Longer, slower, steady conditioning ride in cold weather." },
    { id: 30, date: "2025-12-30", title: "Tune-Up & Tech Night", time: "6:00 PM", type: "workshop", location: "Bike Shop HQ", desc: "Indoor workshop on drivetrain care and winter lubrication." },
    { id: 31, date: "2025-12-31", title: "New Year’s Eve Celebration Ride", time: "5:00 PM", type: "holiday", location: "City Plaza", desc: "Festive end-of-year group ride ending with sparkling cider." }
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
                text: `Event: ${evt.title}\nTime: ${evt.time}\nLocation: ${evt.location}\n\n${evt.desc}\n\n${window.location.href}`
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
