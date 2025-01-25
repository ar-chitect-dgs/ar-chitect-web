import styled from '@emotion/styled';
import { Switch as MuiSwitch, alpha } from '@mui/material';

export const Switch = styled(MuiSwitch)(() => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#7489FF',
    '&:hover': {
      backgroundColor: alpha('#7489FF', 0.3),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#7489FF',
  },
}));
