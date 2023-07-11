// ** React Imports
import { useCallback, useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings';
import { useDispatch, useSelector } from 'react-redux';

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials';
import { formatDateToMonthShort } from 'src/@core/utils/format';

// ** Chat App Components Imports
import SidebarLeft from 'src/@core/components/pages/message/SidebarLeft';
import ChatContent from 'src/@core/components/pages/message/ChatContent';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ** Actions Imports
import { fetchUserLineMessages } from 'src/store/apps/user-line';

// ** Styled Avatar component
const PhoneDropdown = styled(FormControl)(() => ({
  float: 'right',
  width: '200px'
}));

const ChatBox = styled(Box)(() => ({
  height: 'calc(100% - 50px)'
}));

const MessagesPage = () => {
  // ** States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false);
  const [currentSender, setCurrentSender] = useState();
  const [number, setNumber] = useState('');
  const [totalMessages, setTotalMessages] = useState([]);
  const [uniqueChatBySender, setUniqueChatBySender] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);

  // ** Store
  const { lineMessages } = useSelector(state => state.userLine);

  // ** Hooks
  const dispatch = useDispatch();
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('lg'));

  // ** Vars
  const { skin } = settings;
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'));
  const sidebarWidth = smAbove ? 370 : 300;
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'));

  const numberChange = useCallback(
    async number => {
      let messages = lineMessages.filter(item => item.phone_number === number)[0].messages;
      setTotalMessages(messages);
      const key = 'sender';
      const arrUniqueChatBySender = [...new Map(messages.map(item => [item[key], item])).values()];
      setUniqueChatBySender(arrUniqueChatBySender);
    },
    [lineMessages]
  );

  useEffect(() => {
    dispatch(fetchUserLineMessages());
  }, [dispatch]);

  useEffect(() => {
    if (lineMessages.length > 0) {
      setNumber(lineMessages[0].phone_number);
      numberChange(lineMessages[0].phone_number);
    }
  }, [lineMessages, numberChange]);

  useEffect(() => {
    if (!currentSender && uniqueChatBySender.length > 0) {
      setCurrentSender(uniqueChatBySender[0].sender);
    }
  }, [currentSender, uniqueChatBySender]);

  const handleChange = e => {
    numberChange(e.target.value);
    setNumber(e.target.value);
  };

  const selectCurrentChat = sender => {
    setCurrentSender(sender);
  };

  useEffect(() => {
    const currentMessages = totalMessages.filter(item => item.sender === currentSender);
    setCurrentMessages(currentMessages);
  }, [currentSender, totalMessages]);

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen);

  return (
    <Box>
      <PhoneDropdown sx={{ mb: 6 }}>
        <InputLabel id='select-phone-number'>Phone Number</InputLabel>
        <Select
          labelId='select-phone-number'
          id='phone_select'
          label='Phone Number'
          value={number}
          onChange={handleChange}
        >
          {lineMessages.map((item, index) => (
            <MenuItem key={index} value={item.phone_number}>
              {item.phone_number}
            </MenuItem>
          ))}
        </Select>
      </PhoneDropdown>
      <ChatBox
        className='app-chat'
        sx={{
          width: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <SidebarLeft
          sender={currentSender}
          chats={uniqueChatBySender}
          hidden={hidden}
          mdAbove={mdAbove}
          selectChat={selectCurrentChat}
          getInitials={getInitials}
          sidebarWidth={sidebarWidth}
          leftSidebarOpen={leftSidebarOpen}
          formatDateToMonthShort={formatDateToMonthShort}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
        />
        <ChatContent
          sender={currentSender}
          currentMessages={currentMessages}
          hidden={hidden}
          mdAbove={mdAbove}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
        />
      </ChatBox>
    </Box>
  );
};
MessagesPage.contentHeightFixed = true;
MessagesPage.acl = {
  action: 'read',
  subject: 'user-page'
};

export default MessagesPage;
