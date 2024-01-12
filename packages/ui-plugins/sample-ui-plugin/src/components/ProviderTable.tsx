/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import {
  useEnvironment,
  useFlags,
  useImsAccessToken,
  useImsOrg,
  useNavigationPath,
  useFilteredEvents,
  useTenant,
  useValidation
} from '@adobe/assurance-plugin-bridge-provider';

const ProviderTable = () => {
  const env = useEnvironment();
  const flags = useFlags();
  const imsAccsessToken = useImsAccessToken();
  const imsOrg = useImsOrg();
  const tenant = useTenant();
  const navigation = useNavigationPath();
  const events = useFilteredEvents();
  const validation = useValidation();

  return (
    <dl style={{ width: '100%', overflow: 'hidden' }}>
      <dt>Environment</dt>
      <dd>{env}</dd>
      <dt>Flags</dt>
      <dd>{JSON.stringify(flags)}</dd>
      <dt>IMS Access Token</dt>
      <dd style={{ textOverflow: 'ellipsis' }}>{imsAccsessToken}</dd>
      <dt>IMS Org</dt>
      <dd>{imsOrg}</dd>
      <dt>Tenant</dt>
      <dd>{tenant}</dd>
      <dt>Navigation</dt>
      <dd>{navigation}</dd>
      <dt>Events</dt>
      <dd>{events?.length || 0}</dd>
      <dt>Validation</dt>
      <dd>{Object.keys(validation || {}).length}</dd>
    </dl>
  );
};

export default ProviderTable;
