import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {Row, Col}  from 'antd';

import Document from '../components/Document';



class Calendar extends Component {
  createMarkup = () => {
    return {__html:
        `<h3 style="text-align: center; color:#000">Calendario económico muestra los próximos eventos económicos, anuncios y noticias.</h3>
&nbsp;

<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
<div class="tradingview-widget-container__widget"></div>
<div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/currencies/economic-calendar/" target="_blank" rel="noopener"><span class="blue-text">Economic Calendar</span></a> by TradingView</div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-events.js" async>
  {
  "width": "100%",
  "height": "900",
  "locale": "en",
  "importanceFilter": "-1,0,1"
}
  </script>

</div>
<!-- TradingView Widget END -->`
    };
  }

  componentDidMount() {
    this.forceUpdate()
  }

  render() {
    return (
      <Document className="static-page">
        <div dangerouslySetInnerHTML={this.createMarkup()} />
      </Document>
    );
  }
}

function mapStateToProps(state) {


  return {
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators( {

  }, dispatch );


export default connect( mapStateToProps, mapDispatchToProps )( Calendar );
