// ** MUI Imports
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

// ** Icon Imports
import Icon from 'src/@core/components/icon';

// ** Components
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';

// import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown';

// const notifications = [
//   {
//     meta: 'Today',
//     avatarAlt: 'Flora',
//     title: 'Congratulation Flora! 🎉',
//     avatarImg: '/images/avatars/4.png',
//     subtitle: 'Won the monthly best seller badge'
//   },
//   {
//     meta: 'Yesterday',
//     avatarColor: 'primary',
//     subtitle: '5 hours ago',
//     avatarText: 'Robert Austin',
//     title: 'New user registered.'
//   }
// ];

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, toggleNavVisibility } = props;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <NotificationDropdown settings={settings} notifications={notifications} /> */}
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  );
};

export default AppBarContent;
