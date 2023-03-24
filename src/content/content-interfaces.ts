// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* eslint-disable @typescript-eslint/no-unused-vars */

type CloneIntoOptions = {
  cloneFunctions?: boolean;
  defineAs?: string;
};

declare const cloneInto: <T,>(value: T, scope?: unknown, options?: CloneIntoOptions) => T;

// eslint-disable-next-line @typescript-eslint/ban-types
declare const exportFunction: <T extends Function>(fn: T, scope?: unknown, options?: CloneIntoOptions) => T;

interface Object {
  wrappedJSObject: this;
}
