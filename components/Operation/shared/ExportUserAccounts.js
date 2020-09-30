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

  _formatData = ({ userAccountMovement }) => {
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
    return _.reduce( accounts, (result, account) => {

      if (account.account.associatedOperation === 1) {
        result.push(
          [
            [ `INFORMACIÓN DE LA CUENTA: ${ account.account.name }`, `Fecha de apertura: ${ FormatDate( account.createdAt ) }` ],
            [ '' ],
            [ `Valor de la cuenta: ${ FormatCurrency.format( account.accountValue ) }`, `Tipo de Cuenta: ${ account.account.name }`, `Comisión sobre ganancias: ${ account.account.percentage } %` ],
            [ `Garantías disponibles: ${ FormatCurrency.format( account.guaranteeOperation ) }`, `Saldo Inicial: ${ FormatCurrency.format( account.balanceInitial ) }`, `Comisión por referencia: ${ FormatCurrency.format( account.commissionByReference ) } ` ],
            [ '' ]
          ] )
      } else {
        result.push(
          [
            [ `INFORMACIÓN DE LA CUENTA: ${ account.account.name }`, `Fecha de apertura: ${ FormatDate( account.createdAt ) }` ],
            [ '' ],
            [ `Valor de la cuenta: ${ FormatCurrency.format( account.accountValue ) }`, `Tipo de Cuenta: ${ account.account.name }`, `Comisión sobre ganancias: ${ account.account.percentage } %` ],
            [ `Garantías / Créditos: ${ FormatCurrency.format( account.guaranteeCredits ) }`, `Saldo Inicial: ${ FormatCurrency.format( account.balanceInitial ) }` ],
            [ '' ]
          ] )
      }

      return result
    }, [] );

  };


  _downloadFile = (isPDF) => {
    const { exportData, userAccounts } = this.props;
    const userAccount = _.first( userAccounts );
    const workbook = this._formatData( userAccount );

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
    ws = _.transform( ws, function (result, value, key) {
      if (_.startsWith( value.v, '$' )) {
        const number = parseFloat( value.v.replace( /\$|,/g, '' ) )
        result[ key ] = { v: number, t: 'n', z: "$#,###.00" }
      } else {
        result[ key ] = value
      }

    }, {} );

    const displayTemplate = this._getAccountTemplate( this.props.userAccounts );

    XLSX.utils.sheet_add_aoa( ws, _.flatten( displayTemplate ), { origin: 'A1' } );
    XLSX.utils.book_append_sheet( wb, ws, "Detalle de Cuentas" );
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
    const html = XLSX.utils.sheet_to_html( ws );
    const opts = {
      styles: [ 'color', 'black' ]
    };

    // Generate XLSX file and send to client
    const wbout = XLSX.write( wb, wopts );
    const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );


    if (isPDF) {
      //PHE.printHtml(html, opts);
      const { username, firstName, lastName } = userAccount.user;
      const AccountMovements = _.reduce(userAccount.userAccountMovement, (result, movement) => {
        const debit = {
          text: FormatCurrency.format(movement.debit),
          color: 'red',
          alignment: 'center',
        };
        const credit = {
          text: FormatCurrency.format(movement.credit),
          color: 'green',
          alignment: 'center',
        };
        const accountValue = {
          text: FormatCurrency.format(movement.accountValue),
        };
        const reference = {
          text: movement.reference,
          alignment: 'center',
        };

        const createdAt = {
          text: FormatDate(movement.createdAt),
          alignment: 'center',
        };


        result.push([debit, credit, accountValue, reference, createdAt]);

        return result

      }, []);
      
      const docDefinition = {
        pageSize: 'LETTER',

        pageMargins: [ 15, 80, 15, 40 ],
        defaultStyle: {
          fontSize: 10,
        },
        header: {
          layout: 'noBorders',
          margin: 8,
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 2,
            widths: [ '50%', '50%' ],

            body: [
              [ {
                image: 'logo',
                margin: [ 15, 0,0,0 ],
                width: 240, height: 68,
                fillColor: '#10253f',

              }, {
                text: 'Estados Unidos',
                alignment: 'right',
                fillColor: '#10253f',
                color: '#fff',
                margin: [ 0, 10, 15, 0 ]
              } ],
              [ {text:'',fillColor: '#10253f'}, {
                text: 'PO BOX 10022',
                alignment: 'right',
                fillColor: '#10253f',
                color: '#fff',
                margin: [ 0, 0, 15, 0 ]
              } ],
              [ {text:'',fillColor: '#10253f'}, {
                text: 'New York | NY',
                alignment: 'right',
                fillColor: '#10253f',
                color: '#fff',
                margin: [ 0, 0, 15, 0 ]
              } ],
              [ {text:'',fillColor: '#10253f'}, {
                text: 'info@royalcap-int.com',
                alignment: 'right',
                fillColor: '#10253f',
                color: '#fff',
                margin: [ 0, 0, 15, 0 ]
              } ],
              [ {text:'',fillColor: '#10253f'}, {
                text: 'www.royalcap-int.com',
                alignment: 'right',
                fillColor: '#10253f',
                color: '#fff',
                height: 60,
                margin: [ 0, 0, 15, 15 ]
              } ],
            ]
          },

        },
        footer: {
          columns: [
            {
              text: '© 2020 RC LLC. All rights reserved. ROYAL CAPITAL INTERNATIONAL TRADING AVISORS',
              alignment: 'center'
            }
          ]
        },
        images: {
          logo: 'https://webtrader-software.herokuapp.com/static/Royal-Capital-New-Logo-2020.png'
        },
        content: [
          {
            layout: 'noBorders',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '50%', '50%' ],

              body: [
                [ {
                  fontSize: 20,
                  text: 'INFORMACION DE CUENTA',
                  bold: true,
                  alignment: 'left',
                  margin: [ 0, 15, 0, 0 ]
                }, { text: `Fecha de Reporte`, alignment: 'right', margin: [ 0, 15, 0, 0 ] } ],
                [ {
                  text: `${ firstName } ${ lastName }`,
                  alignment: 'left',
                  bold: true
                }, { text: moment().format( 'DD/MM/YYYY' ), alignment: 'right' } ],
                [ { text: `${ username }`, alignment: 'left', bold: true }, {} ],
              ]
            },

          },

          {},
          { fontSize: 18, text: 'Cuadro de Resumen', bold: true, alignment: 'center', margin: [ 0, 15, 0, 15 ] },
          {},
          {
            layout: 'noBorders',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [ '22%', '11%', '22%', '11%', '22%', '11%' ],

              body: [
                [ {
                  text: `Tipo de cuenta:`,
                  bold: true
                }, { text: `${ userAccount.account.name }` }, {
                  text: `Comisión sobre ganancias:`,
                  bold: true
                }, { text: `${ userAccount.account.percentage }%` }, {
                  text: `Garantías disponibles:`,
                  bold: true
                }, { text: `${ FormatCurrency.format( userAccount.guaranteeOperation ) }` } ],
                [ {
                  text: `Garantías / Créditos:`,
                  bold: true
                }, { text: `${ FormatCurrency.format( userAccount.guaranteeCredits ) }` }, {
                  text: `Margen utilizado 10%:`,
                  bold: true
                }, { text: `${ FormatCurrency.format( userAccount.marginUsed ) }` }, {
                  text: `Comisiones por referencia:`,
                  bold: true
                }, { text: `${ FormatCurrency.format( userAccount.commissionByReference || 0 ) }` } ],

              ]
            },
          },
          {
            layout: 'noBorders',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '48%','2%', '48%' ],

              body: [
                [
                  {
                    fontSize: 12,
                    text: 'Valor de la Cuenta',
                    bold: true,
                    alignment: 'left',
                    margin: [ 15, 15, 15, 5 ],
                    fillColor: '#547f26',
                    color: '#fff',
                  },
                  {},
                  {
                    text: `Saldo Inicial`, alignment: 'left', margin: [ 15, 15, 15, 5 ], fillColor: '#004079',
                    color: '#fff',fontSize: 12,bold: true,
                  }
                ],
                [
                  {
                    text: `${FormatCurrency.format(userAccount.accountValue)}`,
                    margin: [ 15, 0, 15, 15 ],
                    fillColor: '#547f26',
                    color: '#fff',
                    fontSize: 12,
                  },
                  {},
                  {
                    text: `${FormatCurrency.format(userAccount.balanceInitial)}`,
                    margin: [ 15, 0, 15, 15 ],
                    fillColor: '#004079',
                    color: '#fff',
                    fontSize: 12,
                  },
                ],
              ]
            },

          },

          {},
          { fontSize: 18, text: 'Transferencias', bold: true, alignment: 'center', margin: [ 0, 15, 0, 15 ] },
          {
            layout: 'noBorders',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '20%', '20%', '20%', '20%', '20%' ],

              body: [
                [ { text: `Débito`, alignment: 'center', bold: true }, {
                  text: `Crédito`,
                  alignment: 'center',
                  bold: true
                }, { text: `Valor de la Cuenta`, alignment: 'center', bold: true }, {
                  text: `Detalle`,
                  alignment: 'center',
                  bold: true
                }, { text: `Fecha`, alignment: 'center', bold: true } ],
                ...AccountMovements
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            background: '#10253f'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          }
        }
      };


      pdfMake.createPdf( docDefinition ).download();

    } else {
      FileSaver.saveAs( blob, getExportFileName() )
    }

  };

  render() {
    return (
      <>
        <Row style={ { marginBottom: 30 } }>
          <Col>
            <Button
              type="primary"
              onClick={ () => this._downloadFile() }
              data-testid="export-button"
              className="export-excel-cta"
              style={ { float: 'left', marginRight: 15 } }
            >
              <Icon type="file-excel"/> Exportar Datos de la Cuenta
            </Button>
            <Button
              type="primary"
              onClick={ () => this._downloadFile( true ) }
              className="export-pdf-cta"
              style={ { float: 'left' } }
            >
              <Icon type="file-pdf"/> Exportar Estado de Cuenta (PDF)
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}


export default Export;
