/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
export interface Options {
  refreshModules?: boolean;
  startObserver?: boolean;
}

export const defaultOptions: Options = {
  refreshModules: true,
  startObserver: true,
};

type SearchModuleCondition = (module: any, moduleId?: string) => boolean;

class WPPConnectLoader {
  private _options: Options;
  private _modules = new Map<string, any>();

  private mutationObserver: MutationObserver = null;

  /**
   * EventEmitter
   */
  private _events = new Map<string, Function[]>();

  public on(topic: string, cb: Function): boolean {
    const oldEvents = this._events.get(topic);
    if (this._events.has(topic)) {
      this._events.set(topic, [...oldEvents, cb]);
    }
    this._events.set(topic, [cb]);

    return true;
  }

  public off(topic: string, cb?: Function): boolean {
    if (!cb) {
      return this._events.delete(topic);
    }

    const oldEvents = this._events.get(topic);
    if (Array.isArray(oldEvents) && oldEvents.length) {
      const filtered = oldEvents.filter((l) => l !== cb);
      this._events.set(topic, filtered);
      return true;
    }

    return false;
  }
  protected emit(topic: string, ...args: any[]): void {
    const myListeners = this._events.get(topic);
    if (Array.isArray(myListeners) && myListeners.length) {
      myListeners.forEach((event) => {
        try {
          event.apply(this, args);
        } catch (error) {}
      });
    }
  }

  constructor(options: Options = {}) {
    this._options = Object.assign({}, defaultOptions, options);

    if (this._options.refreshModules) {
      this.refreshModules();
    }

    if (this._options.startObserver) {
      this.initObserver();
    }
  }

  public initObserver(): void {
    if (this.mutationObserver) {
      return;
    }

    this.mutationObserver = new MutationObserver(async (mutations) => {
      // Wait all script to load
      const scripts = [];
      for (const m of mutations) {
        const addedNodes = Array.from(m.addedNodes) as HTMLScriptElement[];
        for (const n of addedNodes) {
          if (n.nodeName !== 'SCRIPT') {
            continue;
          }
          scripts.push(
            new Promise((resolve) => {
              n.addEventListener('load', resolve);
              n.addEventListener('error', resolve);
            })
          );
        }
      }
      await Promise.all(scripts);

      // Update loaded modules
      if (scripts.length) {
        await this.refreshModules();
      }
    });

    // Start mutation observer
    this.mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  public refreshModules(): Promise<boolean> {
    if (!Array.isArray(window.webpackChunkbuild)) {
      return Promise.resolve(false);
    }

    if (!window.webpackChunkbuild.length) {
      return Promise.resolve(false);
    }

    const currentSize = this._modules.size;

    return new Promise<boolean>((resolve) => {
      const id = Date.now();
      window.webpackChunkbuild.push([
        [id],
        {},
        (moduleLoader: any) => {
          for (const moduleId in moduleLoader.m) {
            const module = moduleLoader(moduleId);
            this._modules.set(moduleId + '', module);
          }

          const hasNewElement = currentSize !== this._modules.size;
          this.emit('refresh', hasNewElement);
          resolve(hasNewElement);
        },
      ]);
    });
  }

  /**
   * Return the webpack module id from a search function
   * @param condition Function for compare the modules
   * @param reverse Search in reverse order
   */
  public searchModuleId(
    condition: SearchModuleCondition,
    reverse = false
  ): string {
    let ids = Array.from(this._modules.keys());

    if (reverse) {
      ids = ids.reverse();
    }

    for (const moduleId of ids) {
      try {
        const module = this._modules.get(moduleId);

        if (condition(module, moduleId)) {
          return moduleId;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  /**
   * Return the webpack module from a search function
   * @param condition Function for compare the modules
   * @param reverse Search in reverse order
   */
  public searchModule<T>(condition: SearchModuleCondition, reverse = false): T {
    const moduleId = this.searchModuleId(condition, reverse);

    if (moduleId) {
      return this._modules.get(moduleId);
    }

    return null;
  }

  /**
   * Return the webpack module from a search function, checking new loaded scripts
   * @param condition Function for compare the modules
   */
  async waitForModule<T>(
    condition: SearchModuleCondition,
    reverse = false,
    timeout: number | false = false
  ): Promise<T> {
    const module = await this.searchModule<T>(condition, reverse);

    if (module) {
      return module;
    }

    this.initObserver();

    return new Promise((resolve, reject) => {
      const check = async (refreshed: boolean) => {
        if (!refreshed) {
          return;
        }
        const module = await this.searchModule<T>(condition, reverse);

        if (module) {
          this.off('refresh', check);
          resolve(module);
        }
      };

      this.on('refresh', check);

      if (timeout) {
        setTimeout(() => {
          reject(new Error('Timeout'));
        }, timeout);
      }
    });
  }

  /**
   * Return the webpack module from ID
   * @param moduleId Webpack module ID
   */
  public get<T>(moduleId: string): T {
    return this._modules.get(moduleId + '');
  }

  public forEach(
    callbackfn: (value: any, key: string, map: Map<string, any>) => void
  ): void {
    return this._modules.forEach(callbackfn, this);
  }

  public get size(): number {
    return this._modules.size;
  }

  public dispose(): void {
    this.mutationObserver.disconnect();
    this._modules.clear();
    this._events.clear();
  }
}

export default WPPConnectLoader;
