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
import { render, screen, within } from '@testing-library/react';

import { 
  setupBridge,
  initBridge,
  navigateTo as receiveNavigation,
  receiveConnections,
  receiveEvents,
  receivePlugins,
  receiveSelectedEvents,
  receiveSession,
  receiveSettings,
  receiveValidation
} from '@adobe/assurance-testing-library';

import { 
  PluginBridgeProvider,
  annotateEvent,
  annotateSession,
  deletePlugin,
  flushConnection,
  navigateTo,
  selectEvents,
  sendCommand,
  uploadPlugin,
  useClients,
  useConnections,
  useEnvironment,
  useFilteredEvents,
  useFlags,
  useImsAccessToken,
  useImsOrg,
  useNavigationFilters,
  useNavigationPath,
  usePlugins,
  useSelectedClients,
  useSelectedEvents,
  useSession,
  useTenant,
  useValidation
} from '../src';

import { CLIENT_EVENT, CLIENT_EVENT2, EVENT1, EVENT2, EVENT3, INVALID_TEST, PLUGIN1, SESSION, VALID_TEST } from './mocks';
import { event as rootEvent } from '@adobe/griffon-toolkit-common';
import { filterToHash } from '@adobe/griffon-toolkit';

const Sample = () => {
  
  const env = useEnvironment();
  const flags = useFlags();
  const imsAccsessToken = useImsAccessToken();
  const imsOrg = useImsOrg();
  const tenant = useTenant();
  const navigation = useNavigationPath();
  const filters = useNavigationFilters();
  const events = useFilteredEvents();
  const childEvents = useFilteredEvents({ matchers: ['payload.ACPExtensionEventParentIdentifier'] }); // only events that have a parent id
  const plugins = usePlugins();
  const selectedEvents = useSelectedEvents();
  const clients = useClients();
  const selectedClients = useSelectedClients();
  const validation = useValidation();
  const session = useSession();
  const connections = useConnections();

  return (
    <dl style={{ width: '100%', overflow: 'hidden' }}>
      <dt>Environment</dt>
      <dd data-testid='env'>{env}</dd>
      <dt>Flags</dt>
      <dd data-testid='flags'>{JSON.stringify(flags)}</dd>
      <dt>IMS Access Token</dt>
      <dd data-testid='token'>{imsAccsessToken}</dd>
      <dt>IMS Org</dt>
      <dd data-testid='org'>{imsOrg}</dd>
      <dt>Tenant</dt>
      <dd data-testid='tenant'>{tenant}</dd>
      <dt>Navigation</dt>
      <dd data-testid='navigation'>{navigation}</dd>
      <dt>Navigation filters</dt>
      <dd data-testid='filters'>{JSON.stringify(filters)}</dd>
      <dt>Events</dt>
      <dd data-testid='events'>{events?.length || 0}</dd>
      <dt>Child Events</dt>
      <dd data-testid='child-events'>{childEvents?.length || 0}</dd>      
      <dt>Selected Events</dt>
      <dd data-testid='selected-events'>{selectedEvents?.[0]?.uuid}</dd>      
      <dt>Clients</dt>
      <dd data-testid='clients'>{clients?.length || 0}</dd>      
      <dt>Selected Clients</dt>
      <dd data-testid='selected-clients'>{JSON.stringify(selectedClients)}</dd>      
      <dt>Plugins</dt>
      <dd data-testid='plugins'>{plugins?.length || 0}</dd>
      <dt>Session</dt>
      <dd data-testid='session'>{session?.name}</dd>
      <dt>Validation</dt>
      <dd data-testid='validation'>{Object.keys(validation || {}).length}</dd>
      <dt>Connections</dt>
      <dd data-testid='connections'>{Object.keys(connections || {}).length}</dd>
    </dl>
  );
};

