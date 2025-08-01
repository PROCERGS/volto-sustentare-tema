/**
 * Custom Search component override for Volto.
 * @module customizations/@plone/volto/components/theme/Search/Search
 */

import React, { useState, useEffect } from 'react';
import CustomDateModal from './CustomDateModal';
import CustomSelect from './CustomSelect';
import useDateRangeFilter from '../../../../hooks/useDateRangeFilter';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { UniversalLink } from '@plone/volto/components';
import { asyncConnect } from '@plone/volto/helpers';
import { FormattedMessage } from 'react-intl';
import { createPortal } from 'react-dom';
import { Container, Pagination } from 'semantic-ui-react';
import qs from 'query-string';
import { defineMessages, injectIntl } from 'react-intl';
import config from '@plone/volto/registry';
import { Helmet } from '@plone/volto/helpers';
import { searchContent } from '@plone/volto/actions';
import { Toolbar, Icon } from '@plone/volto/components';
import imagemPadrao from '../../../../../public/matriz3.svg';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';
import './Search.css';

const messages = defineMessages({
  Search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

function Search({
  items,
  history,
  location,
  searchContent,
  intl,
  pathname,
  searchableText,
}) {
  const defaultPageSize = config.settings.defaultPageSize;
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState({
    active: 'relevance',
    dateFilter: 'all',
    customFrom: '',
    customTo: '',
  });
  const [pendingActive, setPendingActive] = useState('relevance');
  const [pendingDateFilter, setPendingDateFilter] = useState('all');
  const [pendingFrom, setPendingFrom] = useState('');
  const [pendingTo, setPendingTo] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const options = qs.parse(history.location.search);
    setCurrentPage(1);
    options['use_site_search_settings'] = 1;
    searchContent('', {
      b_size: 1000,
      ...options,
    });
    setIsClient(true);
  }, [history.location.search, searchContent]);

  const filteredByDate = useDateRangeFilter(
    items,
    appliedFilters.dateFilter === 'custom' ? appliedFilters.customFrom : '',
    appliedFilters.dateFilter === 'custom' ? appliedFilters.customTo : '',
    (item) => item.effective,
  );
  const filteredItems =
    appliedFilters.dateFilter === 'custom' ? filteredByDate : items;

  function applyFilters() {
    setAppliedFilters((prev) => ({
      ...prev,
      active: pendingActive,
      dateFilter: pendingDateFilter,
      customFrom: pendingDateFilter === 'custom' ? pendingFrom : '',
      customTo: pendingDateFilter === 'custom' ? pendingTo : '',
    }));
    setShowCustomModal(false);
    setCurrentPage(1);
    let options = qs.parse(history.location.search);
    if (pendingActive === 'relevance') {
      options.sort_on = 'relevance';
      options.sort_order = 'ascending';
    } else if (pendingActive === 'sortable_title') {
      options.sort_on = 'sortable_title';
      options.sort_order = 'ascending';
    } else if (pendingActive === 'effective') {
      options.sort_on = 'effective';
      options.sort_order = 'descending';
    }
    delete options.effective_year;
    options.b_size = 1000;
    let searchParams = qs.stringify(options);
    history.replace({ search: searchParams });
  }

  const options = qs.parse(history.location.search);

  const pageSize = defaultPageSize;
  const total = filteredItems.length;
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(currentPage * pageSize, total);
  const paginatedItems = filteredItems.slice(start, end);

  return (
    <Container id="page-search">
      <Helmet title={intl.formatMessage(messages.Search)} />
      <div className="container">
        <article id="content">
          <header>
            <h1 className="documentFirstHeading">
              <FormattedMessage
                id="Search results"
                defaultMessage="Search results"
              />
            </h1>
            {searchableText && (
              <>
                <div className="search-term-info">
                  A busca pelo termo{' '}
                  <span className="search-term">“{searchableText}”</span>{' '}
                  encontrou {filteredItems.length} resultados.
                </div>
                {filteredItems.length > 0 && (
                  <div className="search-term-info-paging">
                    {(() => {
                      const total = filteredItems.length;
                      const pageSize = options.b_size
                        ? parseInt(options.b_size)
                        : defaultPageSize;
                      const start = (currentPage - 1) * pageSize + 1;
                      const end = Math.min(currentPage * pageSize, total);
                      return `Exibindo: ${start} - ${end} de ${total} resultados`;
                    })()}
                  </div>
                )}
              </>
            )}
            <div className="search-filters">
              <select
                id="sort-select"
                value={pendingActive}
                onChange={(e) => setPendingActive(e.target.value)}
                className="sort-select"
              >
                <option value="relevance">
                  <FormattedMessage
                    id="Relevance"
                    defaultMessage="MAIS RECENTES"
                  />
                </option>
                <option value="sortable_title">
                  <FormattedMessage
                    id="Alphabetically"
                    defaultMessage="ALFABETICAMENTE"
                  />
                </option>
                <option value="effective">
                  <FormattedMessage
                    id="Date (newest first)"
                    defaultMessage="MAIS RECENTES"
                  />
                </option>
              </select>
              <CustomSelect
                value={pendingDateFilter}
                onChange={(val) => {
                  setPendingDateFilter(val);
                  if (val !== 'custom') {
                    setPendingFrom('');
                    setPendingTo('');
                  }
                  if (val === 'custom') {
                    setShowCustomModal(true);
                  }
                }}
              />
              <CustomDateModal
                open={showCustomModal}
                from={pendingFrom}
                to={pendingTo}
                setFrom={setPendingFrom}
                setTo={setPendingTo}
                onClose={() => setShowCustomModal(false)}
                onApply={applyFilters}
              />
              <button className="sort-select filter-btn" onClick={applyFilters}>
                FILTRAR
              </button>
            </div>
            {filteredItems.length === 0 && (
              <div>
                <FormattedMessage
                  id="No results found"
                  defaultMessage="No results found"
                />
              </div>
            )}
          </header>
          <section id="content-core">
            {paginatedItems.map((item, idx) => (
              <article className="tileItem" key={item['@id']}>
                <UniversalLink
                  item={item}
                  className={
                    'tileItem-content' +
                    (idx === paginatedItems.length - 1
                      ? ' tileItem-content--last'
                      : '')
                  }
                  title={item.title}
                >
                  {item.image_field &&
                  item.image_field !== '' &&
                  item.image_scales &&
                  item.image_scales.image &&
                  item.image_scales.image.length > 0 ? (
                    <div className="tileImageWrapper">
                      <img
                        src={
                          item.image_scales.image[0].download.startsWith('http')
                            ? item.image_scales.image[0].download
                            : `${item['@id']}/${item.image_scales.image[0].download}`
                        }
                        alt={item.title}
                        className="tileImage"
                        loading="lazy"
                        fieldName={item.image_field}
                        size="image"
                      />
                    </div>
                  ) : (
                    <div className="tileImageWrapper">
                      <img
                        src={imagemPadrao}
                        alt="Imagem padrão"
                        className="tileImage"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="tileTextContent">
                    {item.effective && (
                      <div className="tileDateTime">
                        {(() => {
                          const date = new Date(item.effective);
                          const dia = String(date.getDate()).padStart(2, '0');
                          const mes = String(date.getMonth() + 1).padStart(
                            2,
                            '0',
                          );
                          const ano = date.getFullYear();
                          const hora = String(date.getHours()).padStart(2, '0');
                          const min = String(date.getMinutes()).padStart(
                            2,
                            '0',
                          );
                          return `${dia}/${mes}/${ano} - ${hora}h${min}min`;
                        })()}
                      </div>
                    )}
                    <h2 className="tileHeadline">{item.title}</h2>
                    {item.description && (
                      <div className="tileBody">
                        <span className="description">{item.description}</span>
                      </div>
                    )}
                  </div>
                </UniversalLink>
                <div className="visualClear" />
              </article>
            ))}
            {filteredItems.length > pageSize && (
              <div className="search-footer">
                <Pagination
                  activePage={currentPage}
                  totalPages={Math.ceil(filteredItems.length / pageSize)}
                  onPageChange={(e, { activePage }) =>
                    setCurrentPage(activePage)
                  }
                  firstItem={null}
                  lastItem={null}
                  prevItem={{
                    content: <Icon name={paginationLeftSVG} size="18px" />,
                    icon: true,
                    className: currentPage === 1 ? 'disabled' : null,
                  }}
                  nextItem={{
                    content: <Icon name={paginationRightSVG} size="18px" />,
                    icon: true,
                    className:
                      currentPage === Math.ceil(filteredItems.length / pageSize)
                        ? 'disabled'
                        : null,
                  }}
                />
              </div>
            )}
          </section>
        </article>
      </div>
      {isClient &&
        createPortal(
          <Toolbar
            pathname={pathname}
            hideDefaultViewButtons
            inner={<span />}
          />,
          document.getElementById('toolbar'),
        )}
    </Container>
  );
}

Search.propTypes = {
  searchContent: PropTypes.func.isRequired,
  searchableText: PropTypes.string,
  subject: PropTypes.string,
  path: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      '@id': PropTypes.string,
      '@type': PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  pathname: PropTypes.string.isRequired,
};

Search.defaultProps = {
  items: [],
  searchableText: null,
  subject: null,
  path: null,
};

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      items: state.search.items,
      searchableText: qs.parse(props.history.location.search).SearchableText,
      pathname: props.location.pathname,
    }),
    { searchContent },
  ),
  asyncConnect([
    {
      key: 'search',
      promise: ({ location, store: { dispatch } }) =>
        dispatch(
          searchContent('', {
            ...qs.parse(location.search),
            use_site_search_settings: 1,
          }),
        ),
    },
  ]),
)(Search);
