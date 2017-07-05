import React, { Component } from 'react';
import './App.css';

const dayAbbreviations = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const allEvents = {
"events": [
  {
    "occasion": "Birthday party",
    "invited_count": 120,
    "year": 2016,
    "month": 2,
    "day": 14
  },
  {
    "occasion": "Technical discussion",
    "invited_count": 23,
    "year": 2016,
    "month": 11,
    "day": 24
  },
  {
    "occasion": "Press release",
    "invited_count": 64,
    "year": 2015,
    "month": 12,
    "day": 17,
    "cancelled": true
  },
  {
    "occasion": "New year party",
    "invited_count": 55,
    "year": 2016,
    "month": 1,
    "day": 1
  }
]
};

class Month extends React.Component {
  render() {
    const year = this.props.date.getFullYear();
    const month = this.props.date.getMonth();
    const offset = new Date(year, month, 1).getDay();
    const name = monthNames[month];
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const events = lookupEvents(month+1, year);
    const weeks = getWeeks(offset, daysInMonth, events);

    return (
      <div>
        <table className="calendar">
          <caption className="calendarBanner">
            <h1>{name}, {year}</h1>
          </caption>
          
          <tbody>
            <tr>
              {dayAbbreviations.map(name =>
                <th className="calendarHeader" key={name}>{name}</th>
              )}
            </tr>
            {weeks.map((week, index) =>
              <tr key={index}>
              {week.map((day, index) =>
                <td className={ day && day.event ? (day.cancelled ?  "calendarEventCell calendarCell cancelledCell" : "calendarEventCell calendarCell") : "calendarCell"} key={index}>{day && day.value}<div>{day && day.event}</div></td>
              )}
              </tr>
            )}
            </tbody>
        </table>
      </div>
    );
  }
}

function getStateForDate(date) {
  return  {
    date: date,
    lastMonth: monthNames[(date.getMonth()+11) % 12],
    nextMonth: monthNames[(date.getMonth()+1) % 12],
    lastYear: date.getFullYear()-1,
    nextYear: date.getFullYear()+1,
  };
}

function previousMonth(date) {
  date.setMonth(date.getMonth()-1);
  return date;
}

function nextMonth(date) {
  date.setMonth(date.getMonth()+1);
  return date;
}

function previousYear(date) {
  date.setYear(date.getFullYear()-1);
  return date;
}

function nextYear(date) {
  date.setYear(date.getFullYear()+1);
  return date;
}


class App extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    now.setDate(1); //prevents errors when changing months if date is the 31st and next/previous month doesn't have a 31st
    this.state = getStateForDate(now);
    
    this.handlePreviousMonth = this.handlePreviousMonth.bind(this);
    this.handleNextMonth = this.handleNextMonth.bind(this);
    this.handlePreviousYear = this.handlePreviousYear.bind(this);
    this.handleNextYear = this.handleNextYear.bind(this);
  }
  
  handlePreviousMonth() {
    this.setState(previousState => (
      getStateForDate(previousMonth(previousState.date))
    ));
  }
  
  handleNextMonth() {
    this.setState(previousState => (
      getStateForDate(nextMonth(previousState.date))
    ));
  }
  
  handlePreviousYear() {
    this.setState(previousState => (
      getStateForDate(previousYear(previousState.date))
    ));
  }
  
  handleNextYear() {
    this.setState(previousState => (
      getStateForDate(nextYear(previousState.date))
    ));
  }

  render() {
    return (
      <div className="App">
        <sub><button onClick={this.handlePreviousMonth}> &#60; {this.state.lastMonth}</button></sub>
        <super><button onClick={this.handlePreviousYear}> &#60;&#60; {this.state.lastYear}</button></super>
        <super><button onClick={this.handleNextYear}>{this.state.nextYear} &#62;&#62; </button></super>
        <sub><button onClick={this.handleNextMonth}>{this.state.nextMonth} &#62; </button></sub>
        <Month date={this.state.date} />
      </div>
    );
  }
}



function getWeeks(offset, totalDays, events) {
  const allDays = Array.from(Array(totalDays+1).keys()).slice(1);  //change to 1-based array with the +1 and the slice(1) call
  const allDaysWithEvents = allDays.map(function(day) {
    const event = events[day];
    let ret = { value: day };
    if (event) {
      ret["event"] = event.event + ", " + event.invited + " invited";
      ret["cancelled"] = event.cancelled;
    }
    return ret;
  });
  const all = [Array(offset)];
  let current = 7 - offset;
  all[0] = all[0].fill(null).concat(allDaysWithEvents.slice(0, current));  //first partial week
  while (current <= totalDays) {
    let remaining = totalDays - current;
    remaining = remaining > 7 ? 7 : remaining;
    all.push(allDaysWithEvents.slice(current, current + remaining));
    current += 7;
  }
  return all;
}

function lookupEvents(month, year) {
  let hash = {};
  for (var index in allEvents.events) {
    let event = allEvents.events[index];
    if (event.year === year && event.month === month) {
      hash[event.day] = {event: event.occasion, invited: event.invited_count, cancelled: (event.cancelled ? true : false)};
    }
  }
  return hash;
}


export default App;

