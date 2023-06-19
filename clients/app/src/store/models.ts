import { app } from 'srcPath/models/app';
import { Models } from '@rematch/core';
import { setting } from '../models/setting';
export interface RootModel extends Models<RootModel> {
  setting: typeof setting;
  app: typeof app
}

export const models: RootModel = { setting, app };
