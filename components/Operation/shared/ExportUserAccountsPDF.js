import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Descriptions, Tag, Icon } from 'antd';
import _ from 'lodash';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../common/utils';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const LOGO = 'data:image/png;base64,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\n'


moment.locale( 'es' ); // Set Lang to Spanish

const EXCEL_HEADER_MARKET = [
  'Débito',
  'Crédito',
  'Valor de la cuenta',
  'Detalle',
  'Fecha'
];

const getExportFileName = (isPDF) => {
  const time = moment().format();
  return `${ isPDF ? 'estado_cuenta' : 'reporte_cuenta' }_${ time }.${ isPDF ? 'pdf' : 'xlsx' }`
};


class Export extends PureComponent {

  _formatData = ({ userAccountMovement }) => {
    const sortedData = userAccountMovement.sort( (a, b) => {
      let start = a.createdAt;
      let end = b.createdAt;
      if (_.isNil( start )) start = '00-00-0000';
      if (_.isNil( end )) end = '00-00-0000';

      return moment( start ).unix() - moment( end ).unix()
    } );


    return _.map( sortedData, movement => {
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


  _downloadFile = () => {
    const { userAccount } = this.props;


    const { username, firstName, lastName } = userAccount.user;
    const movements = userAccount.userAccountMovement || [];
    const sortedData = movements.sort( (a, b) => {
      let start = a.createdAt;
      let end = b.createdAt;
      if (_.isNil( start )) start = '00-00-0000';
      if (_.isNil( end )) end = '00-00-0000';

      return moment( start ).unix() - moment( end ).unix()
    } );

    const AccountMovements = _.reduce( sortedData, (result, movement) => {
      const debit = {
        text: FormatCurrency.format( movement.debit ),
        color: '#ba382a',
        alignment: 'left',
      };
      const credit = {
        text: FormatCurrency.format( movement.credit ),
        color: '#046d11',
        alignment: 'left',
      };
      const previousAccountValue = {
        text: FormatCurrency.format( movement.previousAccountValue ),
        alignment: 'left',
      }
      const accountValue = {
        text: FormatCurrency.format( movement.accountValue ),
        alignment: 'left',
      };
      const reference = {
        text: movement.reference,
        alignment: 'left',
      };

      const createdAt = {
        text: FormatDate( movement.createdAt ),
        alignment: 'left',
      };


      result.push( [ debit, credit, previousAccountValue,accountValue, reference, createdAt ] );

      return result

    }, [] );

    const bodyDetail = userAccount.account.associatedOperation === 1 ? (
      [ {
        text: `Garantías disponibles:`,
        bold: true
      },
        { text: `${ FormatCurrency.format( userAccount.guaranteeOperation ) }` },
        {
        text: `Margen utilizado 10%:`,
        bold: true,
      },
        { text: `${ FormatCurrency.format( userAccount.marginUsed ) }` },
        {
        text: `Comisiones por referencia:`,
        bold: true,
      },
        { text: `${ FormatCurrency.format( userAccount.commissionByReference || 0 ) }` } ]
    ) : (
      [ {
        text: `Garantías / Créditos:`,
        bold: true
      },
        { text: `${ FormatCurrency.format( userAccount.guaranteeCredits ) }` },
        {
        text: ``,
        bold: true,
      },
        { text: `` },
        {
        text: ``,
        bold: true,
      },
        {  } ]
    )

    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [ 15, 80, 15, 40 ],
      defaultStyle: {
        fontSize: 10,
      },
      header: {
        layout: 'noBorders',
        margin: [ 5, 5 ],

        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [ '50%', '25%', '25%' ],

          body: [
            [ {
              image: 'logo',
              margin: [ 15, 0, 0, 0 ],
              width: 190, height: 54,
              fillColor: '#10253f',

            }, { text: '', fillColor: '#10253f' }, {
              fillColor: '#10253f',
              margin: [ 5, 5 ],
              stack: [
                {
                  text: "Estados Unidos",
                  color: '#fff'
                },
                {
                  text: "PO BOX 10022",
                  color: '#fff'
                },
                {
                  text: "New York | NY",
                  color: '#fff'
                },
                {
                  text: "info@royalcap-int.com",
                  color: '#fff'
                },
                {
                  text: "www.royalcap-int.com",
                  color: '#fff'
                },
              ],
            } ],
            [ { text: '', fillColor: '#254061', margin: [ 0, 5 ] }, {
              text: '',
              fillColor: '#254061',
              margin: [ 0, 5 ]
            }, { text: '', fillColor: '#254061', margin: [ 0, 5 ] } ]

          ]
        },

      },
      footer: {
        columns: [
          {
            text: '© 2020 RC LLC. All rights reserved. ROYAL CAPITAL INTERNATIONAL TRADING AVISORS',
            alignment: 'center',
            fontSize: 9,
          }
        ]
      },
      images: {
        logo: LOGO
      },
      content: [
        { text: '', margin: [ 0, 5 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '50%', '50%' ],

            body: [
              [ {
                fontSize: 18,
                text: 'INFORMACION DE CUENTA',
                bold: true,
                alignment: 'left',
                margin: [ 0, 15, 0, 10 ]
              }, { text: `Fecha de Reporte`, alignment: 'right', bold: true, margin: [ 0, 15, 0, 0 ] } ],
              [ {
                text: `${ firstName } ${ lastName }`,
                alignment: 'left',
                bold: true,
                fontSize: 15,
              }, { text: moment().format( 'DD/MM/YYYY' ), alignment: 'right' } ],
              [ { text: `${ username }`, alignment: 'left', bold: true, }, {} ],
            ]
          },

        },

        { text: '', margin: [ 0, 10 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '100%' ],

            body: [
              [ {
                fontSize: 16,
                text: 'Cuadro de Resumen',
                bold: true,
                alignment: 'center',
                fillColor: '#10253f', color: '#fff',
                margin: [ 0, 5 ]
              } ]
            ]
          },

        },
        { text: '', margin: [ 0, 10 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            margin: [ 0, 50 ],
            widths: [ '22%', '11%', '22%', '11%', '22%', '11%' ],
            body: [
              [ {
                text: `Tipo de cuenta:`,
                bold: true,

              },
                { text: `${ userAccount.account.name }` },
                {
                text: `Comisión sobre ganancias:`,
                bold: true
              },
                { text: `${ userAccount.account.percentage }%` },
                {
                text: `Garantías disponibles:`,
                bold: true
              },
                { text: `${ FormatCurrency.format( userAccount.guaranteeOperation ) }` }
                ],
              bodyDetail

            ]
          },
        },
        { text: '', margin: [ 0, 10 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '48%', '2%', '48%' ],
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
                  color: '#fff', fontSize: 12, bold: true,
                }
              ],
              [
                {
                  text: `${ FormatCurrency.format( userAccount.accountValue ) }`,
                  margin: [ 15, 0, 15, 15 ],
                  fillColor: '#547f26',
                  color: '#fff',
                  fontSize: 12,
                },
                {},
                {
                  text: `${ FormatCurrency.format( userAccount.balanceInitial ) }`,
                  margin: [ 15, 0, 15, 15 ],
                  fillColor: '#004079',
                  color: '#fff',
                  fontSize: 12,
                },
              ],
            ]
          },

        },

        { text: '', margin: [ 0, 30, 0, 10 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '100%' ],

            body: [
              [ {
                fontSize: 16,
                text: 'Transacciones',
                bold: true,
                alignment: 'center',
                fillColor: '#10253f', color: '#fff',
                margin: [ 0, 5 ]
              } ]
            ]
          },

        },
        { text: '', margin: [ 0, 10 ] },
        {
          layout: 'noBorders',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ '16%', '16%','16%', '16%', '16%', '16%' ],

            body: [
              [ { text: `Débito`, alignment: 'left', bold: true }, {
                text: `Crédito`,
                alignment: 'left',
                bold: true
              }, { text: `Saldo Anterior`, alignment: 'left', bold: true },{ text: `Valor de la Cuenta`, alignment: 'left', bold: true }, {
                text: `Detalle`,
                alignment: 'left',
                bold: true
              }, { text: `Fecha`, alignment: 'left', bold: true } ],
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
        defaultStyle: {
          backgroundColor: '#eeeeee',
        },
        anotherStyle: {
          italics: true,
          alignment: 'right'
        }
      }
    };

    const fileName = getExportFileName( true )
    pdfMake.createPdf( docDefinition ).download( fileName );


  };

  render() {
    const accountName = _.get(this.props, 'userAccount.account.name', '')
    return (
      <>
        <Row>
          <Col>
            <Button
              type="primary"
              onClick={ () => this._downloadFile(  ) }
              className="export-pdf-cta"
              style={ { float: 'right', marginBottom: 10 } }
            >
              <Icon type="file-pdf"/> {`Exportar Estado de Cuenta ${accountName} (PDF)`}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}


export default Export;
