// ** React Imports
import { useState, useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** MUI Imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Custom Components Import
import CustomAvatar from 'src/@core/components/mui/avatar';
import { chatStatusObj } from 'src/configs/constants';

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflow: 'auto' }}>{children}</Box>;
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>;
  }
};

const SidebarLeft = props => {
  // ** Props
  const {
    sender,
    chats,
    hidden,
    mdAbove,
    selectChat,
    getInitials,
    sidebarWidth,
    leftSidebarOpen,
    formatDateToMonthShort,
    handleLeftSidebarToggle
  } = props;

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filteredChat, setFilteredChat] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    setActive({ type: 'chat', sender });
  }, [sender]);

  const handleChatClick = (type, sender) => {
    selectChat(sender);
    setActive({ type, sender });
    if (!mdAbove) {
      handleLeftSidebarToggle();
    }
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setActive(null);
    });

    return () => {
      setActive(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderChats = () => {
    if (query.length && !filteredChat.length) {
      return (
        <ListItem>
          <Typography sx={{ color: 'text.secondary' }}>No Chats Found</Typography>
        </ListItem>
      );
    } else {
      const arrToMap = query.length && filteredChat.length ? filteredChat : chats;

      return arrToMap.map((chat, index) => {
        const { message } = chat;

        const activeCondition = active !== null && active.sender === chat.sender && active.type === 'chat';

        return (
          <ListItem key={index} disablePadding sx={{ '&:not(:last-child)': { mb: 1.5 } }}>
            <ListItemButton
              disableRipple
              onClick={() => handleChatClick('chat', chat.sender)}
              sx={{
                px: 3,
                py: 2.5,
                width: '100%',
                borderRadius: 1,
                alignItems: 'flex-start',
                ...(activeCondition && {
                  backgroundImage: theme =>
                    `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
                })
              }}
            >
              <ListItemAvatar sx={{ m: 0 }}>
                <Badge
                  overlap='circular'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent={
                    <Box
                      component='span'
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        color: `${chatStatusObj.busy}.main`,
                        backgroundColor: `${chatStatusObj.busy}.main`,
                        boxShadow: theme =>
                          `0 0 0 2px ${!activeCondition ? theme.palette.background.paper : theme.palette.common.white}`
                      }}
                    />
                  }
                >
                  <CustomAvatar
                    color='primary'
                    skin={activeCondition ? 'light-static' : 'light'}
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: '1rem',
                      ...(activeCondition && { border: theme => `2px solid ${theme.palette.common.white}` })
                    }}
                  >
                    {chat && getInitials(chat.sender)}
                  </CustomAvatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  my: 0,
                  ml: 4,
                  mr: 1.5,
                  '& .MuiTypography-root': { ...(activeCondition && { color: 'common.white' }) }
                }}
                primary={
                  <Typography noWrap sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {chat.sender}
                  </Typography>
                }
                secondary={
                  <Typography noWrap variant='body2' sx={{ ...(!activeCondition && { color: 'text.disabled' }) }}>
                    {message ? message.message : null}
                  </Typography>
                }
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}
              >
                <Typography
                  variant='body2'
                  sx={{ whiteSpace: 'nowrap', color: activeCondition ? 'common.white' : 'text.disabled' }}
                >
                  <>{message ? formatDateToMonthShort('2023-02-14T11:30:05.377Z', true) : new Date()}</>
                </Typography>
                {chat.is_read ? (
                  <Chip
                    color='error'
                    label={chat.is_read}
                    sx={{
                      mt: 0.5,
                      height: 18,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '& .MuiChip-label': { pt: 0.25, px: 1.655 }
                    }}
                  />
                ) : null}
              </Box>
            </ListItemButton>
          </ListItem>
        );
      });
    }
  };

  const handleFilter = e => {
    setQuery(e.target.value);
    if (chats !== null) {
      const searchFilterFunction = chat => chat.sender.toLowerCase().includes(e.target.value.toLowerCase());
      const filteredChatsArr = chats.filter(searchFilterFunction);
      setFilteredChat(filteredChatsArr);
    }
  };

  return (
    <div>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleLeftSidebarToggle}
        variant={mdAbove ? 'permanent' : 'temporary'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: mdAbove ? 'static' : 'absolute',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: sidebarWidth,
            position: mdAbove ? 'static' : 'absolute',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
        <Box
          sx={{
            px: 5,
            py: 3.125,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <TextField
            fullWidth
            size='small'
            value={query}
            onChange={handleFilter}
            placeholder='Search senders...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 5 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon icon='mdi:magnify' fontSize={20} />
                </InputAdornment>
              )
            }}
          />
          {!mdAbove ? (
            <IconButton sx={{ p: 1, ml: 1 }} onClick={handleLeftSidebarToggle}>
              <Icon icon='mdi:close' fontSize='1.375rem' />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <ScrollWrapper hidden={hidden}>
            <Box sx={{ p: theme => theme.spacing(7, 3, 3) }}>
              <List sx={{ mb: 4, p: 0 }}>{renderChats()}</List>
            </Box>
          </ScrollWrapper>
        </Box>
      </Drawer>
    </div>
  );
};

export default SidebarLeft;
