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

function SEO(): JSX.Element {
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
}

export default SEO;
