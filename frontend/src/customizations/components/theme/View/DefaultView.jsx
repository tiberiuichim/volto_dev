/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { defineMessages, injectIntl } from 'react-intl';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';

import { settings, tiles } from '~/config';

import {
  getTilesFieldname,
  getTilesLayoutFieldname,
  hasTilesData,
} from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const DefaultView = ({ content, intl }) => {
  const tilesFieldname = getTilesFieldname(content);
  const tilesLayoutFieldname = getTilesLayoutFieldname(content);

  return hasTilesData(content) ? (
    <div id="page-document" className="ui container">
      {/* <Helmet title={content.title} /> */}
      {map(content[tilesLayoutFieldname].items, tile => {
        const Tile =
          tiles.tilesConfig[(content[tilesFieldname]?.[tile]?.['@type'])]?.[
            'view'
          ] || null;
          console.log('alalala',content[tilesFieldname][tile]['@type'])
        return Tile !== null && (content[tilesFieldname][tile]['@type'] != 'title') ? (
          <Tile
            key={tile}
            id={tile}
            properties={content}
            data={content[tilesFieldname][tile]}
          />
        ) : (
        //   <div key={tile}>
        //     {intl.formatMessage(messages.unknownBlock, {
        //       block: content[tilesFieldname]?.[tile]?.['@type'],
        //     })}
        //   </div>
        ''
        );
      })}
    </div>
  ) : (
    <Container id="page-document">
      {/* <Helmet title={content.title} />
      <h1 className="documentFirstHeading">{content.title}</h1>
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )} */}
      {content.image && (
        <Image
          className="document-image"
          src={content.image.scales.thumb.download}
          floated="right"
        />
      )}
      {content.remoteUrl && (
        <span>
          The link address is:
          <a href={content.remoteUrl}>{content.remoteUrl}</a>
        </span>
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{
            __html: content.text.data.replace(
              /a href="([^"]*\.[^"]*)"/g,
              `a href="${settings.apiPath}$1/download/file"`,
            ),
          }}
        />
      )}
    </Container>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DefaultView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl(DefaultView);