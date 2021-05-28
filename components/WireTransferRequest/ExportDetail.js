import moment from 'moment'
import _ from 'lodash'
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { FormatCurrency, FormatDate, FormatStatus } from '../../common/utils'
import { Divider } from 'antd'
import React from 'react'

moment.locale('es') // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'ID',
  'Estado',
  'Usuario',
  'Moneda',
  'Cuenta RCM',
  'Método de transferencia',
  'Cuenta para retiro de fondos',
  'Monto USD',
  'Cobro de Comisiones USD',
  'Detalle de las referencias que generaron comisiones',
  'Número de Cuenta (Beneficiario)',
  'Nombre (Beneficiario)',
  'Apellido (Beneficiario)',
  'Dirección (Beneficiario)',
  'Nombre del Banco (Banco Beneficiario)',
  'Swift (Banco Beneficiario)',
  'Dirección (Banco Beneficiario)',
  'Nombre del Banco (Banco Intermediario)',
  'Swift (Banco Intermediario)',
  'Dirección (Banco Intermediario)',
  'Cuenta entre bancos',
  'Fecha de Creación',
  'Fecha de Actualización',
  'Fecha de Cancelación',
  'Referido',
  'País',
]

const addCommentToCell = (context, column, comment) => {
  if (!context[column].c) context[column].c = []

  context[column].c.hidden = true
  return context[column].c.push({ t: comment })
}

const getExportFileName = (orgId) => {
  const time = moment().format()
  return `wire_transfer_request_${time}.xlsx`
}

const _formatData = (data) => {
  return _.map(data, (account) => {
    return {
      ID: account.id,
      Estado: account.status ? 'Activo' : 'Cancelado',
      Usuario: account.username,
      Moneda: account.currencyType,
      'Cuenta RCM': account.accountRCM,
      'Método de transferencia': account.transferMethod,
      'Cuenta para retiro de fondos': account.accountWithdrawalRequest,
      'Monto USD': FormatCurrency.format(account.amount),
      'Cobro de Comisiones USD': FormatCurrency.format(account.commissionsCharge),
      'Detalle de las referencias que generaron comisiones': account.commissionsReferenceDetail,
      'Número de Cuenta (Beneficiario)': account.beneficiaryPersonAccountNumber,
      'Nombre (Beneficiario)': account.beneficiaryPersonFirstName,
      'Apellido (Beneficiario)': account.beneficiaryPersonLastName,
      'Dirección (Beneficiario)': account.beneficiaryPersonAddress,
      'Nombre del Banco (Banco Beneficiario)': account.beneficiaryBankName,
      'Swift (Banco Beneficiario)': account.beneficiaryBankSwift,
      'Dirección (Banco Beneficiario)': account.beneficiaryBankAddress,
      'Nombre del Banco (Banco Intermediario)': account.intermediaryBankName,
      'Swift (Banco Intermediario)': account.intermediaryBankSwift,
      'Dirección (Banco Intermediario)': account.intermediaryBankAddress,
      'Cuenta entre bancos': account.intermediaryBankAccountInterBank,
      'Fecha de Creación': FormatDate(account.createdAt),
      'Fecha de Actualización': FormatDate(account.updatedAt),
      'Fecha de Cancelación': FormatDate(account.closedAt),
      Referido: account.userAccount.user.referred,
      País: account.userAccount.user.country,
    }
  })
}

const _getAccountTemplateMarket = (data) => {
  return [['Reporte de Withdraw Dividends Request'], ['']]
}

function exportDetail(exportData) {
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
  XLSX.utils.book_append_sheet(wb, ws, 'Withdraw Dividends Request')
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const html = XLSX.utils.sheet_to_html(ws)

  // Generate XLSX file and send to client
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  //FileSaver.saveAs(blob, getExportFileName())
  FileSaver.saveAs(blob, getExportFileName())
  //props.resetExportCharges();
}

export default exportDetail
