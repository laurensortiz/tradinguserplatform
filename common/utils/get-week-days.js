import moment from 'moment-timezone';

const getWeekDays = (startDate, stopDate) => {
  let days = [], currentDate = startDate;
  while (moment.utc( currentDate ).isBefore( stopDate )) {
    days.push( currentDate );
    currentDate = moment.parseZone( currentDate ).tz('America/New_York').add( 1, 'd' );
  }

  return days;

};

export default getWeekDays;