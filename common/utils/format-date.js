import moment from "moment";

const formatDate = date => moment.parseZone( date ).isValid() ? moment.parseZone( date ).format( 'DD-MM-YYYY' ) : 'Sin definir';

export default formatDate;