const navigation = () => {
  const nav_items = [
    {
      sectionTitle: 'Dashboard'
    },
    {
      title: 'Home',
      icon: 'mdi:home-outline',
      action: 'read',
      subject: 'user-page',
      path: '/home'
    },
    {
      title: 'Messages',
      icon: 'mdi:message-outline',
      action: 'read',
      subject: 'user-page',
      path: '/messages/table'
    },

    // {
    //   title: 'Messages(Chat)',
    //   icon: 'mdi:message-outline',
    //   action: 'read',
    //   subject: 'user-page',
    //   path: '/messages/chat'
    // },
    {
      title: 'Profile',
      icon: 'mdi:shield-outline',
      action: 'read',
      subject: 'user-page',
      path: '/profile'
    },
    {
      sectionTitle: 'Admin'
    },
    {
      title: 'Messages',
      icon: 'mdi:message',
      path: '/admin/messages'
    },
    {
      title: 'Assigned Phones',
      icon: 'mdi:dots-horizontal',
      path: '/admin/user-phones'
    },
    {
      title: 'Phone Numbers',
      icon: 'mdi:phone-outline',
      path: '/admin/phone-numbers'
    },
    {
      title: 'Users',
      icon: 'mdi:account-outline',
      path: '/admin/users'
    }
  ];

  return nav_items;
};

export default navigation;
