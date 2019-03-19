import React, { useState, useEffect } from "react";
import dateFns from "date-fns";

import "./Calendar.css";

const SHIFT_KEY = 16;
const CTRL_KEY = 17;
const rangeSelectionKeys = [SHIFT_KEY, CTRL_KEY];

function Calendar(props) {
  const [currentMonth, setCurrentMonth] = useState(props.currentDate);
  const [selectedStartDate, setStartDate] = useState(new Date());
  const [selectedEndDate, setEndDate] = useState(new Date());
  const [rangeSelection, setRangeSelection] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPressed);
    document.addEventListener('keyup', handleKeyReleased);

    return () => {
      document.removeEventListener('keydown', handleKeyPressed);
      document.removeEventListener('keyup', handleKeyReleased);
    }
  });

  function handleKeyPressed(event) {
    if (rangeSelectionKeys.includes(event.keyCode)) setRangeSelection(true)
  }

  function handleKeyReleased() { setRangeSelection(false); }

  function renderHeader() {
    const dateFormat = 'MMMM YYYY';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    )
  }

  function renderDays() {
    const dateFormat = 'dddd';
    const days = [];

    let startDate = dateFns.startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++)
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )

    return <div className="days row">{days}</div>;
  }

  function dateInInterval(day) { return dateFns.isWithinRange(day, selectedStartDate, selectedEndDate) }

  function renderCells() {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = dateFns.endOfWeek(monthEnd);
    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        let formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${isWeeekend(day)} ${getClass(day, monthStart)}`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {typeof props.renderOnDate === 'function' && props.renderOnDate(day)}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  function isWeeekend(day) { return dateFns.isWeekend(day) && 'weekend'; }

  function formatDate(date) { dateFns.format(date, 'MMDDYYYY'); }

  function getClass(day, monthStart) {
    if (!dateFns.isSameMonth(day, monthStart) || props.disabledDates.map(item => formatDate(item.date)).includes(formatDate(day))) return 'disabled';

    if (dateInInterval(day)) return 'selected';

    return '';
  }

  function onDateClick(day) {
    if (rangeSelection) {
      if (day < selectedStartDate) {
        setStartDate(day);
        setEndDate(selectedStartDate);
      }
      else setEndDate(day);

      sendInterval();
    }
    else {
      setStartDate(day);
      setEndDate(day);
      sendInterval();
    }
  };

  function sendInterval() {
    typeof props.onDateClick === 'function' && props.onDateClick({ startDate: selectedStartDate, endDate: selectedEndDate })
  }

  function nextMonth() {
    setCurrentMonth(dateFns.addMonths(currentMonth, 1))
  };

  function prevMonth() {
    setCurrentMonth(dateFns.subMonths(currentMonth, 1))
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

Calendar.defaultProps = {
  currentDate: new Date(),
  disabledDates: []
}

export default Calendar;