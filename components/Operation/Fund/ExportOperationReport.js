import moment from 'moment'
import _ from 'lodash'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils'

moment.locale('es') // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Estado',
  'Usuario',
  'Nombre',
  'Apellido',
  'Tipo de Operación',
  'Cuenta de Usuario',
  'Saldo Inicial',
  'Saldo Actual',
  'Fecha de apertura',
  'Fecha de expiración',
]

const getExportFileName = () => {
  const time = moment().format()
  return `reporte_operaciones_funds_${time}.xlsx`
}

const _formatData = (data) => {
  const sortedData = data.sort((a, b) => {
    let start = a.expirationDate
    let end = b.expirationDate
    if (_.isNil(start)) start = '00-00-0000'
    if (_.isNil(end)) end = '00-00-0000'

    return moment(start).unix() - moment(end).unix()
  })

  return _.map(sortedData, (operation) => {
    return {
      Estado: FormatStatus(operation.status, true).name,
      Usuario: operation.userAccount.user.username,
      Nombre: operation.userAccount.user.firstName,
      Apellido: operation.userAccount.user.lastName,
      'Tipo de Operación': operation.operationType,
      'Cuenta de Usuario': operation.userAccount.account.name,
      'Saldo Inicial': FormatCurrency.format(operation.initialAmount),
      'Saldo Actual': FormatCurrency.format(operation.amount),
      'Fecha de apertura': FormatDate(operation.startDate),
      'Fecha de expiración': FormatDate(operation.expirationDate),
    }
  })
}

function exportFundOperationReport(exportData) {
  const workbook = _formatData(exportData)

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(workbook, {
    header: EXCEL_HEADER_MARKET,
    origin: 'A1',
  })
  const wb = XLSX.utils.book_new()
  if (!wb.Props) wb.Props = {}

  wb.Props.Title = 'Reporte Operaciones Funds'

  const wscols = _.reduce(
    [...Array(23).keys()],
    (result, key) => {
      result.push({ wch: 30 })
      return result
    },
    []
  )
  ws['!cols'] = wscols

  ws = _.transform(
    ws,
    function (result, value, key) {
      if (_.startsWith(value.v, '$')) {
        const number = parseFloat(value.v.replace(/\$|,/g, ''))
        result[key] = { v: number, t: 'n', z: '$#,###.00' }
      } else {
        result[key] = value
      }
    },
    {}
  )

  XLSX.utils.book_append_sheet(wb, ws, 'Reporte Operaciones Funds')
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const html = XLSX.utils.sheet_to_html(ws)

  // Generate XLSX file and send to client
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  FileSaver.saveAs(blob, getExportFileName())
}

export default exportFundOperationReport
