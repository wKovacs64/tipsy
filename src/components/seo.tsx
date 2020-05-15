import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const siteInfo = graphql`
  {
    site {
      siteMetadata {
        title
        description
        buildInfo {
          commit
          version
        }
      }
    }
  }
`;

const SEO: React.FunctionComponent = () => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(siteInfo);

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en',
        'data-commit': siteMetadata.buildInfo.commit,
        'data-version': siteMetadata.buildInfo.version,
      }}
      title={siteMetadata.title}
      meta={[
        {
          name: 'description',
          content: siteMetadata.description,
        },
        {
          property: 'og:title',
          content: siteMetadata.title,
        },
        {
          property: 'og:description',
          content: siteMetadata.description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: siteMetadata.title,
        },
        {
          name: 'twitter:description',
          content: siteMetadata.description,
        },
      ]}
    />
  );
};

export default SEO;
