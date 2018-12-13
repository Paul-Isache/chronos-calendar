import React from "react";
import dateFns from "date-fns";

import "./Calendar.css";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    endSelectedDate: new Date(),
  };

  componentDidMount() {
    this.clearTimer();
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    )
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    }

    return <div className="days row">{days}</div>;
  }

  dateInInterval = day => dateFns.isWithinRange(day, this.state.selectedDate, this.state.endSelectedDate)

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${getClass(day)}`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            {typeof this.props.renderOnDate === 'function' && this.props.renderOnDate(cloneDay)}
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

  getClass = day => !dateFns.isSameMonth(day, monthStart)
    ? ((dateFns.isWeekend(cloneDay) && dateFns.isSameMonth(day, monthStart)) ? "weekend" : "disabled")
    : this.dateInInterval(cloneDay) ? "selected" : "";

  onDateClick = day => {
    if (this.timerID === null) {
      this.setTimer();

      this.setState({
        selectedDate: day,
        endSelectedDate: day
      });
    } else {
      let endDay = day;
      if (this.state.selectedDate > day) {
        endDay = this.state.selectedDate;
        this.setState({ selectedDate: day });
      }

      this.setState({ endSelectedDate: endDay });

      this.clearTimer();
    }

    typeof this.props.onDateClick === 'function' && this.props.onDateClick({ startDate: this.state.selectedDate, endDate: this.state.endSelectedDate })
  };

  setTimer = () => {
    this.timerID = setTimeout(() => this.clearTimer(), 5000);
  }

  clearTimer = () => {
    this.timerID && clearTimeout(this.timerID);
    this.timerID = null;
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
