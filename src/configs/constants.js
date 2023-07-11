export const LINE_STATUS = {
  available: { label: 'Available', value: 'available', color: 'success' },
  allocated: { label: 'In Use', value: 'allocated', color: 'info' },
  pending: { label: 'Pending', value: 'pending', color: 'warning' },
  suspended: { label: 'Suspended', value: 'suspended', color: 'error' }
};

export const USER_STATUS = {
  active: { label: 'Active', value: 'active', color: 'success' },
  pending: { label: 'Pending', value: 'pending', color: 'warning' },
  suspended: { label: 'Suspend', value: 'suspended', color: 'secondary' },
  blocked: { label: 'Blocked', value: 'blocked', color: 'error' }
};

export const USER_ROLE = {
  admin: { label: 'Admin', value: 'admin', icon: 'mdi:laptop', color: 'error.main', roleColor: 'error' },
  user: { label: 'User', value: 'user', icon: 'mdi:user', color: 'warning.main', roleColor: 'primary' }
};

export const USER_LINE_STATUS = {
  pending: { label: 'Pending', value: 'pending', color: 'warning' },
  active: { label: 'Active', value: 'active', color: 'success' },
  suspended: { label: 'Suspended', value: 'suspended', color: 'error' }
};

export const chatStatusObj = {
  busy: 'error',
  away: 'warning',
  online: 'success',
  offline: 'secondary'
};

export const USERS_ROWS_PER_PAGE = [10, 25, 50];
