import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Icon } from 'antd';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';
import PHE from 'print-html-element';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Débito',
  'Crédito',
  'Valor de la cuenta',
  'Detalle',
  'Fecha'
];

const getExportFileName = (orgId) => {
  const time = moment().format();
  return `reporte_cuenta_${ time }.xlsx`
};


class Export extends PureComponent {

  _formatData = ({userAccountMovement}) => {
    return _.map( userAccountMovement, movement => {
      return {
        'Débito': FormatCurrency.format( movement.debit ),
        'Crédito': FormatCurrency.format( movement.credit ),
        'Valor de la cuenta': FormatCurrency.format( movement.accountValue ),
        'Detalle': movement.reference,
        'Fecha': FormatDate( movement.createdAt )
      }
    } )

  };

  _getAccountTemplate = (accounts) => {
    return  _.reduce(accounts, (result, account) => {

      if (account.account.associatedOperation === 1) {
        result.push(
          [
            [ `INFORMACIÓN DE LA CUENTA: ${account.account.name}`, `Fecha de apertura: ${FormatDate(account.createdAt)}` ],
            [ '' ],
            [ `Valor de la cuenta: ${FormatCurrency.format( account.accountValue )}`, `Tipo de Cuenta: ${account.account.name}`, `Comisión sobre ganancias: ${ account.account.percentage } %` ],
            [ `Garantías disponibles: ${FormatCurrency.format( account.guaranteeOperation )}`, `Saldo Inicial: ${FormatCurrency.format( account.balanceInitial )}`, `Comisión por referencia: ${ FormatCurrency.format(account.commissionByReference) } ` ],
            [ '' ]
          ])
      } else {
        result.push(
          [
            [ `INFORMACIÓN DE LA CUENTA: ${account.account.name}`, `Fecha de apertura: ${FormatDate(account.createdAt)}` ],
            [ '' ],
            [ `Valor de la cuenta: ${FormatCurrency.format( account.accountValue )}`, `Tipo de Cuenta: ${account.account.name}`, `Comisión sobre ganancias: ${ account.account.percentage } %` ],
            [ `Garantías / Créditos: ${FormatCurrency.format( account.guaranteeCredits )}`, `Saldo Inicial: ${FormatCurrency.format( account.balanceInitial )}` ],
            [ '' ]
          ])
      }

      return result
    }, []);

  };


  _downloadFile = (isPDF) => {
    const { exportData, userAccounts } = this.props;
    const workbook = this._formatData( _.first(userAccounts) );

    //Define template structure
    let ws = XLSX.utils.json_to_sheet(
      workbook,
      {
        header: EXCEL_HEADER_MARKET,
        origin: 'A7'
      } );


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
    ws = _.transform(ws, function(result, value, key) {
      if (_.startsWith(value.v, '$')) {
        const number = parseFloat(value.v.replace(/\$|,/g, ''))
        result[key] = {v: number, t:'n', z: "$#,###.00"}
      } else {
        result[key] = value
      }

    }, {});

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
      //PHE.printHtml(html, opts);

      var docDefinition = {
        content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 'auto', 100, '*' ],

              body: [
                [ 'First', 'Second', 'Third', 'The last one' ],
                [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
              ]
            }
          }
        ]
      };


      pdfMake.createPdf(docDefinition).download();

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
            <Button
              type="primary"
              onClick={ () => this._downloadFile( true ) }
              className="export-pdf-cta"
              style={ { float: 'left' } }
            >
              <Icon type="file-pdf" /> Exportar Estado de Cuenta (PDF)
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}


export default Export;
