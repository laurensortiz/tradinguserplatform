import _ from 'lodash';

const assetClassColor = asset => {
  const className = _.toLower(asset);

  const detailStatus = {
    'fx': {
      name: 'green',
    },
    'fxo': {
      name: 'green',
    },
    'cfd': {
      name: 'red',
    },
    'eq': {
      name: 'yellow',
    },
    'eqo': {
      name: 'yellow',
    },
    'eqf': {
      name: 'yellow',
    },
    'etf': {
      name: 'yellow',
    },
    'etc': {
      name: 'yellow',
    },
    'fu': {
      name: 'purple',
    },
    'co': {
      name: 'purple',
    },
    'bo': {
      name: 'blue',
    },
  };
  return detailStatus[className] || 'green'
};

export default assetClassColor;