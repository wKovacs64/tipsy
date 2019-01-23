import React from 'react';
import SEO from '../components/seo';
import Layout from '../components/layout';

const IndexPage: React.FunctionComponent = () => (
  <Layout>
    <SEO />
    <main>
      <h1 data-testid="test">Hello from Nip the Tip!</h1>
    </main>
  </Layout>
);

export default IndexPage;
