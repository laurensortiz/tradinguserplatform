import moment from 'moment';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatusLang } from '../../../../common/utils';

moment.locale( 'es' ); // Set Lang to Spanish


function exportUserAccountHistory(exportData, t) {
  const getExportFileName = () => {
    const time = moment().format();
    return `${t('fileName accountReport')}_${ time }.xlsx`
  };

  const langStatus = status => t(`status ${status}`)

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
        [t('status')]: langStatus(FormatStatusLang(operation.status).name),
        [t('createdAt')]: FormatDate(operation.createdAt),
        [t('endDate')]: FormatDate(operation.endDate),
        [t('active')]: `${operation.product.name} (${operation.product.code})`,
        [t('ls')]: operation.longShort,
        [t('quantity')]: operation.commoditiesTotal,
        [t('buyPrice')]: FormatCurrency.format( operation.buyPrice ),
        [t('takingProfit')]: FormatCurrency.format( operation.takingProfit ),
        [t('stopLost')]: `${operation.stopLost}%`,
        [t('investment')]: FormatCurrency.format( operation.initialAmount ),
        [t('balanceGP')]: FormatCurrency.format( _.get(operation, 'marketMovement[0].gpInversion', 0 )),
        [t('movementGP')]: FormatCurrency.format( _.get(operation, 'marketMovement[0].gpAmount', 0 ) ),
        [t('order')]: operation.orderId,
        [t('broker')]: operation.broker.name,
        [t('accountValueBeforeEndOperation')]: FormatCurrency.format( operation.accountValueBeforeEndOperation ),
        [t('initialAmount')]: FormatCurrency.format( operation.initialAmount ),
        [t('closeAmount')]: FormatCurrency.format( operation.amount ),
        [t('profit')]: FormatCurrency.format( operation.profitBrut ),
        [t('commission')]: `${operation.userAccount.account.percentage}% (${operation.userAccount.account.name}) - ${FormatCurrency.format(operation.commissionValueEndOperation)}`,
        [t('hold')]: FormatCurrency.format( operation.holdStatusCommissionEndOperation ),
        [t('profitNet')]: FormatCurrency.format( operation.profitNet ),
        [t('endAmount')]: FormatCurrency.format( Number(operation.initialAmount) +  Number(operation.profitNet)),
        [t('guarantees')]: FormatCurrency.format(operation.guaranteeOperationValueEndOperation),
        [t('bankTransfers')]: '',
      }

    } )


  };

  const _getAccountTemplateMarket = (data) => {

    return [
      [ t('accountStatement') ],
      [ '' ],
      [ `${data.userAccount.user.firstName} ${data.userAccount.user.lastName} (${data.userAccount.user.username})` ],

    ]
  };


  const EXCEL_HEADER_MARKET = [
    t('status'),
    t('createdAt'),
    t('endDate'),
    t('active'),
    t('ls'),
    t('quantity'),
    t('buyPrice'),
    t('takingProfit'),
    t('stopLost'),
    t('investment'),
    t('balanceGP'),
    t('movementGP'),
    t('order'),
    t('broker'),
    t('accountValueBeforeEndOperation'),
    t('initialAmount'),
    t('closeAmount'),
    t('profit'),
    t('commission'),
    t('hold'),
    t('profitNet'),
    t('endAmount'),
    t('guarantees'),
    t('bankTransfers')
  ];


  const oderded = _.orderBy(exportData, ['guaranteeOperationValueEndOperation', 'asc'])
  const workbook = _formatData( oderded );





  //Define template structure
  let ws = XLSX.utils.json_to_sheet(
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
