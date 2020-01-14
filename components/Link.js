import React, {Children, Component} from 'react';
import {withRouter} from 'next/router';
import {isEqual} from 'lodash';
import classNames from 'classnames';

import Link from 'next/link';

class CustomLink extends Component {

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
      <Link href={this.props.href} as={this.props.as}>
        <a className={classNames(this.props.className, {'active': href ? isEqual(href, router.pathname) : null})}
           style={this.props.style}>
          {this.props.children}
        </a>
      </Link>
    );
  }
}

export default withRouter(CustomLink)