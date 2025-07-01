import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import zoomSVG from '@plone/volto/icons/zoom.svg';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import './SearchWidget.css';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search Site',
  },
});

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
class SearchWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      text: '',
      active: false,
    };
  }

  /**
   * On change text
   * @method onChangeText
   * @param {object} event Event object.
   * @param {string} value Text value.
   * @returns {undefined}
   */
  onChangeText(event) {
    this.setState({
      text: event.target.value,
    });
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    const path =
      this.props.pathname?.length > 0
        ? `&path=${encodeURIComponent(this.props.pathname)}`
        : '';
    this.props.history.push(
      `/search?SearchableText=${encodeURIComponent(this.state.text)}${path}`,
    );
    event.preventDefault();
    this.setState({ active: false });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.active && this.state.active) {
      this.refInput.select();
    }
  }

  handleClickOutside = (e) => {
    if (
      this.searchbar.current &&
      doesNodeContainClick(this.searchbar.current, e)
    )
      return;
    this.setState({ active: false });
  };

  handleEscapeKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.setState({ active: false });
    }
  };

  searchbar = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <form action="/search" onSubmit={this.onSubmit}>
        <div className="s-wrapper">
          <input
            id="buscageralTextBox"
            className="s-input"
            aria-label={this.props.intl.formatMessage(messages.search)}
            onChange={(e) => this.onChangeText(e)}
            onKeyDown={(e) => this.handleEscapeKeyDown(e)}
            name="SearchableText"
            value={this.state.text}
            autoComplete="off"
            placeholder={this.props.intl.formatMessage(messages.search)}
            title={this.props.intl.formatMessage(messages.search)}
            tabIndex={this.state.active ? '0' : '-1'} 
            ref={(input) => {
              this.refInput = input;
            }}
          />
          <button
            id="s-logo"
            aria-label={this.props.intl.formatMessage(messages.search)}
            tabIndex={this.state.active ? '0' : '-1'}
          >
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.66699 0.855957C12.2169 0.856032 14.3952 1.74621 16.1709 3.52002C17.9467 5.2941 18.8358 7.47191 18.833 10.0229L18.8252 10.4067C18.7892 11.2982 18.6272 12.1498 18.3369 12.9585C18.0624 13.723 17.7022 14.4173 17.2588 15.0415L25.3535 23.1353L25.707 23.4897L23.1338 26.063L22.7793 25.7095L14.6855 17.6147C14.0613 18.0582 13.3671 18.4184 12.6025 18.6929C11.6785 19.0246 10.6986 19.1889 9.66699 19.189C7.11542 19.189 4.93727 18.2998 3.16406 16.5259C1.39097 14.7518 0.500969 12.5737 0.5 10.0229C0.499063 7.47191 1.38906 5.29412 3.16406 3.52002C4.93897 1.74605 7.11689 0.855957 9.66699 0.855957ZM9.66602 4.52295C8.12906 4.52134 6.84077 5.0531 5.77148 6.12646C4.70132 7.2008 4.16956 8.48998 4.16699 10.0229C4.16454 11.5548 4.69554 12.8443 5.77051 13.9194C6.84569 14.9946 8.13509 15.5262 9.66602 15.5229H9.66699C11.2024 15.5229 12.4913 14.9907 13.5635 13.9194C14.6355 12.8482 15.1678 11.5593 15.167 10.0229C15.1662 8.48615 14.6339 7.19686 13.5635 6.12646C12.4931 5.05629 11.2037 4.52459 9.66602 4.52295Z" fill="#F0EAD7" stroke="#F0EAD7" />
                        </svg>
          </button>
        </div>
      </form>
    );
  }
}

export default compose(withRouter, injectIntl)(SearchWidget);
