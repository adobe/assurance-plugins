import React from 'react';

import { View } from '@adobe/react-spectrum';
import classNames from 'classnames';

import AppStoreCredentialsWidget from './appstore-credentials-widget';
import './client-info.css';
import ClientValidationWidget from './client-validation-widget';
import ProfileSectionWidget from './profile-section-widget';

function ClientInfo() {
  return (
    <View UNSAFE_className={classNames('clientInfo')}>
      <ClientValidationWidget />
      <ProfileSectionWidget />
      <AppStoreCredentialsWidget />
    </View>
  );
}

export default ClientInfo;
