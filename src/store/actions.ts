import { ActionType } from 'typesafe-actions'

import { actions as auth } from './modules/auth'
import { actions as network } from './modules/network'
import { actions as node } from './modules/node'
import { actions as server } from './modules/server'
import { actions as toast } from './modules/toast'

export const actions = {
  auth,
  network,
  node,
  server,
  toast,
}

export type RootAction = ActionType<typeof actions>
