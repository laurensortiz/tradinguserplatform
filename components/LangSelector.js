import React, { PureComponent } from 'react';
import { Select } from "antd";
import i18n from '../i18n';
import { withNamespaces } from 'react-i18next';

const { Option } = Select;

const langMenu = [
  {
    lang: 'en',
    icon: '/static/flags/united-states.svg'
  },
  {
    lang: 'es',
    icon: '/static/flags/spain.svg'
  },
  {
    lang: 'pt',
    icon: '/static/flags/portugal.svg'
  }
]

class LangSelector extends PureComponent {
  changeLanguage = (lng) => {
    i18n.changeLanguage( lng );
  }

  render() {
    const defaultLang = this.props.lng ? this.props.lng : langMenu[ 0 ].lang;

    return (
      <Select
        defaultValue={ defaultLang }
        onChange={ this.changeLanguage }
        className="lang-menu"
      >
        { langMenu.map( langOption => (
          <Option key={ langOption.lang }><img width={ 20 } height={ 20 } src={ langOption.icon }
                                               alt=""/></Option>
        ) ) }
      </Select>
    );
  }
}

export default withNamespaces()( LangSelector );
