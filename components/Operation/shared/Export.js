import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Icon } from 'antd';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';

moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER = [
  'Balance',
  'Movimiento',
  'Fecha',
];

const addCommentToCell = (context, column, comment) => {
  if (!context[ column ].c) context[ column ].c = [];

  context[ column ].c.hidden = true;
  return context[ column ].c.push( { t: comment } );
};

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `reporte_${ time }.xlsx`
};


class Export extends PureComponent {

  _formatData = (data) => {
    return _.map( data, movement => {
      return {
        'Balance': FormatCurrency.format( movement.gpInversion ),
        'Movimiento': FormatCurrency.format( movement.gpAmount ),
        'Fecha': FormatDate( movement.createdAt )
      }
    } )
  };

  _getAccountTemplateMarket = (data) => {
    const {name: statusName} = FormatStatus(data.status);
    return [
      [ 'INFORMACIÓN DE LA CUENTA' ],
      [ '' ],
      [ `Valor de la cuenta: ${FormatCurrency.format( data.userAccount.accountValue )}`, `Tipo de Cuenta: ${data.userAccount.account.name}`, `Comisión sobre ganancias: ${ data.userAccount.account.percentage } %` ],
      [ `Garantías disponibles: ${FormatCurrency.format( data.userAccount.guaranteeOperation )}`, `Saldo Inicial: ${FormatCurrency.format( data.userAccount.balanceInitial )}` ],
      [ '' ],
      [ 'INFORMACIÓN DE LA OPERACIÓN' ],
      [ '' ],
      [ `Fecha de apertura: ${FormatDate(data.createdAt)}`, `L/S: ${data.longShort}`],
      [`Inversión: ${FormatCurrency.format(data.initialAmount)}`, `Saldo actual: ${FormatCurrency.format(data.amount)}`],
      [`Producto: ${data.product.name}`, `Lotage: ${data.commoditiesTotal} [${data.commodity.name}](${data.assetClass.name})`, `Precio de compra: ${FormatCurrency.format(data.buyPrice)}`, `Margen de mantenimiento: ${FormatCurrency.format( data.maintenanceMargin )}`],
      [`Taking Profit: ${FormatCurrency.format(data.takingProfit)}`, `S/L: ${data.stopLost} %`, `Número de orden: ${data.orderId}`, `Broker: ${data.broker.name}`, `Estado: ${statusName}`],

    ]
  };

  _getAccountTemplateInvestment= (data) => {
    const {name: statusName} = FormatStatus(data.status);
    return [
      [ 'INFORMACIÓN DE LA CUENTA' ],
      [ '' ],
      [ `Valor de la cuenta: ${FormatCurrency.format( data.userAccount.accountValue )}`, `Tipo de Cuenta: ${data.userAccount.account.name}`, `Comisión sobre ganancias: ${ data.userAccount.account.percentage } %` ],
      [ `Garantías disponibles: ${FormatCurrency.format( data.userAccount.guaranteeOperation )}`, `Saldo Inicial: ${FormatCurrency.format( data.userAccount.balanceInitial )}` ],
      [ '' ],
      [ 'INFORMACIÓN DE LA OPERACIÓN' ],
      [ '' ],
      [ `Fecha de apertura: ${FormatDate(data.createdAt)}`, `Fecha de apertura: ${data.endDate ? FormatDate(data.endDate) : '--'}`],
      [ `Tipoe de operación: ${data.operationType}`, `Estado: ${statusName}`],
      [`Saldo inicial: ${FormatCurrency.format(data.initialAmount)}`, `Saldo actual: ${FormatCurrency.format(data.amount)}`],

    ]
  };

  _downloadFile = (columns) => {
    const { exportData, currentOperation } = this.props;
    const workbook = this._formatData( exportData );

    //Define template structure
    const ws = XLSX.utils.json_to_sheet(
      workbook,
      {
        header: EXCEL_HEADER,
        origin: 'A15'
      } );
    const wb = XLSX.utils.book_new();
    if (!wb.Props) wb.Props = {};

    wb.Props.Title = "Estado de Cuenta";

    _.map( columns, ({ col, title }) => {

      if (ws[ `${ col }` ]) {
        return ws[ `${ col }` ].v = title
      }

    } );
    const wscols = [
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 }
    ];
    ws[ '!cols' ] = wscols;

    const displayTemplate = _.isNil(currentOperation.commodity) ? this._getAccountTemplateInvestment( currentOperation ) : this._getAccountTemplateMarket( currentOperation );

    XLSX.utils.sheet_add_aoa( ws, displayTemplate, { origin: 'A1' } );
    XLSX.utils.book_append_sheet( wb, ws, "Estado de cuenta" );
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
    const html = XLSX.utils.sheet_to_html( ws );

    // Generate XLSX file and send to client
    const wbout = XLSX.write( wb, wopts );
    const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );

    //FileSaver.saveAs(blob, getExportFileName())
    FileSaver.saveAs( blob, getExportFileName() )
    //this.props.resetExportCharges();
  };

  render() {
    return (
      <>
        <Row>
          <Col>
            <Button
              type="primary"
              onClick={ () => this._downloadFile() }
              data-testid="export-button"
              className="export-excel-cta"
              style={ { float: 'right' } }
            >
              <Icon type="file-excel"/> Exportar Estado de Cuenta
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}


export default Export;
