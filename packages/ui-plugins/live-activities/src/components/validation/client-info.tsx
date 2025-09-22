import { View } from '@adobe/react-spectrum';
import React from 'react';
// @ts-ignore //Ignoring error as this is a style file
import styles from './client-info.css';
import ClientValidationWidget from './client-validation-widget';
import ProfileSectionWidget from './profile-section-widget';
import AppStoreCredentialsWidget from './appstore-credentials-widget';

function ClientInfo() {
  return (
    <View UNSAFE_className={styles.clientInfo}>
      <ClientValidationWidget />
      <ProfileSectionWidget />
      <AppStoreCredentialsWidget />
    </View>
  );
}

export default ClientInfo;
