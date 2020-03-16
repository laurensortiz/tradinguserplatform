import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { PageHeader, Row, Col } from 'antd';

import Document from '../components/Document';

class Calendar extends Component {

  createMarkup = () => {
    return {__html:
        `<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_86ca6"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" target="_blank" rel="noopener"><span class="blue-text">AAPL chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:AAPL",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_86ca6"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_e06cd"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AMZN/" target="_blank" rel="noopener"><span class="blue-text">AMZN chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:AMZN",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_e06cd"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_90b83"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-NFLX/" target="_blank" rel="noopener"><span class="blue-text">NFLX chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:NFLX",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_90b83"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div id="tradingview_dd41b"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-NDX/" target="_blank" rel="noopener"><span class="blue-text">NDX chart</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
<script type="text/javascript">
  new TradingView.widget(
  {
  "width": 475,
  "height": 400,
  "symbol": "NASDAQ:NDX",
  "interval": "D",
  "timezone": "Etc/UTC",
  "theme": "Dark",
  "style": "1",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "allow_symbol_change": true,
  "show_popup_button": true,
  "popup_width": "1000",
  "popup_height": "650",
  "container_id": "tradingview_dd41b"
}
  );
  </script>
</div>
<!-- TradingView Widget END -->
<div style="background-color: #e8e6e6;">
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com" target="_blank" rel="noopener"><span class="blue-text">Cotizaciones</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js" async>
  {
  "symbols": [
    {
      "title": "S&P 500",
      "proName": "INDEX:SPX"
    },
    {
      "title": "Nasdaq 100",
      "proName": "INDEX:IUXX"
    },
    {
      "title": "BTC/USD",
      "proName": "BITFINEX:BTCUSD"
    },
    {
      "title": "ETH/USD",
      "proName": "BITFINEX:ETHUSD"
    },
    {
      "description": "",
      "proName": "CME:BTC1!"
    }
  ],
  "locale": "es"
}
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com" target="_blank" rel="noopener"><span class="blue-text">Datos del mercado</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
  {
  "showChart": true,
  "locale": "es",
  "largeChartUrl": "",
  "width": "100%",
  "height": "660",
  "plotLineColorGrowing": "rgba(60, 188, 152, 1)",
  "plotLineColorFalling": "rgba(255, 74, 104, 1)",
  "gridLineColor": "rgba(233, 233, 234, 1)",
  "scaleFontColor": "rgba(233, 233, 234, 1)",
  "belowLineFillColorGrowing": "rgba(60, 188, 152, 0.05)",
  "belowLineFillColorFalling": "rgba(255, 74, 104, 0.05)",
  "symbolActiveColor": "rgba(242, 250, 254, 1)",
  "tabs": [
    {
      "title": "Índices",
      "symbols": [
        {
          "s": "INDEX:SPX",
          "d": "S&P 500"
        },
        {
          "s": "INDEX:DOWI",
          "d": "Dow 30"
        },
        {
          "s": "INDEX:NKY",
          "d": "Nikkei 225"
        },
        {
          "s": "NASDAQ:AAPL",
          "d": "Apple"
        },
        {
          "s": "NASDAQ:GOOG",
          "d": "Google"
        }
      ],
      "originalTitle": "Indices"
    },
    {
      "title": "Materias primas",
      "symbols": [
        {
          "s": "COMEX:GC1!",
          "d": "Oro"
        },
        {
          "s": "NYMEX:CL1!",
          "d": "Petróleo"
        },
        {
          "s": "NYMEX:NG1!",
          "d": "Gas natural"
        },
        {
          "s": "CBOT:ZC1!",
          "d": "Maíz"
        },
        {
          "s": "MOEX:BR1!"
        }
      ],
      "originalTitle": "Commodities"
    },
    {
      "title": "Bonos",
      "symbols": [
        {
          "s": "CME:GE1!",
          "d": "Eurodólar"
        },
        {
          "s": "CBOT:ZB1!",
          "d": "T-Bond"
        },
        {
          "s": "CBOT:UD1!",
          "d": "Ultra T-Bond"
        },
        {
          "s": "EUREX:GG1!",
          "d": "Euro Bund"
        },
        {
          "s": "EUREX:II1!",
          "d": "Euro BTP"
        },
        {
          "s": "EUREX:HR1!",
          "d": "Euro BOBL"
        }
      ],
      "originalTitle": "Bonds"
    },
    {
      "title": "Forex",
      "symbols": [
        {
          "s": "FX:EURUSD"
        },
        {
          "s": "FX:GBPUSD"
        },
        {
          "s": "FX:USDJPY"
        },
        {
          "s": "FX:USDCHF"
        },
        {
          "s": "FX:AUDUSD"
        },
        {
          "s": "FX:USDCAD"
        }
      ],
      "originalTitle": "Forex"
    }
  ]
}
  </script>
</div>
<!-- TradingView Widget END -->
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container col-sm-6">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://es.tradingview.com/markets/stocks-usa/market-movers-gainers/" target="_blank" rel="noopener"><span class="blue-text">Mercado bursátil</span></a> por TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js" async>
  {
  "exchange": "US",
  "showChart": true,
  "locale": "es",
  "largeChartUrl": "",
  "width": "100%",
  "height": "660",
  "plotLineColorGrowing": "rgba(60, 188, 152, 1)",
  "plotLineColorFalling": "rgba(255, 74, 104, 1)",
  "gridLineColor": "rgba(242, 242, 242, 1)",
  "scaleFontColor": "rgba(218, 221, 224, 1)",
  "belowLineFillColorGrowing": "rgba(60, 188, 152, 0.05)",
  "belowLineFillColorFalling": "rgba(255, 74, 104, 0.05)",
  "symbolActiveColor": "rgba(242, 250, 254, 1)"
}
  </script>
</div>
<!-- TradingView Widget END -->
</div>`
    };
  };

  render() {
    return (
      <Document className="static-page">
        <div className="widget-box-container" dangerouslySetInnerHTML={this.createMarkup()} />
      </Document>
    );
  }
}

function mapStateToProps(state) {


  return {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {}, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Calendar );
