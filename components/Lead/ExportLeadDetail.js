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
      'Fecha de Creación': FormatDate(account.createdAt),
      'Fecha de Actualización': FormatDate(account.updatedAt),
    }
  })
}

const _getAccountTemplateMarket = (data) => {
  return [['Reporte de Leads'], ['']]
}

function ExportLeadDetail(exportData) {
  const workbook = _formatData(exportData)

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(workbook, {
    header: EXCEL_HEADER_MARKET,
    origin: 'A3',
  })
  const wb = XLSX.utils.book_new()
  if (!wb.Props) wb.Props = {}

  wb.Props.Title = 'Leads'

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
  XLSX.utils.book_append_sheet(wb, ws, 'Leads')
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const html = XLSX.utils.sheet_to_html(ws)

  // Generate XLSX file and send to client
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  //FileSaver.saveAs(blob, getExportFileName())
  FileSaver.saveAs(blob, getExportFileName())
}

export default ExportLeadDetail
