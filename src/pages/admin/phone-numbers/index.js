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
import { createLine, updateLine, fetchLines, deleteLine, importLine } from 'src/store/apps/line';

// ** Custom Table Components Imports
import TableHeader from 'src/@core/components/pages/admin/lines/TableHeader';
import LineSideBar from 'src/@core/components/pages/admin/lines/LineSideBar';

import AlertDialog from 'src/@core/components/dialog/AlertDialog';

import { LINE_STATUS, USERS_ROWS_PER_PAGE } from 'src/configs/constants';
import ImportLineSideBar from 'src/@core/components/pages/admin/lines/ImportLineSideBar';

const PhoneNumbersPage = () => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** Store
  const { lines, total } = useSelector(state => state.line);

  // ** State
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(USERS_ROWS_PER_PAGE[0]);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [importSideBarOpen, setImportSideBarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState({});

  useEffect(() => {
    setLoading(true);
    dispatch(fetchLines({ page: page === 0 ? 1 : page + 1, limit: pageSize }))
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
    setCurrentLine({});
    setSideBarOpen(true);
  };

  const handleImportClick = () => {
    setCurrentLine({});
    setImportSideBarOpen(true);
  };

  const handleEditClick = line => {
    setCurrentLine(line);
    setSideBarOpen(true);
  };

  const handleDeleteClick = line => {
    setCurrentLine(line);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async callback => {
    await dispatch(deleteLine(currentLine.id)).unwrap();
    callback();
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const handleSideBarCancel = () => {
    setCurrentLine({});
    setSideBarOpen(false);
  };

  const handleImportSideBarCancel = () => {
    setCurrentLine({});
    setImportSideBarOpen(false);
  };

  const handleSideBarSubmit = async (line, callback) => {
    const actionFunc = line.id ? updateLine : createLine;
    const res = await dispatch(actionFunc({ ...line })).unwrap();
    callback(res);
  };

  const handleImportSideBarSubmit = async (payload, callback) => {
    const res = await dispatch(importLine({ ...payload })).unwrap();
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
            {row.phoneNumber}
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
            label={LINE_STATUS[row.status].label}
            color={LINE_STATUS[row.status].color}
            sx={{ textTransform: 'capitalize' }}
          />
        );
      }
    },
    {
      flex: 0.1,
      minWidth: 220,
      field: 'createdAt',
      headerName: 'Created At',
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
      minWidth: 220,
      field: 'updatedAt',
      headerName: 'Updated At',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={new Date(row.updatedAt).toLocaleString('en-US')}
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

          <Tooltip
            title={row.status === LINE_STATUS.allocated.value ? 'Phone number in use. Please unassign to delete.' : ''}
            placement='right'
          >
            <span>
              <IconButton
                size='small'
                disabled={row.status === LINE_STATUS.allocated.value}
                onClick={() => handleDeleteClick(row)}
              >
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
            <TableHeader
              filter={filter}
              onFilterChange={handleFilterChange}
              onAdd={handleCreateClick}
              onImport={handleImportClick}
            />
            <DataGrid
              loading={loading}
              autoHeight
              pagination
              paginationMode='server'
              rows={lines}
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
      <LineSideBar
        open={sideBarOpen}
        line={currentLine}
        onSubmit={handleSideBarSubmit}
        onCancel={handleSideBarCancel}
      />
      <ImportLineSideBar
        open={importSideBarOpen}
        onSubmit={handleImportSideBarSubmit}
        onCancel={handleImportSideBarCancel}
      />
      <AlertDialog
        open={deleteOpen}
        title={'Delete Line'}
        content={
          <Typography component={'span'} variant='title'>
            {currentLine.phoneNumber} will be deleted. Please confirm to continue.
          </Typography>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default PhoneNumbersPage;
