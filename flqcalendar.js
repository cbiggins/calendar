    /**
    * Copyright 2009 Michael Little, Christian Biggins
    *
    * This program is free software: you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation, either version 3 of the License, or
    * (at your option) any later version.
    *
    * This program is distributed in the hope that it will be useful,
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    * GNU General Public License for more details.
    *
    * You should have received a copy of the GNU General Public License
    * along with this program. If not, see <http://www.gnu.org/licenses/>.
    */
    
    /**
    * FLQ.Calendar - Fliquid Calendar popup for form selection.
    * Currently dependant on The Yahoo YUI Event and Dom libs. Planning on changing this soon
    *
    * Version: 1.0.1 BETA
    * Last Modified: 17/02/2009
    */

    FLQ.Calendar = function(dateformat, showyear) {
        this.date = new Date();
        this.widgetId;
        this.d = YAHOO.util.Dom;
        this.e = YAHOO.util.Event;
        this.days_short = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        this.days_long;
        this.months_short = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        this.months_long = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.months_days = ['31' , '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
        this.target;
        this.location;
        this.dateformat = dateformat;
        if (arguments.length < 2) showyear = false;
        this.showyear = showyear;
    }

    FLQ.Calendar.prototype = new Object();

    FLQ.Calendar.prototype.Build = function(e, id) {
        this.DestroyDiv();
        if (e) {
            this.target = this.e.getTarget(e);
            this.location = this.e.getXY(e);
        }
        this.widgetId = id;
        this.year = this.date.getYear();
        this.month = this.date.getMonth();
        this.monthstartson = this.getStartDay();
        this.monthdisplayoffset;
        this.CreateDiv(location);
    }

    FLQ.Calendar.callBack = function(val) { }

    FLQ.Calendar.prototype.updateTime = function() {
        var tempdate = new Date();
        this.date.setHours(tempdate.getHours());
        this.date.setMinutes(tempdate.getMinutes());
    }

    FLQ.Calendar.prototype.nextMonth = function() {
        this.DestroyDiv();
        this.date.setMonth(parseInt(this.date.getMonth()) + 1);
        this.Build();
    }

    FLQ.Calendar.prototype.prevMonth = function() {
        this.DestroyDiv();
        this.date.setMonth(parseInt(this.date.getMonth()) - 1);
        this.Build();
    }

    FLQ.Calendar.prototype.prevYear = function() {
        this.DestroyDiv();
        this.date.setFullYear(this.date.getFullYear() - 1);
        this.Build();
    }

    FLQ.Calendar.prototype.nextYear = function() {
        this.DestroyDiv();
        this.date.setFullYear(this.date.getFullYear() + 1);
        this.Build();
    }

    FLQ.Calendar.prototype.ClickDay = function(e) {
        this.updateTime();
        var DayTarget = this.e.getTarget(e);
        this.date.setDate(parseInt(DayTarget.firstChild.nodeValue));
        FLQ.Calendar.callBack(this.date.strftime(this.dateformat));
        this.DestroyDiv();
    }

    FLQ.Calendar.prototype.DestroyDiv = function() {
        var div = document.getElementById('HolCal_Div');
        if (div) div.parentNode.removeChild(div);
    }

    FLQ.Calendar.prototype.CreateDiv = function() {
        var body = document.body;
        var divcont = document.createElement('div');

        divcont.setAttribute('id', 'HolCal_Div');
        this.d.addClass(divcont,'HolCal');
        this.buildContents(divcont);

        body.appendChild(divcont);

        var divWidth = 130;
        if (this.showyear) {
            var divHeight = 170;
        } else {
            var divHeight = 150;
        }

        // If the popup div is positioned outside the current window, we need to put it back in the window. Don't want any pesky scrollbars!
        if (this.location[1] + divHeight > window.innerHeight) {
            var topOffset = window.innerHeight - divHeight;
            this.location[1] = topOffset - 10; // Add an extra 10px just to be sure
        }
        if (this.location[0] + divWidth > window.innerWidth) {
            var rightOffset = window.innerWidth - divWidth;
            this.location[0] = rightOffset - 10;
        }

        if (this.location) {
            this.d.setXY(divcont, this.location);
        }

        var w = this;
        var nextMonth = document.getElementById('HolCalNextMonth');
        var prevMonth = document.getElementById('HolCalPrevMonth');
        var closeCal =  document.getElementById('HolCloseCal');

        if (this.showyear) {
            var prevYear = document.getElementById('HolCalPrevYear');
            var nextYear = document.getElementById('HolCalNextYear');
            this.e.addListener(prevYear, 'click', function () { w.prevYear(); });
            this.e.addListener(nextYear, 'click', function () { w.nextYear(); });
        }

        this.e.addListener(nextMonth, 'click', function () { w.nextMonth(); });
        this.e.addListener(prevMonth, 'click', function () { w.prevMonth(); });
        this.e.addListener(closeCal, 'click', function () { w.DestroyDiv(); });
    }

    FLQ.Calendar.prototype.buildContents = function(divcont) {
        divcont.appendChild(table = document.createElement('table'));
        this.d.addClass(table, 'HolCal_table');
        table.setAttribute('id', 'HolCal_Table');
        table.setAttribute('cellspacing', '5');
        table.setAttribute('cellpadding', '5');
        table.setAttribute('border', '0');

        table.appendChild(tr = document.createElement('tr'));
        tr.appendChild(td = document.createElement('td'));
        this.d.addClass(tr, 'HolCal_toprow');
        this.d.addClass(td, 'HolCal_cell');
        td.appendChild(span = document.createElement('span'));
        this.d.addClass(span, 'HolCal_clickable');
        span.setAttribute('id', 'HolCalPrevMonth');
        span.setAttribute('alt', 'Previous Month');
        span.setAttribute('title', 'Previous Month');
        span.appendChild(document.createTextNode('<'));
        tr.appendChild(td = document.createElement('td'));
        td.setAttribute('colspan', '4');
        this.d.addClass(td, 'HolCal_cell');
        this.d.addClass(td, 'HolCal_monthname');
        td.appendChild(document.createTextNode(this.months_long[this.date.getMonth()]));
        tr.appendChild(td = document.createElement('td'));
        td.appendChild(span = document.createElement('span'));
        this.d.addClass(td, 'HolCal_cell');
        this.d.addClass(span, 'HolCal_clickable');
        span.setAttribute('id', 'HolCalNextMonth');
        span.setAttribute('alt', 'Next Month');
        span.setAttribute('title', 'Next Month');
        span.appendChild(document.createTextNode('>'));
        tr.appendChild(td = document.createElement('td'));
        td.appendChild(span = document.createElement('span'));
        this.d.addClass(td, 'HolCal_cell');
        this.d.addClass(span, 'HolCal_clickable');
        span.setAttribute('id', 'HolCloseCal');
        span.setAttribute('alt', 'Close');
        span.setAttribute('title', 'Close');
        span.appendChild(document.createTextNode('x'));

        if (this.showyear) { // Need another row for the year display
            table.appendChild(tr = document.createElement('tr'));
            tr.appendChild(td = document.createElement('td'));
            td.appendChild(span = document.createElement('span'));
            span.appendChild(document.createTextNode('<'));
            this.d.addClass(span, 'HolCal_clickable');
            span.setAttribute('id', 'HolCalPrevYear');
            span.setAttribute('alt', 'Previous Year');
            span.setAttribute('title', 'Previous Year');
            tr.appendChild(td = document.createElement('td'));
            td.setAttribute('colspan', 4);
            this.d.addClass(td, 'HolCal_monthname');
            td.appendChild(document.createTextNode(this.date.getFullYear()));
            tr.appendChild(td = document.createElement('td'));
            td.appendChild(span = document.createElement('span'));
            span.appendChild(document.createTextNode('>'));
            this.d.addClass(span, 'HolCal_clickable');
            span.setAttribute('id', 'HolCalNextYear');
            span.setAttribute('alt', 'Next Year');
            span.setAttribute('title', 'Next Year');
        }

        table.appendChild(tr = document.createElement('tr'));
        for (i = 0; i < this.days_short.length; i++) {
            tr.appendChild(td = document.createElement('td'));
            this.d.addClass(td, 'HolCal_cell');
            td.appendChild(document.createTextNode(this.days_short[i]));
        }

        this.buildDayRows(table);
    }

    FLQ.Calendar.prototype.buildDayRows = function(table) {
        var days = '';
        var display_date = 1;
        var next_month_display_date = 1;
        var displayed_offset = 0;
        if (this.date.getMonth() == 0) {
            var last_months_last_day = this.months_days[11];
        } else {
            var last_months_last_day = this.months_days[parseInt(this.date.getMonth() - 1)];
        }
        var last_month_start_at = parseInt(last_months_last_day - this.monthdisplayoffset) + 1;
        var t = this;

        if (this.monthdisplayoffset > 0 && this.monthdisplayoffset < 7) {
            var displayed_offset_complete = false;
        } else {
            var displayed_offset_complete = true;
        }

        for (var row = 1; row <= 5; row++) {
            table.appendChild(tr = document.createElement('tr'));
            for (var col = 1; col <= 7; col++) {
                if (!displayed_offset_complete) {
                    tr.appendChild(td = document.createElement('td'));
                    this.d.addClass(td, 'HolCal_lastmonth');
                    this.d.addClass(td, 'HolCal_cell');
                    td.appendChild(document.createTextNode(last_month_start_at));
                    last_month_start_at++;
                    displayed_offset++;
                    if (displayed_offset == this.monthdisplayoffset) displayed_offset_complete = true;
                } else {
                    if (display_date <= this.months_days[this.date.getMonth()]) {
                        tr.appendChild(td = document.createElement('td'));
                        td.appendChild(span = document.createElement('span'));
                        this.d.addClass(td, 'HolCal_cell');
                        this.d.addClass(td, 'HolCal_clickable');
                        span.setAttribute('id', 'HolCalDay' + display_date + this.date.getMonth() + this.date.getFullYear());
                        span.appendChild(document.createTextNode(display_date));
                        this.e.addListener(span, 'click', function(e) { t.ClickDay(e); });
                    } else {
                        tr.appendChild(td = document.createElement('td'));
                        this.d.addClass(td, 'HolCal_lastmonth');
                        this.d.addClass(td, 'HolCal_cell');
                        td.appendChild(document.createTextNode(next_month_display_date));
                        next_month_display_date++;
                    }
                    display_date++;
                }
            }
        }
    }

    FLQ.Calendar.prototype.isLeapYear = function(year) {
        year = parseInt(year);
        if (year%4 == 0) {
            if (year%100 != 0) {
                return true;
            } else {
                if (year%400 == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    FLQ.Calendar.prototype.getStartDay = function() {
        var tempdate = this.date;
        tempdate.setDate(1);
        if (tempdate.getDay() == 0) { // A Sunday
            this.monthstartson = this.days_short[7];
            this.monthdisplayoffset = 7;
        } else {
            this.monthstartson = this.days_short[1 - tempdate.getDay()];
            this.monthdisplayoffset = parseInt(tempdate.getDay() - 1);
        }
        return true;
    }
