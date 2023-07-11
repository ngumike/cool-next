/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import SimpleBar from 'simplebar-react';
import { Box, Skeleton, ListItemIcon, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

import { fetchMyUserLines, updateUserLine } from 'src/store/apps/user-line';

import PhoneNumberDialog from './PhoneNumberDialog';

export const PhoneNumberList = ({ hidden }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { myUserLines } = useSelector(state => state.userLine);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserLine, setSelectedUserLine] = useState(null);

  useEffect(() => {
    setLoading(true);

    //fetch all numbers / no pagination
    dispatch(fetchMyUserLines())
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleCopyPhoneNumber = phoneNumber => {
    navigator.clipboard.writeText(phoneNumber);
    enqueueSnackbar('Phone number copied!', { variant: 'success' });
  };

  const handleUserLineEditClick = (e, userLine) => {
    e.stopPropagation();

    setSelectedUserLine(userLine);
    setOpenDialog(true);
  };

  const handleDialogSubmit = async (payload, callback) => {
    await dispatch(updateUserLine(payload)).unwrap();
    callback();
  };

  const handleDialogCancel = () => {
    setSelectedUserLine(null);
    setOpenDialog(false);
  };

  const ScrollWrapper = hidden ? SimpleBar : Box;

  return (
    <Box sx={{ width: '100%' }}>
      <PhoneNumberDialog
        open={openDialog}
        userLine={selectedUserLine}
        onSubmit={handleDialogSubmit}
        onCancel={handleDialogCancel}
      />
      {loading ? (
        Array(6)
          .fill()
          .map((_, index) => (
            <Skeleton
              key={index}
              sx={{ bgcolor: 'background.paper', width: '100%', height: 49, my: 1 }}
              variant='rectangular'
            />
          ))
      ) : (
        <ScrollWrapper style={{ maxHeight: 300 }}>
          {myUserLines.map(userLine => (
            <ListItem key={userLine.id} component='div' disablePadding sx={{ backgroundColor: 'background.paper' }}>
              <ListItemButton onClick={() => handleCopyPhoneNumber(userLine.line.phoneNumber)}>
                <ListItemText primary={userLine.line.phoneNumber} secondary={userLine.label} />
                <ListItemIcon>
                  <IconButton onClick={e => handleUserLineEditClick(e, userLine)}>
                    <Edit />
                  </IconButton>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollWrapper>
      )}
    </Box>
  );
};
