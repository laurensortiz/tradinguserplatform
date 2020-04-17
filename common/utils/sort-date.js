import moment from 'moment-timezone';

const sortDate = (start, end) => {
  if (_.isNil( start )) start = '00-00-0000';
  if (_.isNil( end )) end = '00-00-0000';

  return moment( start ).unix() - moment( end ).unix()
};

export default sortDate;