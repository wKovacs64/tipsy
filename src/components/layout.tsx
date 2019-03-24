import '@wkovacs64/normalize.css';
import React from 'react';
import { css, Global, ClassNames } from '@emotion/core';
import styled from '@emotion/styled';
import { IconContext } from 'react-icons';
import SEO from './seo';
import Header from './header';
import Main from './main';
import Footer from './footer';

const FullHeightContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout: React.FunctionComponent = ({ children }) => (
  <ClassNames>
    {({ css: classNameFromCss }) => (
      <IconContext.Provider
        value={{
          className: classNameFromCss`
            vertical-align: middle;
          `,
        }}
      >
        <Global
          styles={css`
            #gatsby-noscript {
              display: none;
            }
          `}
        />
        <SEO />
        <FullHeightContainer>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </FullHeightContainer>
      </IconContext.Provider>
    )}
  </ClassNames>
);

export default Layout;
