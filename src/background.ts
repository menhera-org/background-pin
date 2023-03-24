// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import { StorageArea } from './modules/StorageArea';
import { StorageItem } from './modules/StorageItem';

let visibilityDisabled = true;
const visibilityDisabledStorage = new StorageItem('tab.visibility.disabled', false, StorageArea.LOCAL);
visibilityDisabledStorage.observe((value) => {
  visibilityDisabled = value;
  if (visibilityDisabled) {
    browser.browserAction.setIcon({
      path: {
        16: 'pin-enabled.svg',
        32: 'pin-enabled.svg',
      }
    }).then(() => {
      return browser.browserAction.setTitle({ title: browser.i18n.getMessage('browserActionTitleEnabled') });
    }).catch((e) => {
      console.error(e);
    });
  } else {
    browser.browserAction.setIcon({
      path: {
        16: 'pin-disabled.svg',
        32: 'pin-disabled.svg',
      }
    }).then(() => {
      return browser.browserAction.setTitle({ title: browser.i18n.getMessage('browserActionTitle') });
    }).catch((e) => {
      console.error(e);
    });
  }
});

browser.browserAction.onClicked.addListener(async () => {
  const value = !visibilityDisabled;
  await visibilityDisabledStorage.setValue(value);
});
