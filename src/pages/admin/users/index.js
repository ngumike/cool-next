/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect, useCallback } from 'react';

// ** MUI Imports
import { Box, Card, Grid, IconButton, Typography, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Store Imports
import { useAuth } from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip';

// ** Actions Imports
import { inviteUser, updateUser, fetchUsers, deleteUser } from 'src/store/apps/user';

// ** Custom Table Components Imports
import TableHeader from 'src/@core/components/pages/admin/users/TableHeader';
import UserSideBar from 'src/@core/components/pages/admin/users/UserSideBar';

import AlertDialog from 'src/@core/components/dialog/AlertDialog';

import { USER_STATUS, USERS_ROWS_PER_PAGE } from 'src/configs/constants';

const UsersPage = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const { user: authUser } = useAuth();

  // ** Store
  const { users, total } = useSelector(state => state.user);

  // ** State
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(USERS_ROWS_PER_PAGE[0]);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setLoading(true);
    dispatch(fetchUsers({ page: page === 0 ? 1 : page + 1, limit: pageSize }))
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

  const handleInviteClick = () => {
    setCurrentUser({});
    setSideBarOpen(true);
  };

  const handleEditClick = user => {
    setCurrentUser(user);
    setSideBarOpen(true);
  };

  const handleDeleteClick = user => {
    setCurrentUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async callback => {
    await dispatch(deleteUser(currentUser.id)).unwrap();
    callback();
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const handleSideBarCancel = () => {
    setCurrentUser({});
    setSideBarOpen(false);
  };

  const handleSideBarSubmit = async (user, callback) => {
    const actionFunc = user.id ? updateUser : inviteUser;
    const res = await dispatch(actionFunc({ ...user, nickName: user.name })).unwrap();
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
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.email}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'nickName',
      headerName: 'Nick Name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant='body2'>
            {row.nickName}
          </Typography>
        );
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 150,
      headerName: 'Role',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
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
            label={USER_STATUS[row.status].label}
            color={USER_STATUS[row.status].color}
            sx={{ textTransform: 'capitalize' }}
          />
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 220,
      field: 'createdAt',
      headerName: 'Member Since',
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
          <Tooltip title={row.id === authUser.id ? 'Cannot delete yourself' : ''} placement='right'>
            <span>
              <IconButton size='small' disabled={row.id === authUser.id} onClick={() => handleDeleteClick(row)}>
                <Icon icon='mdi:delete' />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <TableHeader filter={filter} onFilterChange={handleFilterChange} onAdd={handleInviteClick} />
            <DataGrid
              loading={loading}
              autoHeight
              rows={users}
              columns={columns}
              page={page}
              pageSize={pageSize}
              rowCount={total}
              disableSelectionOnClick
              rowsPerPageOptions={USERS_ROWS_PER_PAGE}
              onPageChange={newPage => handlePageChange(newPage)}
              onPageSizeChange={newPageSize => handlePageSizeChange(newPageSize)}
              pagination
              paginationMode='server'
            />
          </Card>
        </Grid>
      </Grid>
      <UserSideBar
        open={sideBarOpen}
        user={currentUser}
        onSubmit={handleSideBarSubmit}
        onCancel={handleSideBarCancel}
      />
      <AlertDialog
        open={deleteOpen}
        title={'Delete User'}
        content={
          <Typography component={'span'} variant='title'>
            {currentUser.nickName}({currentUser.email}) will be deleted. Please confirm to continue.
          </Typography>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default UsersPage;
