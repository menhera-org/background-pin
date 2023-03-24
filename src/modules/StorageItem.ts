// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: ts=2 sw=2 et ai
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import browser from 'webextension-polyfill';
import { StorageArea } from './StorageArea';

export class StorageItem<T> {
  private readonly area: browser.Storage.StorageArea
  private readonly key: string;
  private readonly areaName: 'managed' | 'local' | 'sync';
  private readonly defaultValue: T;

  public constructor(key: string, defaultValue: T, area: StorageArea) {
    this.key = key;
    this.defaultValue = defaultValue;
    switch (area) {
      case StorageArea.LOCAL: {
        this.area = browser.storage.local;
        this.areaName = 'local';
        break;
      }

      case StorageArea.SYNC: {
        this.area = browser.storage.sync;
        this.areaName = 'sync';
        break;
      }

      case StorageArea.MANAGED: {
        this.area = browser.storage.managed;
        this.areaName = 'managed';
        break;
      }

      default: {
        throw new Error(`Unknown storage area: ${area}`);
      }
    }
  }

  public getKey(): string {
    return this.key;
  }

  private async getRawValue(): Promise<T | undefined> {
    try {
      const data = await this.area.get(this.key);
      const value = data[this.key];
      return value as T;
    } catch (_e) {
      // throws in case of uninitialized managed storage
      // we want to return undefined in that case
      return undefined;
    }
  }

  public async hasValue(): Promise<boolean> {
    const value = await this.getRawValue();
    return value !== undefined;
  }

  public async getValue(): Promise<T> {
    const value = await this.getRawValue();
    if (value === undefined) {
      return this.defaultValue;
    }
    return value;
  }

  public async clearValue(): Promise<void> {
    if (this.areaName == 'managed') {
      throw new Error('Cannot clear managed storage');
    }
    await this.area.remove(this.key);
  }

  public async setValue(value: T): Promise<void> {
    if (this.areaName == 'managed') {
      throw new Error('Cannot set managed storage');
    }
    await this.area.set({ [this.key]: value });
  }

  public observe(callback: (newValue: T) => void, reportCurrentValue = true): void {
    if (reportCurrentValue) {
      this.getValue().then(callback);
    }
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (!(this.key in changes)) return;
      if (areaName != this.areaName) return;
      const change = changes[this.key];
      if (!change) return;
      const { newValue } = change;
      if (undefined !== newValue) {
        callback(newValue as T);
      } else {
        callback(this.defaultValue);
      }
    });
  }

  public observeMaybe(callback: (newValue: T | undefined) => void, reportCurrentValue = true): void {
    if (reportCurrentValue) {
      this.getRawValue().then(callback);
    }
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (!(this.key in changes)) return;
      if (areaName != this.areaName) return;
      const change = changes[this.key];
      if (!change) return;
      const { newValue } = change;
      callback(newValue as T);
    });
  }
}
