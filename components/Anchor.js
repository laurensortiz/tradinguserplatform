import React, {Children, Component} from 'react';
import {withRouter} from 'next/router';
import {isEqual} from 'lodash';
import classNames from 'classnames';

import Link from 'next/link';

class Anchor extends Component {

  render() {
    const {router, href} = this.props;

    if (this.props.onClick) {
      return (
        <span
          style={this.props.style}
          onClick={this.props.onClick}>
          {this.props.children}
        </span>
      );
    }

    return (
      <a href={this.props.href} className={classNames(this.props.className, {'active': href ? isEqual(href, router.pathname) : null})}
         style={this.props.style}>
        {this.props.children}
      </a>

    );
  }
}

export default withRouter(Anchor)