// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Enum of storage areas.
 */
export enum StorageArea {
  /**
   * Local storage area.
   */
  LOCAL,

  /**
   * Browser-synced storage area.
   */
  SYNC,

  /**
   * Profile-managed storage area (readonly).
   */
  MANAGED,
}
