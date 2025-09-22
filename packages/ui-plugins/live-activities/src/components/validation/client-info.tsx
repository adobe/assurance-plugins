import { View } from '@adobe/react-spectrum';
import React from 'react';
// @ts-ignore //Ignoring error as this is a style file
import './client-info.css';
import ClientValidationWidget from './client-validation-widget';
import ProfileSectionWidget from './profile-section-widget';
import AppStoreCredentialsWidget from './appstore-credentials-widget';
import classNames from 'classnames';

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
