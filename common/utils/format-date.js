import moment from "moment";

const formatDate = date => moment.utc( date ).isValid() ? moment.utc( date ).format( 'DD-MM-YYYY' ) : 'Sin definir';

export default formatDate;