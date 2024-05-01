import React, { createContext, useState } from 'react';

export const ProfileContext = createContext({
  userData: null,
  setUserData: () => {},
});