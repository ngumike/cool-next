// ** MUI Imports
import { Box, Button } from '@mui/material';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

const TableHeader = ({ onAdd, onImport }) => {
  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button sx={{ mb: 2, mr: 2 }} onClick={onImport} variant='outlined'>
          Import
        </Button>
        <Button sx={{ mb: 2 }} onClick={onAdd} variant='contained'>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
