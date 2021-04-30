import moment from 'moment'
import _ from 'lodash'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { FormatCurrency, FormatDate, FormatStatus } from '../../common/utils'

moment.locale('es') // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Nombre',
  'Apellido',
  'Email',
  'Teléfono',
  'País',
  'Referido',
  'Usuario',
  'Contraseña',
  'UserID',
  'Creado por el Usuario',
  'Fecha de Creación',
  'Fecha de Firma',
  'Fecha de Actualización',
]

const addCommentToCell = (context, column, comment) => {
  if (!context[column].c) context[column].c = []

  context[column].c.hidden = true
  return context[column].c.push({ t: comment })
}

const getExportFileName = (orgId) => {
  const time = moment().format()
  return `usuario_${time}.xlsx`
}

const getPassword = (username, createdAt) => {
  const date = new Date(createdAt)
  const user = username.replace(/[0-9]/g, '')
  const year = date.getFullYear()
  return `${user}@${year}`
}

const _formatData = (data) => {
  return _.map(data, (user) => {
    return {
      Nombre: user.firstName,
      Apellido: user.lastName,
      Email: user.email,
      Teléfono: user.phoneNumber,
      País: user.country,
      Referido: user.referred,
      Usuario: user.username,
      Contraseña: getPassword(user.username, user.createdAt),
      UserID: user.userID,
      'Creado por el Usuario': user.createdByUsername,
      'Fecha de Creación': FormatDate(user.createdAt),
      'Fecha de Firma': FormatDate(user.signDate),
      'Fecha de Actualización': FormatDate(user.updatedAt),
    }
  })
}

const _getAccountTemplateMarket = (data) => {
  return [['Detalle'], ['']]
}

function exportUserDetail(exportData) {
  const workbook = _formatData(exportData)

  //Define template structure
  let ws = XLSX.utils.json_to_sheet(workbook, {
    header: EXCEL_HEADER_MARKET,
    origin: 'A3',
  })
  const wb = XLSX.utils.book_new()
  if (!wb.Props) wb.Props = {}

  wb.Props.Title = 'Information de Usuario'

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
  XLSX.utils.book_append_sheet(wb, ws, 'Usuario')
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const html = XLSX.utils.sheet_to_html(ws)

  // Generate XLSX file and send to client
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  //FileSaver.saveAs(blob, getExportFileName())
  FileSaver.saveAs(blob, getExportFileName())
  //props.resetExportCharges();
}

export default exportUserDetail
