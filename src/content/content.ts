// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import './content-interfaces';
import { StorageItem } from '../modules/StorageItem';
import { StorageArea } from '../modules/StorageArea';

let visibilityDisabled = true;
const visibilityDisabledStorage = new StorageItem('tab.visibility.disabled', false, StorageArea.LOCAL);
visibilityDisabledStorage.observe((value) => {
  if (visibilityDisabled != value && document.visibilityState == 'hidden') {
    dispatchEvent();
  }
  visibilityDisabled = value;
});

let eventDispatching = false;
const dispatchEvent = () => {
  if (eventDispatching) {
    return;
  }
  eventDispatching = true;
  document.dispatchEvent(new Event('visibilitychange'));
  eventDispatching = false;
};

const htmlDocumentPrototype = Object.getPrototypeOf(document);
const documentPrototype = Object.getPrototypeOf(htmlDocumentPrototype);
const documentPrototypeWrapped = documentPrototype.wrappedJSObject;

try {
  delete documentPrototypeWrapped.hidden;
  Reflect.defineProperty(documentPrototypeWrapped, 'hidden', {
    enumerable: true,
    configurable: true,
    get: exportFunction(() => {
      if (visibilityDisabled) {
        return false;
      }
      return document.visibilityState == 'hidden';
    }, window),
  });
} catch (e) {
  // ignore.
}

delete documentPrototypeWrapped.visibilityState;
Reflect.defineProperty(documentPrototypeWrapped, 'visibilityState', {
  enumerable: true,
  configurable: true,
  get: exportFunction(() => {
    if (visibilityDisabled) {
      return 'visible';
    }
    return document.visibilityState;
  }, window),
});

document.addEventListener('visibilitychange', (ev) => {
  if (eventDispatching) return;
  if (visibilityDisabled) {
    ev.stopImmediatePropagation();
  }
}, { capture: true });

window.addEventListener('focus', (ev) => {
  if (visibilityDisabled) {
    ev.stopImmediatePropagation();
  }
}, { capture: true });

window.addEventListener('blur', (ev) => {
  if (visibilityDisabled) {
    ev.stopImmediatePropagation();
  }
}, { capture: true });
