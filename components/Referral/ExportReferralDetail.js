import moment from 'moment'
import _ from 'lodash'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { FormatCurrency, FormatDate, FormatStatus } from '../../common/utils'

moment.locale('es') // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'ID',
  'Nombre',
  'Apellido',
  'Email',
  'Teléfono',
  'País',
  'Ciudad',
  'Ocupación',
  'Monto de Inversión',
  'Compra de Broker Guarantee',
  'Nombre del corredor asignado',
  'Código de Broker Guarantee',
  'Cantidad',
  'IB Colaborador',
  'Descripción del cliente referido',
  'Creado por el Usuario',
  'Broker Principal',
  'Broker Adicional',
  'Fecha de Creación',
  'Fecha de Actualización',
]

const addCommentToCell = (context, column, comment) => {
  if (!context[column].c) context[column].c = []

  context[column].c.hidden = true
  return context[column].c.push({ t: comment })
}

const getExportFileName = (orgId) => {
  const time = moment().format()
  return `referral_tickets_${time}.xlsx`
}

const _formatData = (data) => {
  return _.map(data, (account) => {
    return {
      ID: account.id,
      Nombre: account.firstName,
      Apellido: account.lastName,
      Email: account.email,
      Teléfono: account.phoneNumber,
      País: account.country,
      Ciudad: account.city,
      Ocupación: account.jobTitle,
      'Monto de Inversión': FormatCurrency.format(account.initialAmount),
      'Compra de Broker Guarantee': account.hasBrokerGuarantee === 1 ? 'Sí' : 'No',
      'Nombre del corredor asignado': account.brokerName,
      'Código de Broker Guarantee': account.brokerGuaranteeCode,
      Cantidad: account.quantity,
      'IB Colaborador': account.collaboratorIB,
      'Descripción del cliente referido': account.description,
      'Creado por el Usuario': _.get(account, 'username', ' - '),
      'Broker Principal': account.brokerName,
      'Broker Adicional': account.brokerName2,
      'Fecha de Creación': FormatDate(account.createdAt),
      'Fecha de Actualización': FormatDate(account.updatedAt),
    }
  })
}

const _getAccountTemplateMarket = (data) => {
  return [['Reporte de Referral Ticket'], ['']]
}

function exportReferralDetail(exportData) {
  const workbook = _formatData(exportData)

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(workbook, {
    header: EXCEL_HEADER_MARKET,
    origin: 'A3',
  })
  const wb = XLSX.utils.book_new()
  if (!wb.Props) wb.Props = {}

  wb.Props.Title = 'Referral Tickets'

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

  const displayTemplate = _getAccountTemplateMarket(_.first(exportData))

  XLSX.utils.sheet_add_aoa(ws, displayTemplate, { origin: 'A1' })
  XLSX.utils.book_append_sheet(wb, ws, 'Cuentas de Clientes')
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const html = XLSX.utils.sheet_to_html(ws)

  // Generate XLSX file and send to client
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  //FileSaver.saveAs(blob, getExportFileName())
  FileSaver.saveAs(blob, getExportFileName())
  //props.resetExportCharges();
}

export default exportReferralDetail
