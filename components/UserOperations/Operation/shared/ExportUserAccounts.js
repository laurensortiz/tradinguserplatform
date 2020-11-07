import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Icon } from 'antd';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate } from '../../../../common/utils';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { withNamespaces } from 'react-i18next';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

moment.locale( 'es' ); // Set Lang to Spanish

const getExportFileName = () => {
  const time = moment().format();
  return `reporte_cuenta_${ time }.xlsx`
};


class Export extends PureComponent {

  _getAccountTemplate = (accounts) => {
    const { t } = this.props;
    return _.reduce( accounts, (result, account) => {

      if (account.account.associatedOperation === 1) {
        result.push(
          [
            [ `${ t( 'accountInformation' ) }: ${ account.account.name }`, `${ t( 'createdAt' ) }: ${ FormatDate( account.createdAt ) }` ],
            [ '' ],
            [ `${ t( 'accountValue' ) }: ${ FormatCurrency.format( account.accountValue ) }`, `${ t( 'accountType' ) }: ${ account.account.name }`, `${ t( 'profitCommission' ) }: ${ account.account.percentage } %` ],
            [ `${ t( 'availableGuarantees' ) }: ${ FormatCurrency.format( account.guaranteeOperation ) }`, `${ t( 'initialAmount' ) }: ${ FormatCurrency.format( account.balanceInitial ) }`, `${ t( 'commissionsByReference' ) }: ${ FormatCurrency.format( account.commissionByReference ) } ` ],
            [ '' ]
          ] )
      } else {
        result.push(
          [
            [ `${ t( 'accountInformation' ) }: ${ account.account.name }`, `${ t( 'createdAt' ) }: ${ FormatDate( account.createdAt ) }` ],
            [ '' ],
            [ `${ t( 'accountValue' ) }: ${ FormatCurrency.format( account.accountValue ) }`, `${ t( 'accountType' ) }: ${ account.account.name }`, `${ t( 'profitCommission' ) }: ${ account.account.percentage } %` ],
            [ `${ t( 'guaranteesCredits' ) }: ${ FormatCurrency.format( account.guaranteeCredits ) }`, `${ t( 'initialAmount' ) }: ${ FormatCurrency.format( account.balanceInitial ) }` ],
            [ '' ]
          ] )
      }

      return result
    }, [] );

  };


  _downloadFile = () => {
    const workbook = [];

    //Define template structure
    let ws = XLSX.utils.json_to_sheet(
      workbook,
      {
        header: '',
        origin: 'A7'
      } );


    const wb = XLSX.utils.book_new();
    if (!wb.Props) wb.Props = {};

    wb.Props.Title = this.props.t( 'accountsDetail' );

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
    XLSX.utils.book_append_sheet( wb, ws, this.props.t( 'accountsDetail' ) );
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };

    // Generate XLSX file and send to client
    const wbout = XLSX.write( wb, wopts );
    const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );


    FileSaver.saveAs( blob, getExportFileName() )

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
              style={ { float: 'left', marginRight: 15, marginBottom: 10 } }
            >
              <Icon type="file-excel"/> { this.props.t( 'btn exportAccountInformation' ) }
            </Button>

          </Col>
        </Row>
      </>
    );
  }
}


export default withNamespaces()( Export );
