import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import toast from 'react-hot-toast';

// ** Store Imports
import { useDispatch } from 'react-redux';

// ** Actions Imports
import { setLoading } from 'src/store/apps/main';

const AlertDialog = ({ open, title, content, onConfirm, onCancel }) => {
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    dispatch(setLoading(true));
    try {
      await onConfirm(handleCancel);
      toast.success('Action success');
    } catch (err) {
      toast.error('Action failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog open={open} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' color='primary' onClick={handleConfirm}>
          Confirm
        </Button>
        <Button variant='outlined' color='error' onClick={handleCancel} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
