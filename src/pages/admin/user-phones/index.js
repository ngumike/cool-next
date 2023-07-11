/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, useCallback } from 'react';

// ** MUI Imports
import { Box, Card, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';

// ** Actions Imports
import { fetchUsers } from 'src/store/apps/user';
import { fetchLines } from 'src/store/apps/line';
import { createBulkUserLines, updateUserLine, fetchUserLines, deleteUserLine } from 'src/store/apps/user-line';

// ** Custom Table Components Imports
import TableHeader from 'src/@core/components/pages/admin/user-phones/TableHeader';
import UserPhoneSideBar from 'src/@core/components/pages/admin/user-phones/UserPhoneSideBar';

import AlertDialog from 'src/@core/components/dialog/AlertDialog';

import { USER_LINE_STATUS, USERS_ROWS_PER_PAGE } from 'src/configs/constants';

const PhoneNumbersPage = () => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** Store
  const { userLines, total } = useSelector(state => state.userLine);
  const { lines } = useSelector(state => state.line);
  const { users } = useSelector(state => state.user);

  // ** State
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(USERS_ROWS_PER_PAGE[0]);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUserLine, setCurrentUserLine] = useState({});

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchLines());
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUserLines({ level: 11, page: page === 0 ? 1 : page + 1, limit: pageSize }))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, pageSize]);

  const handleFilterChange = useCallback(val => {
    setFilter(val);
  }, []);

  const handleCreateClick = () => {
    setCurrentUserLine({});
    setSideBarOpen(true);
  };

  const handleEditClick = userLine => {
    setCurrentUserLine(userLine);
    setSideBarOpen(true);
  };

  const handleDeleteClick = userLine => {
    setCurrentUserLine(userLine);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async callback => {
    await dispatch(deleteUserLine(currentUserLine.id)).unwrap();
    dispatch(fetchLines());
    callback();
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const handleSideBarCancel = () => {
    setCurrentUserLine({});
    setSideBarOpen(false);
  };

  const handleSideBarSubmit = async (userLine, callback) => {
    const actionFunc = userLine.id ? updateUserLine : createBulkUserLines;

    const payload = {
      id: userLine.id,
      userId: userLine.user.id,
      status: userLine.status,
      note: userLine.note
    };

    if (userLine.id) {
      payload.lineId = userLine.line.id;
    } else {
      payload.lineIds = userLine.lines.map(line => line.id);
    }

    const res = await dispatch(actionFunc({ ...payload })).unwrap();
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
      field: 'phoneNumber',
      headerName: 'Phone Number',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.line.phoneNumber}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'nickName',
      headerName: 'Nick name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.nickName}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.user.email}
          </Typography>
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={USER_LINE_STATUS[row.status].label}
            color={USER_LINE_STATUS[row.status].color}
            sx={{ textTransform: 'capitalize' }}
          />
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 220,
      field: 'createdAt',
      headerName: 'Assigned At',
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
            <TableHeader filter={filter} onFilterChange={handleFilterChange} onAdd={handleCreateClick} />
            <DataGrid
              loading={loading}
              autoHeight
              pagination
              paginationMode='server'
              rows={userLines}
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
      <UserPhoneSideBar
        open={sideBarOpen}
        users={users}
        lines={lines}
        userLine={currentUserLine}
        onSubmit={handleSideBarSubmit}
        onCancel={handleSideBarCancel}
      />
      <AlertDialog
        open={deleteOpen}
        title={'Unassign Phone Number'}
        content={
          <Typography component={'span'} variant='title'>
            {currentUserLine.line?.phoneNumber} will be unassigned from {currentUserLine.user?.nickName}. Please confirm
            to continue.
          </Typography>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default PhoneNumbersPage;
