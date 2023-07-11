// ** MUI Imports
import { Box, Button } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

const TableHeader = ({ onRefresh }) => {
  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button sx={{ mb: 2 }} onClick={onRefresh} variant='contained'>
          Refresh
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
