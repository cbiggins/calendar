
    /**
     * $Id: holcalendar.js 146 2008-11-09 23:55:36Z mlittle $
     */

    HOL.Calendar = function(dateformat) {
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
    }

    HOL.Calendar.prototype = new Object();

    HOL.Calendar.prototype.Build = function(e, id) {
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

    HOL.Calendar.callBack = function(val) { }

    HOL.Calendar.prototype.updateTime = function() {
        var tempdate = new Date();
        this.date.setTime(tempdate.getTime());
    }

    HOL.Calendar.prototype.nextMonth = function() {
        this.DestroyDiv();
        this.date.setMonth(parseInt(this.date.getMonth()) + 1);
        this.Build();
    }

    HOL.Calendar.prototype.prevMonth = function() {
        this.DestroyDiv();
        this.date.setMonth(parseInt(this.date.getMonth()) - 1);
        this.Build();
    }

    HOL.Calendar.prototype.ClickDay = function(e) {
        this.updateTime();
        var DayTarget = this.e.getTarget(e);
        this.date.setDate(parseInt(DayTarget.firstChild.nodeValue));
        HOL.Calendar.callBack(this.date.strftime(this.dateformat));
        this.DestroyDiv();
    }

    HOL.Calendar.prototype.DestroyDiv = function() {
        var div = document.getElementById('HolCal_Div');
        if (div) div.parentNode.removeChild(div);
    }

    HOL.Calendar.prototype.CreateDiv = function() {
        var body = document.body;
        var divcont = document.createElement('div');

        divcont.setAttribute('id', 'HolCal_Div');
        this.d.addClass(divcont,'HolCal');
        this.buildContents(divcont);

        body.appendChild(divcont);

        if (this.location) {
            this.d.setXY(divcont, this.location);
        }

        var w = this;
        var nextMonth = document.getElementById('HolCalNextMonth');
        var prevMonth = document.getElementById('HolCalPrevMonth');
        var closeCal =  document.getElementById('HolCloseCal');

        this.e.addListener(nextMonth, 'click', function () { w.nextMonth(); });
        this.e.addListener(prevMonth, 'click', function () { w.prevMonth(); });
        this.e.addListener(closeCal, 'click', function () { w.DestroyDiv(); });
    }

    HOL.Calendar.prototype.buildContents = function(divcont) {
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

        table.appendChild(tr = document.createElement('tr'));
        for (i = 0; i < this.days_short.length; i++) {
            tr.appendChild(td = document.createElement('td'));
            this.d.addClass(td, 'HolCal_cell');
            td.appendChild(document.createTextNode(this.days_short[i]));
        }

        this.buildDayRows(table);
    }

    HOL.Calendar.prototype.buildDayRows = function(table) {
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
                        span.setAttribute('id', 'HolCalDay' + display_date);
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

    HOL.Calendar.prototype.isLeapYear = function(year) {
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

    HOL.Calendar.prototype.getStartDay = function() {
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
