import styled, {css} from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export type ButtonTypeProps = 'PRIMARY' | 'SUGUNDARY';

type Props = {
  type: ButtonTypeProps;
}

export const Container = styled(TouchableOpacity)<Props>`
  flex: 1;

  max-height: 56px;
  min-height: 56px;

  align-items: center;
  justify-content: center;
  background-color: ${({theme, type}) => type === 'PRIMARY' ? theme.COLORS.GREEN_700 : theme.COLORS.RED};
  border-radius: 6px;
`

export const Title = styled.Text`
  ${({theme}) => css`
  font-family: ${theme.FONT_FAMILY.BOLD};
  font-size: ${theme.FONT_SIZE.MD}px;
  color: ${theme.COLORS.WHITE};
  ` }
`;