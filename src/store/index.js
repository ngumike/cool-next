// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit';

// ** Reducers
import main from 'src/store/apps/main';
import user from 'src/store/apps/user';
import line from 'src/store/apps/line';
import message from 'src/store/apps/message';
import userLine from 'src/store/apps/user-line';
import chat from 'src/store/apps/chat';

export const store = configureStore({
  reducer: {
    main,
    user,
    line,
    message,
    userLine,
    chat
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
