import styled from '@emotion/styled';
import Layout from '../components/layout';
import { scale } from '../theme';

const Centered = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const P = styled.p`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
`;

function NotFoundPage(): JSX.Element {
  return (
    <Layout>
      <Centered>
        <P>Nope.</P>
      </Centered>
    </Layout>
  );
}
export default NotFoundPage;
