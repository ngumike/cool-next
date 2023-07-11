// ** React Imports
import { useRef, useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials';

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  padding: theme.spacing(5)
}));

const ChatLog = props => {
  // ** Props
  const { data, hidden } = props;

  // ** Ref
  const chatArea = useRef(null);

  // ** Renders user chat
  const renderChats = () => {
    return data.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <div>
            <CustomAvatar
              skin='light'
              color='primary'
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
                ml: undefined,
                mr: 3.5
              }}
            >
              {data.sender}
            </CustomAvatar>
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
            <Box sx={{ '&:not(:last-of-type)': { mb: 3.5 } }}>
              <div>
                <Typography
                  sx={{
                    boxShadow: 1,
                    borderRadius: 1,
                    width: 'fit-content',
                    fontSize: '0.875rem',
                    p: theme => theme.spacing(3, 4),
                    ml: undefined,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: undefined,
                    color: 'text.primary',
                    backgroundColor: 'background.paper',
                    color: item.isVisible ? '' : 'transparent',
                    textShadow: item.isVisible ? '' : '0 0 5px rgba(0,0,0,0.5)',
                    userSelect: item.isVisible ? 'auto' : 'none'
                  }}
                >
                  {item.message}
                </Typography>
              </div>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <Typography variant='caption'>
                  {item.received_at
                    ? new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                    : null}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    });
  };

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      );
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      );
    }
  };

  return (
    <Box sx={{ height: 'calc(100% - 8.4375rem)' }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  );
};

export default ChatLog;
