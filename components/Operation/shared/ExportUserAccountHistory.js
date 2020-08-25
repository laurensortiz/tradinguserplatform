import moment from 'moment';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';

moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Estado',
  'Fecha de apertura',
  'Fecha de cierre',
  'Activo',
  'L/S',
  'Cantidad',
  'Precio de compra',
  'Taking Profit',
  'Stop/Lost',
  'Inversión',
  'Balance (G/P)',
  'Movimiento (G/P)',
  'Orden',
  'Broker',
  'Saldo inicial',
  'Saldo de cierre',
  'Ganancias',
  'Comisión',
  'Hold',
  'Ganancia Neta',
  'Saldo Final',
  'Garantías disponibles',
  'Transferencias Bancarias'
];

const addCommentToCell = (context, column, comment) => {
  if (!context[ column ].c) context[ column ].c = [];

  context[ column ].c.hidden = true;
  return context[ column ].c.push( { t: comment } );
};

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `reporte_historico_${ time }.xlsx`
};

const _formatData = (data) => {
  return _.map( data, operation => {

    return {
      'Estado': FormatStatus(operation.status, true).name,
      'Fecha de apertura': FormatDate(operation.createdAt),
      'Fecha de cierre': FormatDate(operation.endDate),
      'Activo': `${operation.product.name} (${operation.product.code})`,
      'L/S': operation.longShort,
      'Cantidad': operation.commoditiesTotal,
      'Precio de compra': FormatCurrency.format( operation.buyPrice ),
      'Taking Profit': FormatCurrency.format( operation.takingProfit ),
      'Stop/Lost': `${operation.stopLost}%`,
      'Inversión': FormatCurrency.format( operation.initialAmount ),
      'Balance (G/P)': FormatCurrency.format( _.get(operation, 'marketMovement[0].gpInversion', 0 )),
      'Movimiento (G/P)': FormatCurrency.format( _.get(operation, 'marketMovement[0].gpAmount', 0 ) ),
      'Orden': operation.orderId,
      'Broker': operation.broker.name,
      'Saldo inicial': FormatCurrency.format( operation.initialAmount ),
      'Saldo de cierre': FormatCurrency.format( operation.amount ),
      'Ganancias': FormatCurrency.format( operation.profitBrut ),
      'Comisión': `${operation.userAccount.account.percentage}% (${operation.userAccount.account.name}) - ${FormatCurrency.format(operation.commissionValueEndOperation)}`,
      'Hold': FormatCurrency.format( operation.holdStatusCommissionEndOperation ),
      'Ganancia Neta': FormatCurrency.format( operation.profitNet ),
      'Saldo Final': FormatCurrency.format( Number(operation.initialAmount) +  Number(operation.profitNet)),
      'Garantías disponibles': FormatCurrency.format(operation.guaranteeOperationValueEndOperation),
      'Transferencias Bancarias': '',
    }

  } )


};

const _getAccountTemplateMarket = (data) => {

  return [
    [ 'Estado de Cuenta' ],
    [ '' ],
    [ `${data.userAccount.user.firstName} ${data.userAccount.user.lastName} (${data.userAccount.user.username})` ],

  ]
};

function exportUserAccountHistory(exportData) {
  const oderded = _.orderBy(exportData, ['guaranteeOperationValueEndOperation', 'asc'])
  const workbook = _formatData( oderded );

  //Define template structure
  const ws = XLSX.utils.json_to_sheet(
    workbook,
    {
      header: EXCEL_HEADER_MARKET,
      origin: 'A5'
    } );
  const wb = XLSX.utils.book_new();
  if (!wb.Props) wb.Props = {};

  wb.Props.Title = "Trade History";


  const wscols = _.reduce([...Array(23).keys()], (result, key) => {
    result.push({ 'wch': 30 })
    return result
  }, []);
  ws[ '!cols' ] = wscols;

  const displayTemplate = _getAccountTemplateMarket( _.first(exportData) );

  XLSX.utils.sheet_add_aoa( ws, displayTemplate, { origin: 'A1' } );
  XLSX.utils.book_append_sheet( wb, ws, "Trade History" );
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
