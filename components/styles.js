import { Dimensions, StyleSheet } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    //backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center'
  },
  controlLeftButton: {
    alignItems : 'flex-end',
    justifyContent:'center'
  },
  headerCenter:{
    justifyContent:'center',
    alignItems:'center'
  },
  controlRightButton: {
    alignItems : 'flex-start',
    justifyContent: 'center'
  },
  controlButtonText: {
    margin: 10,
    fontSize: 15,
  },
  title: {
    //textAlign: 'center',
    fontSize: 30,
    fontWeight: '500',
    color: 'black',
    margin: 10,
  },
  calendarHeading: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor:'#ddd'
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
    color: 'black'
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
    color: '#cccccc',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DEVICE_WIDTH / 7,
    height: DEVICE_WIDTH / 7,
  },
  dayButtonEvent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DEVICE_WIDTH / 7,
    backgroundColor: '#FFD90C',
  },
  dayButtonFiller: {
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
    color:'black'
  },
  dayInActive:{
    fontSize: 16,
    alignSelf: 'center',
    textDecorationLine : 'line-through',
    color:'#999'
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'red',
  },
  selectedDayCircle: {
    backgroundColor: '#FFD90C',
  },
  hasEventCircle: {
  },
  hasEventDaySelectedCircle: {
  },
  hasEventText: {
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#cccccc',
  },
  viewLoanDate:{
    flexDirection:'row',
    paddingVertical:10
  },
  viewLoanFromDate:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  viewLoanCenterDate:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  viewLoanToDate:{
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  txtLoanDate:{
    fontSize:20,
    fontWeight:'500',
    color:'black'
  },
  icon:{
    width:30,
    height:30
  },
  iconSlash:{
    width:50,
    height:50
  }
});

export default styles;
