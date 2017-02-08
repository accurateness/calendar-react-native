import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if (event) {
      if (isSelected) {
        dayCircleStyle.push(styles.hasEventDaySelectedCircle, customStyle.hasEventDaySelectedCircle);
      } else {
        dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle);
      }
    }
    return dayCircleStyle;
  }

  dayButtonStyle = (isWeekend, isSelected, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.dayButton, customStyle.day];

    if (isSelected) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventDaySelectedCircle)
    }

    if (event) {
      dayTextStyle.push(styles.dayButtonEvent, customStyle.hasEventText)
    }
    return dayTextStyle;
  }

  dayTextStyle = (inActive) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (inActive) {
      dayTextStyle.push(styles.dayInActive,customStyle.day)
    }
    return dayTextStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      event,
      isWeekend,
      isSelected,
      isToday,
      showEventIndicators,
      inActive
    } = this.props;

    return filler
    ? (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
    : (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={this.dayButtonStyle(isWeekend, isSelected,  event)}>
          <View style={this.dayCircleStyle(isWeekend, isSelected,  event)}>
            <Text style={this.dayTextStyle(inActive)}>{caption}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
