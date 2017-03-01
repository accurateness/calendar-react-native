import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import Day from './Day';

import moment from 'moment';
import styles from './styles';

const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 2;

export default class Calendar extends Component {

  state = {
    currentMonthMoment: moment(this.props.startDate),
    selectedMoment: moment(this.props.selectedDate),
    tintColorPrev: '#ccc',
    tintColorNext: 'black',
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    scrollEnabled: PropTypes.bool,
    selectedDate: PropTypes.any,
    showControls: PropTypes.bool,
    showEventIndicators: PropTypes.bool,
    startDate: PropTypes.any,
    titleFormat: PropTypes.string,
    today: PropTypes.any,
    weekStart: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    width: DEVICE_WIDTH,
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    eventDates: [],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    scrollEnabled: false,
    showControls: false,
    showEventIndicators: false,
    startDate: moment().format('YYYY-MM-DD'),
    titleFormat: 'MMMM YYYY',
    today: moment(),
    weekStart: 1,
  };

  componentDidMount() {
    // fixes initial scrolling bug on Android
    setTimeout(() => this.scrollToItem(VIEW_INDEX), 0)
  }

  componentDidUpdate() {
    this.scrollToItem(VIEW_INDEX);
  }
  
  componentWillReceiveProps(props) {
    if (props.selectedDate) {
      this.setState({selectedMoment: props.selectedDate});
    }
  }

  getMonthStack(currentMonth) {
    if (this.props.scrollEnabled) {
      const res = [];
      for (let i = -VIEW_INDEX; i <= VIEW_INDEX; i++) {
        res.push(moment(currentMonth).add(i, 'month'));
      }
      return res;
    }
    return [moment(currentMonth)];
  }

 prepareEventDates( events) {
    const parsedDates = {};

    // Dates with custom properties
    if (events) {
      events.forEach(event => {
        if (event) {
            const date = moment(event);
            const month = moment(date).startOf('month').format();
            parsedDates[month] = parsedDates[month] || {};
            parsedDates[month][date.date() - 1] = event;
        }
      });
    }
    return parsedDates;
  }

  prepareInActiveDates( inActiveDays) {
    const parsedDates = {};
    // Dates with custom properties
    if (inActiveDays) {
      inActiveDays.forEach(event => {
        if (event) {
            const date = moment(event);
            const month = moment(date).startOf('month').format();
            parsedDates[month] = parsedDates[month] || {};
            parsedDates[month][date.date() - 1] = event;
        }
      });
    }
    return parsedDates;
  }

  selectDate(date) {
    this.setState({ selectedMoment: date });
    this.props.onDateSelect && this.props.onDateSelect(date ? date.format(): null );
  }

  onPrev = () => {
    const { currentMonthMoment } = this.state
    const currentMonthCalendar = moment(currentMonthMoment)
    const currentMonth = moment()

    const countMonth = currentMonthCalendar.diff(currentMonth, 'month');
    alert(countMonth)
    if(countMonth > 0){
      const newMoment = moment(currentMonthMoment).subtract(1, 'month');

      this.setState({ currentMonthMoment: newMoment, tintColorNext: 'black', tintColorPrev: (countMonth == 2)?'ccc':'black' });
      this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
    }else{
      this.setState({ tintColorPrev:'#ccc' })
    }
  }

  onNext = () => {
    const { currentMonthMoment } = this.state
    const currentMonthCalendar = moment(currentMonthMoment)
    const currentMonth = moment()

    const countMonth = currentMonthCalendar.diff(currentMonth, 'month');

    if(countMonth < 5){
      const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
      this.setState({ currentMonthMoment: newMoment, tintColorNext: (countMonth == 4)?'#ccc':'black', tintColorPrev: 'black' });
      this.props.onTouchNext && this.props.onTouchNext(newMoment);
    }else{
      this.setState({ tintColorNext:'#ccc' })
    }
  }

  scrollToItem(itemIndex) {
    const scrollToX = itemIndex * this.props.width;
    if (this.props.scrollEnabled) {
      this._calendar.scrollTo({ y: 0, x: scrollToX, animated: false });
    }
  }

  scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / this.props.width;
    const newMoment = moment(this.state.currentMonthMoment).add(currentPage - VIEW_INDEX, 'month');
    this.setState({ currentMonthMoment: newMoment });

