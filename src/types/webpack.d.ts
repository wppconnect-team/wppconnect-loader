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
type ModuleId = string | number;

interface Module {
  exports: any;
  i: string;
  l: boolean;
}

interface ModuleMap {
  [key: string]: Module;
}

interface webpackChunkbuildModules {
  [key: string]: (
    module: any,
    exports: any,
    require: {
      c: ModuleMap;
      [key: string]: any;
    }
  ) => void;
}

interface Window {
  webpackChunkbuild?: Array<[Array<ModuleId>, webpackChunkbuildModules, any]>;
}
