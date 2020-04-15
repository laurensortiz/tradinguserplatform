import moment from 'moment';

const getWeekDays = (startDate, stopDate) => {
  let days = [], currentDate = startDate;
  while (moment.utc( currentDate ).isBefore( stopDate )) {
    days.push( currentDate );
    currentDate = moment.parseZone( currentDate ).add( 1, 'd' );
  }

  return days;

};

export default getWeekDays;