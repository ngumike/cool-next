/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, useCallback } from 'react';

// ** MUI Imports
import { Box, Card, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';

// ** Actions Imports
import { createMessage, updateMessage, fetchMessages, deleteMessage } from 'src/store/apps/message';

// ** Custom Table Components Imports
import TableHeader from 'src/@core/components/pages/admin/messages/TableHeader';
import MessageSideBar from 'src/@core/components/pages/admin/messages/MessageSideBar';

import AlertDialog from 'src/@core/components/dialog/AlertDialog';

import { USERS_ROWS_PER_PAGE } from 'src/configs/constants';

const MessagesPage = () => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** Store
  const { messages, total } = useSelector(state => state.message);

  // ** State
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(USERS_ROWS_PER_PAGE[0]);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});

  useEffect(() => {
    handleRefresh();
  }, [page, pageSize]);

  const handleFilterChange = useCallback(val => {
    setFilter(val);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    dispatch(fetchMessages({ level: 11, page: page === 0 ? 1 : page + 1, limit: pageSize }))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleEditClick = message => {
    setCurrentMessage(message);
    setSideBarOpen(true);
  };

  const handleDeleteClick = message => {
    setCurrentMessage(message);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async callback => {
    await dispatch(deleteMessage(currentMessage.id)).unwrap();
    callback();
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const handleSideBarCancel = () => {
    setCurrentMessage({});
    setSideBarOpen(false);
  };

  const handleSideBarSubmit = async (payload, callback) => {
    const actionFunc = payload.id ? updateMessage : createMessage;
    const res = await dispatch(actionFunc({ ...payload, level: 11 })).unwrap();
    callback(res);
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  const handlePageSizeChange = newPageSize => {
    setPageSize(newPageSize);
  };

  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'sender',
      headerName: 'Sender',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.sender}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'receiver',
      headerName: 'Receiver',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.receiver}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'port',
      headerName: 'Port',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.port}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'message',
      headerName: 'Message',
      renderCell: ({ row }) => (
        <Typography noWrap variant='body2'>
          {row.message}
        </Typography>
      )
    },

    {
      flex: 0.1,
      minWidth: 220,
      field: 'createdAt',
      headerName: 'Received At',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={new Date(row.createdAt).toLocaleString('en-US')}
            sx={{ textTransform: 'capitalize' }}
          />
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
          <IconButton size='small' onClick={() => handleEditClick(row)}>
            <Icon icon='mdi:pencil' />
          </IconButton>
          <IconButton size='small' onClick={() => handleDeleteClick(row)}>
            <Icon icon='mdi:delete' />
          </IconButton>
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
      <MessageSideBar
        open={sideBarOpen}
        message={currentMessage}
        onSubmit={handleSideBarSubmit}
        onCancel={handleSideBarCancel}
      />
      <AlertDialog
        open={deleteOpen}
        title={'Delete Message'}
        content={
          <Typography component={'span'} variant='title'>
            Message received to {currentMessage.receiver} from {currentMessage.sender} will be deleted. Please confirm
            to continue.
          </Typography>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default MessagesPage;
