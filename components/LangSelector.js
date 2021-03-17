import React, { useState, useEffect } from 'react';
import { Select } from "antd";
import i18n from '../i18n';
import { withNamespaces } from 'react-i18next';

const { Option } = Select;

const langMenu = [
  {
    lang: 'en-US',
    icon: '/static/flags/united-states.svg'
  },
  {
    lang: 'es-US',
    icon: '/static/flags/spain.svg'
  },
  {
    lang: 'pt-PT',
    icon: '/static/flags/portugal.svg'
  }
]

function LangSelector ({lng}) {
  const [defaultLang, setDefaultLang] = useState('es-US')
  const currentLang = lng === 'es' ? 'es-US' : lng

  const changeLanguage = (lng) => {
    i18n.changeLanguage( lng );
  }

  useEffect(() => {

    if (defaultLang !== currentLang) {
      setDefaultLang(currentLang)
    }

  }, [currentLang])

  return (
    <Select
      value={ defaultLang }
      onChange={ changeLanguage }
      className="lang-menu"
    >

      { langMenu.map( langOption => (
        <Option key={ langOption.lang }><img width={ 20 } height={ 20 } src={ langOption.icon }
                                             alt=""/></Option>
      ) ) }
    </Select>
  );

}

export default withNamespaces()( LangSelector );
