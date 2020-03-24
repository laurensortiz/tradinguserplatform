import {Icon} from 'antd';
import React from "react";

const FONT_SIZE =  20;

const marketBehaviorStatus = status => {
  switch (status) {
    case 0:
      return <Icon className="stock" type="stock" style={ {fontSize: FONT_SIZE }} />;
      break;
    case 1:
      return <Icon className="positive" type="rise" style={ {fontSize: FONT_SIZE }} />;
      break;
    case 2:
      return <Icon className="negative" type="fall" style={ {fontSize: FONT_SIZE }} />;
      break;
    default:
      return <Icon className="positive" type="rise" style={ {fontSize: FONT_SIZE }} />
  }
};

export default marketBehaviorStatus;