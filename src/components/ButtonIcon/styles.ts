import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  height: 56px;
  width: 56px;
  border-radius: 6px;
  
  align-items: center;
  justify-content: center;
  background: ${({theme}) => theme.COLORS.GRAY_600};
`

export const Title = styled.Text`
  color: ${({theme}) => theme.COLORS.WHITE};
  font-size: ${({theme}) => theme.FONT_SIZE.MD}px;
  font-family: ${({theme}) => theme.FONT_FAMILY.BOLD};
`

export const Loading = styled.ActivityIndicator
    .attrs(({theme}) => ({
        color: theme.COLORS.WHITE
    }))``;
