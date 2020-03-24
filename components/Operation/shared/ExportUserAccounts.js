import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Icon } from 'antd';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';
import PHE from 'print-html-element';

moment.locale( 'es' ); // Set Lang to Spanish

const addCommentToCell = (context, column, comment) => {
  if (!context[ column ].c) context[ column ].c = [];

  context[ column ].c.hidden = true;
  return context[ column ].c.push( { t: comment } );
};

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `reporte_cuenta_${ time }.xlsx`
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

  _getAccountTemplate = (accounts) => {
    return  _.reduce(accounts, (result, account) => {

      result.push(
        [
          [ `INFORMACIÓN DE LA CUENTA: ${account.account.name}`, `Fecha de apertura: ${FormatDate(account.createdAt)}` ],
          [ '' ],
          [ `Valor de la cuenta: ${FormatCurrency.format( account.accountValue )}`, `Tipo de Cuenta: ${account.account.name}`, `Comisión sobre ganancias: ${ account.account.percentage } %` ],
          [ `Garantías disponibles: ${FormatCurrency.format( account.guaranteeOperation )}`, `Saldo Inicial: ${FormatCurrency.format( account.balanceInitial )}` ],
          [ '' ]
        ]
      );
      return result
    }, []);

  };


  _downloadFile = (isPDF) => {
    const { exportData, currentOperation } = this.props;
    const workbook = this._formatData( exportData );

    //Define template structure
    const ws = XLSX.utils.json_to_sheet(
      workbook, );
    const wb = XLSX.utils.book_new();
    if (!wb.Props) wb.Props = {};

    wb.Props.Title = "Detalle de Cuentas";

    const wscols = [
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 },
      { wch: 40 }
    ];
    ws[ '!cols' ] = wscols;

    const displayTemplate = this._getAccountTemplate( this.props.userAccounts );

    XLSX.utils.sheet_add_aoa( ws, _.flatten(displayTemplate), { origin: 'A1' } );
    XLSX.utils.book_append_sheet( wb, ws, "Detalle de Cuentas" );
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
    const html = XLSX.utils.sheet_to_html( ws );
    const opts = {
      styles: ['color', 'black']
    };

    // Generate XLSX file and send to client
    const wbout = XLSX.write( wb, wopts );
    const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );

    if (isPDF) {
      PHE.printHtml(html, opts);
    } else {
      FileSaver.saveAs(blob, getExportFileName())
    }

  };

  render() {
    return (
      <>
        <Row style={{marginBottom: 30}}>
          <Col>
            <Button
              type="primary"
              onClick={ () => this._downloadFile() }
              data-testid="export-button"
              className="export-excel-cta"
              style={ { float: 'left',  marginRight:15 } }
            >
              <Icon type="file-excel"/> Exportar Datos de la Cuenta
            </Button>
            {/*<Button*/}
            {/*  type="primary"*/}
            {/*  onClick={ () => this._downloadFile( true ) }*/}
            {/*  className="export-pdf-cta"*/}
            {/*  style={ { float: 'left' } }*/}
            {/*>*/}
            {/*  <Icon type="file-pdf" /> Imprimir (PDF)*/}
            {/*</Button>*/}
          </Col>
        </Row>
      </>
    );
  }
}


export default Export;
