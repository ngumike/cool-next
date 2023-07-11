// ** MUI Imports
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Components Import
import ChatLog from './ChatLog';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { getInitials } from 'src/@core/utils/get-initials';

const ChatContent = props => {
  // ** Props
  const { sender, currentMessages, hidden, mdAbove, handleLeftSidebarToggle, handleUserProfileRightSidebarToggle } =
    props;

  const renderContent = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          backgroundColor: 'action.hover'
        }}
      >
        <Box
          sx={{
            py: 3,
            px: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {mdAbove ? null : (
              <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2 }}>
                <Icon icon='mdi:menu' />
              </IconButton>
            )}
            <Box
              onClick={handleUserProfileRightSidebarToggle}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Badge
                overlap='circular'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                sx={{ mr: 3 }}
                badgeContent={
                  <Box
                    component='span'
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      color: 'red',
                      boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`,
                      backgroundColor: 'red'
                    }}
                  />
                }
              >
                <CustomAvatar
                  skin='light'
                  color='primary'
                  sx={{ width: '2.375rem', height: '2.375rem', fontSize: '1rem' }}
                >
                  {sender && getInitials(sender)}
                </CustomAvatar>
              </Badge>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{sender}</Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}></Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <ChatLog hidden={hidden} data={currentMessages} />
      </Box>
    );
  };

  return renderContent();
};

export default ChatContent;
