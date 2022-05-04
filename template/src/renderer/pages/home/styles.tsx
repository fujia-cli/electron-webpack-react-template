import styled from 'styled-components';

import logoUrl from '@assets/images/logo.svg';

export const Logo = styled.div`
  width: 84px;
  height: 48px;
  background-image: url(${logoUrl});
  background-size: cover;
  cursor: pointer;
`;

export const UserOperate = styled.div`
  color: #ddd;

  .login,
  .register {
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }

  .separator {
    padding: 0 6px;
  }
`;
