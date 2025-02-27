import {
  Button,
  Grid,
  TextField,
  Switch as SwitchField,
  FormControlLabel,
} from '@mui/material'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  useRouteMatch,
  useHistory,
  useParams,
  Switch,
  Route,
} from 'react-router-dom'
import { NmLink } from '~components/index'
import { useDialog } from '~components/ConfirmDialog'
import { useLinkBreadcrumb } from '~components/PathBreadcrumbs'
import { deleteNetwork } from '~modules/network/actions'
import { NetworkEdit } from './edit/NetworkEdit'
import { AccessKeys } from './accesskeys/AccessKeys'
import { NetworkModifiedStats } from './components/NetworkModifiedStats'
import { NetworkNodes } from './nodes/NetworkNodes'
import { useNetwork } from '~util/network'

export const NetworkId: React.FC = () => {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const { t } = useTranslation()

  const { networkId } = useParams<{ networkId: string }>()
  const network = useNetwork(networkId)

  useLinkBreadcrumb({
    link: url,
    title: networkId,
  })

  const { Component, setProps } = useDialog()

  const dispatch = useDispatch()
  const deleteNetworkCallback = useCallback(
    () =>
      setProps({
        message: t('dialog.deleteNetwork'),
        onSubmit: () =>
          dispatch(
            deleteNetwork.request({
              netid: network!.netid,
            })
          ),
      }),
    [dispatch, network, setProps, t]
  )

  if (!network) {
    return <div>Not Found</div>
  }

  return (
    <>
      <Switch>
        <Route path={`${path}/accesskeys`}>
          <AccessKeys />
        </Route>
        <Route path={`${path}/nodes`}>
          <NetworkNodes />
        </Route>
        <Route path={`${path}/edit`}>
          <NetworkModifiedStats netid={networkId} />
          <NetworkEdit network={network} />
          <Button
            variant="outlined"
            onClick={() => {
              history.push(
                url.replace(':networkId', network.netid).replace('/edit', '')
              )
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button variant="outlined" onClick={() => deleteNetworkCallback()}>
            {t('common.delete')}
          </Button>
        </Route>
        <Route exact path={path}>
          <NetworkModifiedStats netid={networkId} />
          <Grid
            container
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
          >
            <TextField
              disabled
              value={network.addressrange}
              label={t('network.addressrange')}
            />
            <TextField
              disabled
              value={network.addressrange6}
              label={t('network.addressrange6')}
            />
            <TextField
              disabled
              value={network.localrange}
              label={t('network.localrange')}
            />
            <TextField
              disabled
              value={network.displayname}
              label={t('network.displayname')}
            />
            <TextField
              disabled
              value={network.defaultinterface}
              label={t('network.defaultinterface')}
            />
            <TextField
              disabled
              value={network.defaultlistenport}
              label={t('network.defaultlistenport')}
            />
            <TextField
              disabled
              value={network.defaultpostup}
              label={t('network.defaultpostup')}
            />
            <TextField
              disabled
              value={network.defaultpostdown}
              label={t('network.defaultpostdown')}
            />
            <TextField
              disabled
              value={network.defaultkeepalive}
              label={t('network.defaultkeepalive')}
            />
            <TextField
              disabled
              value={network.checkininterval}
              label={t('network.checkininterval')}
            />
            <TextField
              disabled
              value={network.defaultextclientdns}
              label={t('network.defaultextclientdns')}
            />
            <TextField
              disabled
              value={network.defaultmtu}
              label={t('network.defaultmtu')}
            />
            <FormControlLabel
              label={t('network.allowmanualsignup')}
              control={
                <SwitchField checked={network.allowmanualsignup} disabled />
              }
              disabled
            />
            <FormControlLabel
              label={t('network.isdualstack')}
              control={<SwitchField checked={network.isdualstack} disabled />}
              disabled
            />
            <FormControlLabel
              label={t('network.defaultsaveconfig')}
              control={
                <SwitchField checked={network.defaultsaveconfig} disabled />
              }
              disabled
            />
            <FormControlLabel
              label={t('network.defaultudpholepunch')}
              control={
                <SwitchField checked={network.defaultudpholepunch} disabled />
              }
              disabled
            />
          </Grid>

          <NmLink to={`${url}/edit`} variant="outlined">
            {t('common.edit')}
          </NmLink>
          <NmLink to={`${url}/nodes`} variant="outlined">
            {t('common.nodes')}
          </NmLink>
          <NmLink to={`${url}/accesskeys`} variant="outlined">
            {t('header.accessKeys')}
          </NmLink>
        </Route>
      </Switch>
      <Component />
    </>
  )
}
