import { all } from 'redux-saga/effects'

import { saga as auth } from './modules/auth'
import { saga as api } from './modules/api'
import { saga as network } from './modules/network'
import { saga as node } from './modules/node'
import { saga as server } from './modules/server'
import { saga as toast } from './modules/toast'

export const createRootSaga = () => {
  function* rootSaga() {
    yield all([auth(), api(), network(), node(), server(), toast()])
  }
  return rootSaga
}
