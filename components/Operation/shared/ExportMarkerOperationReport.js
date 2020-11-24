import moment from 'moment';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';

moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Estado',
  'Producto',
  'Derivado',
  'Usuario',
  'Nombre',
  'Apellido',
  'Saldo Actual',
  'Inversión',
  'Precio de compra',
  'Margen de Mantenimiento',
  'Taking Profit',
  'Stop/Lost',
  'L/S',
  'Hold',
  'Fecha de apertura',
  'Fecha de actualización',
  'Broker',
  'Orden',
];

const getExportFileName = () => {
  const time = moment().format();
  return `reporte_operaciones_bolsa_OTC_${ time }.xlsx`
};

const _formatData = (data) => {
  const sortedData = data.sort((a, b) => {
    let start = a.endDate;
    let end = b.endDate;
    if (_.isNil( start )) start = '00-00-0000';
    if (_.isNil( end )) end = '00-00-0000';

    return moment( start ).unix() - moment( end ).unix()
  });

  return _.map( sortedData, operation => {
    return {
      'Estado': FormatStatus(operation.status, true).name,
      'Producto': operation.product.name,
      'Derivado': operation.assetClass.name,
      'Usuario': operation.userAccount.user.username,
      'Nombre': operation.userAccount.user.firstName,
      'Apellido': operation.userAccount.user.lastName,
      'Saldo Actual': FormatCurrency.format( operation.amount ),
      'Inversión': FormatCurrency.format( operation.initialAmount ),
      'Precio de compra': FormatCurrency.format( operation.buyPrice ),
      'Margen de Mantenimiento': FormatCurrency.format( operation.maintenanceMargin ),
      'Taking Profit': FormatCurrency.format( operation.takingProfit ),
      'Stop/Lost': `${operation.stopLost}%`,
      'L/S': operation.longShort,
      'Hold': FormatCurrency.format( operation.holdStatusCommission ),
      'Fecha de apertura': FormatDate(operation.createdAt),
      'Fecha de actualización': FormatDate(operation.updatedAt),
      'Broker': operation.broker.name,
      'Orden': operation.orderId,
    }

  } )


};

function exportMarketOperationReport(exportData) {
  const workbook = _formatData( exportData );

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(
    workbook,
    {
      header: EXCEL_HEADER_MARKET,
      origin: 'A1'
    } );
  const wb = XLSX.utils.book_new();
  if (!wb.Props) wb.Props = {};

  wb.Props.Title = "Reporte Operaciones Bolsa OTC";


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

  XLSX.utils.book_append_sheet( wb, ws, "Reporte Operaciones Bolsa OTC" );
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
  const html = XLSX.utils.sheet_to_html( ws );

  // Generate XLSX file and send to client
  const wbout = XLSX.write( wb, wopts );
  const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );


  FileSaver.saveAs( blob, getExportFileName() )



}


export default exportMarketOperationReport;
