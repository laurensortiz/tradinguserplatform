import moment from 'moment';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';

moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Usuario',
  'Nombre',
  'Apellido',
  'Tipo de Cuenta',
  'Comisión',
  'Valor de la Cuenta',
  'Garantías disponibles',
  'Colocación',
  'Broker',
  'Saldo Inicial',
  'Saldo Final',
  'Garantías / Créditos',
  'Fecha de Apertura',
  'Fecha de Actualización'
];

const addCommentToCell = (context, column, comment) => {
  if (!context[ column ].c) context[ column ].c = [];

  context[ column ].c.hidden = true;
  return context[ column ].c.push( { t: comment } );
};

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `cuentas_clientes_${ time }.xlsx`
};

const _formatData = (data) => {
  return _.map( data, account => {
    let brokerName = ' - ';
    let products = [];

    if (!_.isEmpty(account.marketOperation)) {
      account.marketOperation.map(operation => {
        brokerName = operation.broker.name;
        products.push(operation.product.name);
      })
    }

    return {
      'Usuario': account.user.username,
      'Nombre': account.user.firstName,
      'Apellido': account.user.lastName,
      'Tipo de Cuenta': account.account.name,
      'Comisión': `${account.account.percentage}%`,
      'Valor de la Cuenta':FormatCurrency.format( account.accountValue),
      'Garantías disponibles': FormatCurrency.format( account.guaranteeOperation ),
      'Colocación': _.isEmpty(products) ? 'Nuevo' : products.toString(),
      'Broker': brokerName,
      'Saldo Inicial': FormatCurrency.format( account.balanceInitial ),
      'Saldo Final': FormatCurrency.format( account.balanceInitial ),
      'Garantías / Créditos': FormatCurrency.format( account.guaranteeCredits ),
      'Fecha de Apertura': FormatDate(account.createdAt),
      'Fecha de Actualización': FormatDate(account.updatedAt)
    }

  } )


};

const _getAccountTemplateMarket = (data) => {

  return [
    [ 'Estado de Cuenta Clientes' ],
    [ '' ],

  ]
};

function exportUserAccountHistory(exportData) {

  const workbook = _formatData( exportData );

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(
    workbook,
    {
      header: EXCEL_HEADER_MARKET,
      origin: 'A3'
    } );
  const wb = XLSX.utils.book_new();
  if (!wb.Props) wb.Props = {};

  wb.Props.Title = "Cuentas de Clientes";


  const wscols = _.reduce([...Array(23).keys()], (result, key) => {
    result.push({ 'wch': 30 })
    return result
  }, []);
  ws[ '!cols' ] = wscols;

  ws = _.transform(ws, function(result, value, key) {
    if (_.startsWith(value.v, '$')) {
      const number = parseFloat(value.v.replace(/\$|,/g, ''))
      result[key] = {v: number, t:'n', z: "$#,###.00"}
    } else {
      result[key] = value
    }

  }, {});

  const displayTemplate = _getAccountTemplateMarket( _.first(exportData) );

  XLSX.utils.sheet_add_aoa( ws, displayTemplate, { origin: 'A1' } );
  XLSX.utils.book_append_sheet( wb, ws, "Cuentas de Clientes" );
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
  const html = XLSX.utils.sheet_to_html( ws );

  // Generate XLSX file and send to client
  const wbout = XLSX.write( wb, wopts );
  const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );

  //FileSaver.saveAs(blob, getExportFileName())
  FileSaver.saveAs( blob, getExportFileName() )
  //props.resetExportCharges();


}


export default exportUserAccountHistory;
