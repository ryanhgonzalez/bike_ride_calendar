/**
 * ICS Parser & Recurrence Engine
 * Handles parsing of .ics strings and calculating event occurrences
 * based on RRULE (Recurrence Rules) for Weekly and Monthly events.
 */

const ICSParser = {

    /**
     * Main function to parse raw ICS string into event objects
     * @param {string} icsString 
     * @returns {Array} Array of event objects
     */
    parseICS: function(icsString) {
        const events = [];
        const lines = icsString.replace(/\r\n/g, '\n').split('\n');
        let currentEvent = null;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Handle multi-line unfolding (lines starting with space continue previous line)
            while (i + 1 < lines.length && lines[i + 1].startsWith(' ')) {
                line += lines[i + 1].trim();
                i++;
            }

            if (line.startsWith('BEGIN:VEVENT')) {
                currentEvent = {};
            } else if (line.startsWith('END:VEVENT')) {
                if (currentEvent) events.push(currentEvent);
                currentEvent = null;
            } else if (currentEvent) {
                const colonIndex = line.indexOf(':');
                if (colonIndex === -1) continue;

                let keyPart = line.substring(0, colonIndex);
                let value = line.substring(colonIndex + 1);
                
                // Split key parameters (e.g. DTSTART;TZID=...)
                const keyParams = keyPart.split(';');
                const key = keyParams[0];

                // Clean value (unescape chars)
                value = value.replace(/\\,/g, ',').replace(/\\n/g, '<br>').replace(/\\;/g, ';');

                if (key === 'SUMMARY') currentEvent.title = value;
                if (key === 'LOCATION') currentEvent.location = value;
                if (key === 'DESCRIPTION') currentEvent.desc = value;
                if (key === 'RRULE') currentEvent.rrule = this.parseRRule(value);
                
                if (key === 'DTSTART') {
                    currentEvent.start = this.parseIcsTime(value);
                }
                if (key === 'DTEND') {
                    currentEvent.end = this.parseIcsTime(value);
                }
            }
        }
        return events;
    },

    /**
     * Helper: Parse YYYYMMDDTHHMMSS format
     */
    parseIcsTime: function(val) {
        const clean = val.replace('T', '').replace('Z', '');
        const y = clean.substring(0, 4);
        const m = clean.substring(4, 6);
        const d = clean.substring(6, 8);
        const h = clean.substring(8, 10) || '00';
        const min = clean.substring(10, 12) || '00';
        const s = clean.substring(12, 14) || '00';
        return new Date(y, m - 1, d, h, min, s);
    },

    /**
     * Helper: Parse RRULE string into object
     */
    parseRRule: function(rruleStr) {
        const rules = {};
        rruleStr.split(';').forEach(part => {
            const [k, v] = part.split('=');
            rules[k] = v;
        });
        return rules;
    },

    /**
     * Helper: Format JS Date to 12h time string
     */
    formatTime: function(dateObj) {
        if (!dateObj) return '';
        return dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    },

    /**
     * Core Engine: Calculates which events appear in a specific month
     * handling both single instances and recurrences.
     */
    getEventsForMonth: function(rawEvents, year, month) {
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
        const displayEvents = [];

        rawEvents.forEach(evt => {
            if (!evt.start) return;

            // Check Expiration (UNTIL)
            if (evt.rrule && evt.rrule.UNTIL) {
                const untilDate = this.parseIcsTime(evt.rrule.UNTIL);
                if (untilDate < monthStart) return; // Event expired before this month
            }

            // 1. Single Event (No Rule)
            if (!evt.rrule) {
                if (evt.start >= monthStart && evt.start <= monthEnd) {
                    displayEvents.push(this.createDisplayEvent(evt, evt.start));
                }
                return;
            }

            // 2. Recurring Events logic
            if (evt.start > monthEnd) return; // Starts in future

            const rule = evt.rrule;
            const freq = rule.FREQ;
            
            // Iterate every day of the month to check matches
            for (let d = 1; d <= monthEnd.getDate(); d++) {
                const currentDay = new Date(year, month, d, evt.start.getHours(), evt.start.getMinutes());
                
                if (currentDay < evt.start) continue; // Before start date
                if (rule.UNTIL && currentDay > this.parseIcsTime(rule.UNTIL)) break; // Past UNTIL

                let isMatch = false;

                if (freq === 'WEEKLY') {
                    const dayName = ['SU','MO','TU','WE','TH','FR','SA'][currentDay.getDay()];
                    if (rule.BYDAY && rule.BYDAY.includes(dayName)) {
                        isMatch = true;
                    }
                } else if (freq === 'MONTHLY') {
                    if (rule.BYDAY) {
                        const dayName = ['SU','MO','TU','WE','TH','FR','SA'][currentDay.getDay()];
                        const matchPart = rule.BYDAY.match(/([-\d]+)([A-Z]{2})/); // e.g., 1WE or -1FR
                        
                        if (matchPart) {
                            const pos = parseInt(matchPart[1]); // 1, 2, -1
                            const dayStr = matchPart[2]; // WE, FR

                            if (dayStr === dayName) {
                                if (pos > 0) {
                                    // Nth occurrence from start
                                    const minDate = (pos - 1) * 7 + 1;
                                    const maxDate = pos * 7;
                                    if (d >= minDate && d <= maxDate) isMatch = true;
                                } else if (pos === -1) {
                                    // Last occurrence
                                    const daysInMonth = monthEnd.getDate();
                                    if (d > daysInMonth - 7) isMatch = true;
                                }
                            }
                        }
                    } else if (rule.BYMONTHDAY) {
                        if (d === parseInt(rule.BYMONTHDAY)) isMatch = true;
                    } else if (!rule.BYDAY && currentDay.getDate() === evt.start.getDate()) {
                         // Simple Monthly on the same date
                         isMatch = true;
                    }
                }

                if (isMatch) {
                    displayEvents.push(this.createDisplayEvent(evt, currentDay));
                }
            }
        });

        return displayEvents;
    },

    /**
     * Helper: Formats internal event object for UI
     */
    createDisplayEvent: function(rawEvt, dateObj) {
        const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(dateObj.getDate()).padStart(2,'0')}`;
        return {
            id: Math.random().toString(36).substr(2, 9),
            date: dateKey,
            title: rawEvt.title || 'Untitled Event',
            time: this.formatTime(dateObj),
            location: rawEvt.location || 'No location specified',
            desc: rawEvt.desc || 'No description.',
            type: 'cycling' // Generic type
        };
    }
};