describe('BridgeProviderModule', () => {
  const start = async () => {
    setupBridge();
    render(
      <PluginBridgeProvider>
        <Sample />
      </PluginBridgeProvider>
    );
    await initBridge({
      env: 'prod',
      showColumnSettings: true,
      showReleaseNotes: true,
      showTimeline: true,
      imsAccessToken: 'test-token',
      imsOrg: 'test-org',
      tenant: 'test-tenant'
    });
  };

  describe('hooks', () => {

    it('passes config context', async () => {
      await start();

      expect(screen.getByTestId('env')).toHaveTextContent('prod');
      expect(screen.getByTestId('flags')).toHaveTextContent('{"showColumnSettings":true,"showReleaseNotes":true,"showTimeline":true}');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('org')).toHaveTextContent('test-org');
      expect(screen.getByTestId('tenant')).toHaveTextContent('test-tenant');
    });

    it('can receive new settings', async () => {
      await start();

      receiveSettings({
        env: 'qa',
        showColumnSettings: false,
        showReleaseNotes: false,
        showTimeline: false,
        imsAccessToken: 'test-token2',
        imsOrg: 'test-org2',
        tenant: 'test-tenant2'
      });

      expect(screen.getByTestId('env')).toHaveTextContent('qa');
      expect(screen.getByTestId('flags')).toHaveTextContent('{"showColumnSettings":false,"showReleaseNotes":false,"showTimeline":false}');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token2');
      expect(screen.getByTestId('org')).toHaveTextContent('test-org2');
      expect(screen.getByTestId('tenant')).toHaveTextContent('test-tenant2');
    });

    it('passes navigation', async () => {
      await start();
      receiveNavigation('event-list#filters=eyJoaWRkZW4iOiIhKGFubm90YXRpb25zWz90eXBlPT0ndmlzaWJpbGl0eSddLnBheWxvYWQuaGlkZGVuKVswXSA9PSBgdHJ1ZWAifQ==');

      expect(screen.getByTestId('navigation')).toHaveTextContent('event-list');
      expect(screen.getByTestId('filters')).toHaveTextContent('{"hidden":"!(annotations[?type==\'visibility\'].payload.hidden)[0] == `true`"}');
    });

    it('passes events', async () => {
      await start();
      receiveEvents([
        EVENT1, EVENT2, EVENT3
      ]);
      receiveSelectedEvents([EVENT1]);

      // for selected client
      const navFilter = {
        clients: rootEvent.makeClientFilter(['test-client'])
      };
      const path = `event-list#${filterToHash(navFilter)}`;
      receiveNavigation(path);

      expect(screen.getByTestId('events')).toHaveTextContent('3');
      expect(screen.getByTestId('child-events')).toHaveTextContent('2');
      expect(screen.getByTestId('selected-events')).toHaveTextContent('TestEvent1');
    });

    it('passes validation', async () => {
      await start();
      receiveValidation({ 'test-valid': VALID_TEST, 'test-invalid': INVALID_TEST });
    
      expect(screen.getByTestId('validation')).toHaveTextContent('2');
    });

    it('passes plugins', async () => {
      await start();
      receivePlugins([
        PLUGIN1
      ]);
      expect(screen.getByTestId('plugins')).toHaveTextContent('1');
    });

    it('passes clients', async () => {
      await start();
      receiveEvents([
        EVENT1, EVENT2, EVENT3, CLIENT_EVENT, CLIENT_EVENT2
      ]);
      receiveSelectedEvents([EVENT1]);
    
      expect(screen.getByTestId('clients')).toHaveTextContent('2');
      expect(screen.getByTestId('selected-clients')).toHaveTextContent('["test-client","test-client2"]');
      
      // selected specific client
      const navFilter = {
        clients: rootEvent.makeClientFilter(['test-client'])
      };
      const path = `event-list#${filterToHash(navFilter)}`;
      receiveNavigation(path);
    
      expect(screen.getByTestId('selected-clients')).toHaveTextContent('["test-client"]');
    });

    it('passes session', async () => {
      await start();
      receiveSession(SESSION);    
      expect(screen.getByTestId('session')).toHaveTextContent('My test session');
    });

    it('passes connections', async () => {
      await start();
      receiveConnections([
        { name: 'test-connection', type: 'test-type' }
      ]);
      expect(screen.getByTestId('connections')).toHaveTextContent('1');
    });
  });

  describe('callbacks', () => {
    it('can navigate', async () => {
      await start();
      navigateTo('event-list');
      expect(window.pluginBridge.navigateTo).toHaveBeenCalledWith('event-list');
    });
    it('can select events', async () => {
      await start();
      selectEvents(['TestEvent1']);
      expect(window.pluginBridge.selectEvents).toHaveBeenCalledWith(['TestEvent1']);
    });
    it('can annotate events', async () => {
      await start();
      annotateEvent('TestEvent1');
      expect(window.pluginBridge.annotateEvent).toHaveBeenCalledWith('TestEvent1');
    });
    it('can annotate session', async () => {
      await start();
      annotateSession('test-annotation');
      expect(window.pluginBridge.annotateSession).toHaveBeenCalledWith('test-annotation');
    });
    it('can delete plugins', async () => {
      await start();
      deletePlugin('test-plugin');
      expect(window.pluginBridge.deletePlugin).toHaveBeenCalledWith('test-plugin');
    });
    it('can flush connections', async () => {
      await start();
      flushConnection('test-plugin', 'my-context');
      expect(window.pluginBridge.flushConnection).toHaveBeenCalledWith('test-plugin', 'my-context');
    });
    it('can send commands', async () => {
      await start();
      sendCommand('test-command');
      expect(window.pluginBridge.sendCommand).toHaveBeenCalledWith('test-command');
    });
    it('can upload plugins', async () => {
      await start();
      uploadPlugin('test-plugin');
      expect(window.pluginBridge.uploadPlugin).toHaveBeenCalledWith('test-plugin');
    });
  });
});

