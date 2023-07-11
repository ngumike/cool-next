/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

// ** MUI Imports
import { Box, Card, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MarkChatRead, MarkChatUnread } from '@mui/icons-material';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux';

// ** Actions Imports
import { updateMessage, fetchMessages } from 'src/store/apps/message';

// ** Custom Table Components Imports
import TableHeader from 'src/@core/components/pages/message/TableHeader';

import { USERS_ROWS_PER_PAGE } from 'src/configs/constants';

const MessagesPage = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // ** Store
  const { messages, total } = useSelector(state => state.message);

  // ** State
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(USERS_ROWS_PER_PAGE[0]);

  useEffect(() => {
    handleRefresh();
  }, [page, pageSize]);

  const handleFilterChange = useCallback(val => {
    setFilter(val);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    dispatch(fetchMessages({ page: page === 0 ? 1 : page + 1, limit: pageSize }))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleMarkMessage = async (id, isRead) => {
    const payload = { id, isRead };
    await dispatch(updateMessage({ ...payload })).unwrap();
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
  };

  const handleCopyPhoneNumber = phoneNumber => {
    navigator.clipboard.writeText(phoneNumber);
    enqueueSnackbar('Phone number copied!', { variant: 'success' });
  };

  const handleCopyMessage = message => {
    navigator.clipboard.writeText(message);
    enqueueSnackbar('Message copied!', { variant: 'success' });
  };

  const columns = [
    {
      flex: 0.2,
      field: 'receiver',
      headerName: 'Receiver',
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            variant='body2'
            sx={{ width: '100%', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => handleCopyPhoneNumber(row.receiver)}
          >
            {row.receiver}
          </Typography>
        );
      }
    },
    {
      flex: 0.7,
      minWidth: 150,
      field: 'message',
      headerName: 'Message',
      renderCell: ({ row }) => {
        if (row.isVisible)
          return (
            <Tooltip title={row.message} sx={{ whiteSpace: 'nowrap' }}>
              <Typography
                variant='body2'
                sx={{ width: '100%', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleCopyMessage(row.message)}
              >
                {row.message}
              </Typography>
            </Tooltip>
          );
        else
          return (
            <Typography
              noWrap
              variant='body2'
              sx={{ color: 'transparent', textShadow: '0 0 5px rgba(0,0,0,0.5)', userSelect: 'none' }}
            >
              {row.message}
            </Typography>
          );
      }
    },
    {
      flex: 0.1,
      minWidth: 90,
      sortable: false,
      disableColumnMenu: true,
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <>
          {row.isRead ? (
            <IconButton size='small' onClick={() => handleMarkMessage(row.id, false)}>
              <Tooltip title='Mark as unread'>
                <MarkChatRead color='success' />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton size='small' onClick={() => handleMarkMessage(row.id, true)}>
              <Tooltip title='Mark as read'>
                <MarkChatUnread color='error' />
              </Tooltip>
            </IconButton>
          )}
        </>
      )
    }
  ];

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader filter={filter} onFilterChange={handleFilterChange} onRefresh={handleRefresh} />
            <DataGrid
              loading={loading}
              getRowHeight={() => 'auto'}
              autoHeight
              pagination
              paginationMode='server'
              rows={messages}
              columns={columns}
              page={page}
              pageSize={pageSize}
              rowCount={total}
              disableSelectionOnClick
              rowsPerPageOptions={USERS_ROWS_PER_PAGE}
              onPageChange={newPage => handlePageChange(newPage)}
              onPageSizeChange={newPageSize => handlePageSizeChange(newPageSize)}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

MessagesPage.acl = {
  action: 'read',
  subject: 'user-page'
};

export default MessagesPage;
