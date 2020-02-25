import {Icon} from 'antd';
import React from "react";

const FONT_SIZE =  20;

const marketBehaviorStatus = status => {
  switch (status) {
    case 0:
      return <Icon type="stock" style={ {color: '#fdb310', fontSize: FONT_SIZE }} />
      break;
    case 1:
      return <Icon type="rise" style={ {color: '#87d068', fontSize: FONT_SIZE }} />
      break;
    case 2:
      return <Icon type="fall" style={ {color: '#f50', fontSize: FONT_SIZE }} />
      break;
    default:
      return <Icon type="rise" style={ {color: '#87d068', fontSize: FONT_SIZE }} />
  }
};

export default marketBehaviorStatus;