    if (currentPage < VIEW_INDEX) {
      this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
    } else if (currentPage > VIEW_INDEX) {
      this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
    }
  }

  renderMonthView(argMoment, eventsMap, inActiveDatesMap) {
    const { dayInActive } = this.props
    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOf('month');

    const
      selectedMoment = moment(this.state.selectedMoment),
      weekStart = this.props.weekStart,
      todayMoment = moment(this.props.today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSame(todayMoment, 'month'),
      selectedIndex = moment(selectedMoment).date() - 1,
      selectedMonthIsArg = selectedMoment.isSame(argMoment, 'month');

    const events = (eventsMap !== null)
      ? eventsMap[argMoment.startOf('month').format()]
      : null;

    const inActive = (inActiveDatesMap !== null)
    ? inActiveDatesMap[argMoment.startOf('month').format()]
    : null;

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;

      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
        days.push((
          <Day
            startOfMonth={startOfArgMonthMoment}
            key={`${renderIndex}`}
            onPress={() => {
              this.selectDate(moment(startOfArgMonthMoment).set('date', dayIndex + 1));
            }}
            caption={`${dayIndex + 1}`}
            isToday={argMonthIsToday && (dayIndex === todayIndex)}
            isSelected={selectedMonthIsArg && (dayIndex === selectedIndex)}
            event={events && events[dayIndex]}
            inActive={inActive && inActive[dayIndex]}
            showEventIndicators={this.props.showEventIndicators}
            customStyle={this.props.customStyle}
          />
        ));
      } else {
        days.push(<Day key={`${renderIndex}`} filler customStyle={this.props.customStyle} />);
      }
      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            style={[styles.weekRow, this.props.customStyle.weekRow]}
          >
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true)
    const containerStyle = [styles.monthContainer, this.props.customStyle.monthContainer];
    return <View key={argMoment.month()} style={containerStyle}>{weekRows}</View>;
  }

  renderHeading() {
    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={[styles.dayHeading, this.props.customStyle.dayHeading]}
        >
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }
  // <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
  //             {this.props.prevButtonText}
  //           </Text>

  // <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
  //             {this.props.nextButtonText}
  //           </Text>

  renderLoanDate(){
    const { fromDate, toDate } = this.props
    if(!fromDate) return;
    return(
      <View style={styles.viewLoanDate}>
          <View style={styles.viewLoanFromDate}>
            <Text style={styles.txtLoanDate}>{fromDate.date}</Text>
            <Text style={styles.txtLoanDate}>{fromDate.day}</Text>
          </View>
          <View style={styles.viewLoanCenterDate}>
            <Image source={require('../img/slash.png')} style={styles.iconSlash} />
          </View>
          <View style={styles.viewLoanToDate}>
            <Text style={styles.txtLoanDate}>{toDate.date}</Text>
            <Text style={styles.txtLoanDate}>{toDate.day}</Text>
          </View>
      </View> 
    )
  }

  renderTopBar() {
    let localizedMonth = this.props.monthNames[this.state.currentMonthMoment.month()];
    localizedMonth = localizedMonth.toUpperCase();
    return this.props.showControls
    ? (
        <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
          <TouchableOpacity
            style={[styles.controlLeftButton, this.props.customStyle.controlButton]}
            onPress={this.onPrev}
          >
            <Image source={require('../img/prev.png')} style={[styles.icon,{tintColor: this.state.tintColorPrev}]} />
            
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, this.props.customStyle.title]}>
              {localizedMonth} {this.state.currentMonthMoment.year()}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.controlRightButton, this.props.customStyle.controlButton]}
            onPress={this.onNext}
          >
            
            <Image source={require('../img/next.png')} style={[styles.icon,{tintColor: this.state.tintColorNext}]} />
          </TouchableOpacity>
        </View>
      )
    : (
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
      </View>
    );
  }

  render() {
    const calendarDates = this.getMonthStack(this.state.currentMonthMoment);
    const eventDatesMap = this.prepareEventDates(this.props.events);
    const inActiveDatesMap = this.prepareInActiveDates(this.props.dayInActive);

    return (
      <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.renderLoanDate()}
        {this.renderHeading(this.props.titleFormat)}
        {this.props.scrollEnabled ?
          <ScrollView
            ref={calendar => this._calendar = calendar}
            horizontal
            scrollEnabled
            pagingEnabled
            removeClippedSubviews
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets
            onMomentumScrollEnd={(event) => this.scrollEnded(event)}
          >
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap, inActiveDatesMap))}
          </ScrollView>
          :
          <View ref={calendar => this._calendar = calendar}>
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap, inActiveDatesMap))}
          </View>
        }
      </View>
    );
  }
}
