import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Button, Icon } from 'antd';
import _ from 'lodash';
import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { FormatCurrency, FormatDate, FormatStatus } from '../../../../common/utils';
import { withNamespaces } from 'react-i18next';

moment.locale( 'es' ); // Set Lang to Spanish

class Export extends PureComponent {
  getExcelHeader = () => [
    this.props.t('balance'),
    this.props.t('movementGP'),
    this.props.t('date'),
  ];

  getExcelHeaderMarket = () => [
    this.props.t('balance'),
    this.props.t('movementGP'),
    'MP',
    this.props.t('date'),
  ];

  getExportFileName = (orgId) => {
    const time = moment().format();
    return `reporte_${ time }.xlsx`
  };
  _formatData = (data) => {
    const {t} = this.props;
    return _.map( data, movement => {
      if (this.props.isMarketMovement) {
        return {
          [t('balance')]: FormatCurrency.format( movement.gpInversion ),
          [t('movementGP')]: FormatCurrency.format( movement.gpAmount ),
          'MP': FormatCurrency.format( movement.marketPrice ),
          [t('date')]: FormatDate( movement.createdAt )
        }

      } else {
        return {
          [t('balance')]: FormatCurrency.format( movement.gpInversion ),
          [t('movementGP')]: FormatCurrency.format( movement.gpAmount ),
          [t('date')]: FormatDate( movement.createdAt )
        }
      }

    } )
  };

  _getAccountTemplateMarket = (data) => {
    const {t} = this.props;
    const {name: statusName} = FormatStatus(data.status);
    return [
      [ t('accountInformation') ],
      [ '' ],
      [ `${t('accountValue')}: ${FormatCurrency.format( data.userAccount.accountValue )}`, `${t('accountType')}: ${data.userAccount.account.name}`, `${t('profitCommission')}: ${ data.userAccount.account.percentage } %` ],
      [ `${t('availableGuarantees')}: ${FormatCurrency.format( data.userAccount.guaranteeOperation )}`, `${t('initialAmount')}: ${FormatCurrency.format( data.userAccount.balanceInitial )}`, `${t('marginUsed')} 10%: ${ FormatCurrency.format(data.userAccount.marginUsed || 0 )}` ],
      [ '' ],
      [ t('title operationInformation') ],
      [ '' ],
      [ `${t('createdAt')}: ${FormatDate(data.createdAt)}`, `L/S: ${data.longShort}`],
      [`${t('investment')}: ${FormatCurrency.format(data.initialAmount)}`, `${t('currentAmount')}: ${FormatCurrency.format(data.amount)}`],
      [`${t('product')}: ${data.product.name}`, `${t('lotage')}: ${data.commoditiesTotal} [${data.commodity.name}](${data.assetClass.name})`, `${t('buyPrice')}: ${FormatCurrency.format(data.buyPrice)}`, `${t('maintenanceMargin')}: ${FormatCurrency.format( data.maintenanceMargin )}`],
      [`${t('takingProfit')}: ${FormatCurrency.format(data.takingProfit)}`, `${t('stopLost')}: ${data.stopLost} %`, `${t('orderNumber')}: ${data.orderId}`, `${t('broker')}: ${data.broker.name}`, `${t('status')}: ${statusName}`],

    ]
  };

  _getAccountTemplateInvestment= (data) => {
    const {t} = this.props;
    const {name: statusName} = FormatStatus(data.status);
    return [
      [ t('accountInformation') ],
      [ '' ],
      [ `${t('accountValue')}: ${FormatCurrency.format( data.userAccount.accountValue )}`, `${t('accountType')}: ${data.userAccount.account.name}`, `${t('profitCommission')}: ${ data.userAccount.account.percentage } %` ],
      [ `${t('availableGuarantees')}: ${FormatCurrency.format( data.userAccount.guaranteeOperation )}`, `${t('initialAmount')}: ${FormatCurrency.format( data.userAccount.balanceInitial )}` ],
      [ '' ],
      [ t('accountValue') ],
      [ '' ],
      [ `${t('createdAt')}: ${FormatDate(data.startDate)}`, `${t('endDate')}: ${data.endDate ? FormatDate(data.endDate) : '--'}`],
      [ `${t('operationType')}: ${data.operationType}`, `${t('status')}: ${statusName}`],
      [`${t('initialAmount')}: ${FormatCurrency.format(data.initialAmount)}`, `${t('currentAmount')}: ${FormatCurrency.format(data.amount)}`],

    ]
  };

  _downloadFile = (columns) => {
    const { exportData, currentOperation } = this.props;
    const workbook = this._formatData( exportData );

    //Define template structure
    let ws = XLSX.utils.json_to_sheet(
      workbook,
      {
        header: this.props.isMarketMovement ? this.getExcelHeaderMarket() : this.getExcelHeader(),
        origin: 'A15'
      } );
    const wb = XLSX.utils.book_new();
    if (!wb.Props) wb.Props = {};

    wb.Props.Title = this.props.t('accountStatement');

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
    ws = _.transform(ws, function(result, value, key) {
      if (_.startsWith(value.v, '$')) {
        const number = parseFloat(value.v.replace(/\$|,/g, ''))
        result[key] = {v: number, t:'n', z: "$#,###.00"}
      } else {
        result[key] = value
      }

    }, {});
    const displayTemplate = _.isNil(currentOperation.commodity) ? this._getAccountTemplateInvestment( currentOperation ) : this._getAccountTemplateMarket( currentOperation );

    XLSX.utils.sheet_add_aoa( ws, displayTemplate, { origin: 'A1' } );
    XLSX.utils.book_append_sheet( wb, ws, this.props.t('accountStatement') );
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
    const html = XLSX.utils.sheet_to_html( ws );

    // Generate XLSX file and send to client
    const wbout = XLSX.write( wb, wopts );
    const blob = new Blob( [ wbout ], { type: "application/octet-stream" } );

    FileSaver.saveAs( blob, this.getExportFileName() )
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
              <Icon type="file-excel"/> {this.props.t('btn exportAccountInformation')}
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}


export default withNamespaces()(Export);
