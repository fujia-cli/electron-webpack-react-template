import styled from 'styled-components';

export const CRow = styled.div<{
  gap?: string | number;
  between?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.between && 'justify-content'};
  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) => (typeof props.gap === 'number' ? props.gap + 'rem' : props.gap ? props.gap : '1.6rem')};
  }
`;
