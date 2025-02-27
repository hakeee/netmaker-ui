import React from 'react'

import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NodeDetails from './NodeDetails'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Modal from '@material-ui/core/Modal'
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit'
import AccountTree from '@material-ui/icons/AccountTree'
import CheckBox from '@material-ui/icons/CheckBox'
import LeakRemove from '@material-ui/icons/LeakRemove'
import Cancel from '@material-ui/icons/Cancel'
import LowPriority from '@material-ui/icons/LowPriority'
import AddToQueue from '@material-ui/icons/AddToQueue'
import RemoveFromQueue from '@material-ui/icons/RemoveFromQueue'
import IconButton from '@material-ui/core/IconButton'
import MultilineChart from '@material-ui/icons/MultilineChart'
import GatewayCreate from './GatewayCreate'
import SettingsInputAntenna from '@material-ui/icons/SettingsInputAntenna'
import RelayDetails from './Modals/RelayDetails';

import API from '../Utils/API'
import Util from '../Utils/Fields'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
        maxHeight: '38em'
    },
    row: {
        marginBottom: '0.5em',
        marginTop: '1em',
    },
    center: {
        textAlign: 'center'
    },
    cell: {
        padding: '0.5em',
    },
    nodeTitle: {
        textAlign: 'center'
    },
    nodeTitle2: {
        textAlign: 'center',
        marginTop: '1em',
        marginBottom: '1em'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paperModal: {
        position: 'absolute',
        width: '60%',
        backgroundColor: theme.palette.background.paper,
        outline: 0, // Disable browser on-focus borders
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    text: {
        color: '#000000'
    },
    gateway: {
        color: '#3F51B5',
        fontSize: '2em',
        marginLeft: '1em'
    }
}));

const displayedNodeFields = [
    'publickey',
    'listenport',
    'lastcheckin'
]

const WARNING = '#ffcc00'
const ERROR = '#ED4337'
const HEALTHY = '#11772d'

export default function AllNodes({ setNodeData, nodes, networkName, setSuccess, isAllNetworks, networks, user, config }) {

    const classes = useStyles()
    const [selectedNode, setSelectedNode] = React.useState(null)
    const [error, setError] = React.useState('')
    const [success, setApprovalSuccess] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [gatewayNode, setGatewayNode] = React.useState(null)
    const [relayOpen, setRelayOpen] = React.useState(false)

    const handleNodeSelect = node => {
        setSelectedNode(node)
    }

    const doesNetworkHaveNodes = () => {
        if (nodes && !nodes.length) return false 
        return nodes.filter(node => node.network === networkName).length > 0
    }

    const getSelectedNode = () => {
        return selectedNode
    }

    const handleRemoveGateway = async node => {
        if (window.confirm(`Are you certain you want to remove the egress gateway on node: ${node.name}?`)) {
            try {
                const response = await API(user.token).delete(`/nodes/${node.network}/${node.macaddress}/deletegateway`)
                if (response.status === 200) {
                    setApprovalSuccess(`Successfully removed egress gateway from, ${node.name}!`)
                } else {
                    setError(`Unable to remove egress gateway from node, ${node.name}.`)
                }
            } catch (err) {
                setError(`Server error occurred, unable to remove egress gateway from node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const handleRemoveIngress = async node => {
        if (window.confirm(`Are you certain you want to remove the ingress gateway on node: ${node.name}? (External Clients may be affected.)`)) {
            try {
                const response = await API(user.token).delete(`/nodes/${node.network}/${node.macaddress}/deleteingress`)
                if (response.status === 200) {
                    setApprovalSuccess(`Successfully removed ingress gateway from, ${node.name}!`)
                } else {
                    setError(`Unable to remove ingress gateway from node, ${node.name}.`)
                }
            } catch (err) {
                setError(`Server error occurred, unable to remove ingress gateway from node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const handleRemoveRelay = async (node) => {
        if (window.confirm(`Are you certain you want to stop node, ${node.name}, from relaying?`)) {
            try {
                const response = await API(user.token).delete(`/nodes/${node.network}/${node.macaddress}/deleterelay`)
                if (response.status === 200) {
                    setApprovalSuccess(`Successfully removed relay from, ${node.name}!`)
                } else {
                    setError(`Unable to remove relay from node, ${node.name}.`)
                }
            } catch (err) {
                setError(`Server error occurred, unable to remove relay from node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const handleCreateRelay = async (node, relayAddresses) => {
        if (window.confirm(`Are you certain you want to make a relay from: ${node.name} in network: ${node.network}?`)) {
            try {
                if (node && relayAddresses && relayAddresses.length) {
                    console.log(relayAddresses)
                    const response = await API(user.token).post(`/nodes/${node.network}/${node.macaddress}/createrelay`, {
                        relayaddrs: relayAddresses
                    })
                    if (response.status === 200) {
                        setApprovalSuccess(`Successfully created relay on node, ${node.name}!`)
                        handleClose()
                    } else {
                        setError(`Unable to relay to node, ${node.name}.`)
                    }
                }
            } catch (err) {
                setError(`Server error occurred, unable to add relay on node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const handleCreateIngress = async node => {
        if (window.confirm(`Are you certain you want to allow external client traffic and make an ingress gateway on node: ${node.name} and network: ${node.network}?`)) {
            try {
                const response = await API(user.token).post(`/nodes/${node.network}/${node.macaddress}/createingress`)
                if (response.status === 200) {
                    setApprovalSuccess(`Successfully created ingress gateway on node, ${node.name}!`)
                } else {
                    setError(`Unable to add ingress gateway to node, ${node.name}.`)
                }
            } catch (err) {
                setError(`Server error occurred, unable to create ingress gateway on node, ${node.name}.`)
            }
            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const approveNode = async (network, macaddress, name) => {
        if (window.confirm(`Are you certain you want to approve node ${name} with MAC ${macaddress}?`)) {
            try {
                const response = await API(user.token).post(`/nodes/${network}/${macaddress}/approve`)
                if (response.status === 200) {
                    setApprovalSuccess(`Approved node, ${name}!`)
                } else {
                    setError(`Unable to approve node, ${name}.`)
                }
            } catch (err) {
                setError(`Unable to approve node - Server Error, ${name}.`)
            }

            setTimeout(() => {
                setApprovalSuccess('')
                setError('')
            }, 2000)
        }
    }

    const isLinux = (osName) => {
        return osName === 'linux'
    }

    const handleClose = () => {
        setOpen(false)
        setRelayOpen(false)
        setGatewayNode(null)
    }

    const handleOpening = node => {
        setGatewayNode(node)
        setOpen(true)
    } 

    const handleOpenRelay = node => {
        setGatewayNode(node)
        setRelayOpen(true)
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.container}>
            <Modal
                aria-labelledby="gravitl"
                aria-describedby="Copy your Netmaker Access Token Value"
                className={classes.modal}
                open={open || relayOpen}
                onClose={handleClose}
                disablePortal
                disableEnforceFocus
                disableAutoFocus
            >
                <div className={classes.paperModal}>
                    {relayOpen ? <RelayDetails nodeData={nodes && nodes.length ? nodes.filter(node => node.name !== gatewayNode.name && node.network === gatewayNode.network) : []} addRelay={handleCreateRelay} setError={setError} setSuccess={setSuccess} handleClose={handleClose} relayNode={gatewayNode} /> :
                        <GatewayCreate user={user} setSuccess={setApprovalSuccess} setOpen={setOpen} gatewayNode={gatewayNode} networks={networks} />
                    }
                </div>
            </Modal>
            <Grid item xs={10}>
            {success ? <div className={classes.center}><Typography variant='h6' color='primary'>{success}</Typography></div> : null}
            {error ? <div className={classes.center}><Typography variant='h6' color='error'>{error}</Typography></div> : null}
            {!selectedNode ? <div className={classes.nodeTitle2}><Typography variant='h5'>{isAllNetworks ? 'All' : networkName} nodes</Typography></div> : null }
            {isAllNetworks || doesNetworkHaveNodes() ? null : <div className={classes.nodeTitle}><h3>No nodes present in network: {networkName}...</h3></div>}
            {selectedNode ? <NodeDetails config={config} user={user} setNodeData={setNodeData} node={getSelectedNode()} setSelectedNode={setSelectedNode} setSuccess={setSuccess} networkName={networkName} networkData={networks} /> :
            nodes && nodes.length ? (nodes.filter(node => isAllNetworks ? node : networkName && node.network === networkName)).map((node, i) => 
                <Card key={i} className={classes.row}>
                    <CardHeader
                        title={node.name  + (node.ispending === "yes" ? ' (Approval Required)' : '')}
                        subheader={`public ip: ${node.endpoint} | subnet ip: ${node.address} | status: ${(Date.now()/1000) - node.lastcheckin >= 1800 ? 'ERROR' : 
                            (Date.now()/1000) - node.lastcheckin >= 300 ? 'WARNING' : 'HEALTHY'}`}
                        avatar={
                            <Avatar aria-label={node.name} style={{ backgroundColor:
                                (Date.now()/1000) - node.lastcheckin >= 1800 ? ERROR : 
                                (Date.now()/1000) - node.lastcheckin >= 300 ? WARNING : HEALTHY }}>
                                {node.name.toUpperCase().substring(0,1)}
                            </Avatar>
                        }
                        action={
                            <Tooltip title='EDIT' placement='top'>
                                <IconButton aria-label={`edit node ${node.name}`} onClick={() => handleNodeSelect(node)}>
                                <Edit />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        <Grid container justify='center' alignItems='center'>
                            <Grid item xs={2} md={1}>
                                { node.isegressgateway === "yes" ?
                                <Tooltip title={`REMOVE EGRESS GATEWAY for ${node.name}?`} placement='top'>
                                    <IconButton aria-label={`remove gateway access for node, ${node.name}.`} onClick={() => handleRemoveGateway(node)}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title={!isLinux(node.os) ? `THIS FEATURE IS ONLY SUPPORTED ON LINUX NODES` : `MAKE ${node.name} AN EGRESS GATEWAY NODE?`} placement='top'>
                                    <span><IconButton aria-label={`make node, ${node.name}, a gateway`} onClick={() => handleOpening(node)} disabled={node.ispending === "yes" || !isLinux(node.os)}>
                                        <AccountTree />
                                    </IconButton></span>
                                </Tooltip>
                                }
                                { node.isingressgateway === "yes" ? 
                                    <Tooltip title={`REMOVE INGRESS GATEWAY for ${node.name}?`} placement='top'>
                                        <span><IconButton aria-label={`remove ingress gateway access for node, ${node.name}.`} onClick={() => handleRemoveIngress(node)}>
                                            <RemoveFromQueue />
                                        </IconButton></span>
                                    </Tooltip> :
                                    <Tooltip title={!isLinux(node.os) ? `THIS FEATURE IS ONLY SUPPORTED ON LINUX NODES` : `MAKE ${node.name} AN INGRESS GATEWAY NODE?`} placement='top'>
                                        <span><IconButton aria-label={`make node, ${node.name}, an ingress gateway`} onClick={() => handleCreateIngress({...node})} disabled={node.ispending === "yes" || !isLinux(node.os)}>
                                            <AddToQueue />
                                        </IconButton></span>
                                    </Tooltip>
                                }
                                {
                                    node.isrelay === "yes" ?
                                    <Tooltip title={`REMOVE RELAY from ${node.name}?`} placement='top'>
                                        <IconButton aria-label={`remove relay server status for node, ${node.name}.`} onClick={() => handleRemoveRelay(node)}>
                                            <LeakRemove />
                                        </IconButton>
                                    </Tooltip> : 
                                    <Tooltip title={`MAKE RELAY from ${node.name}?`} placement='top'>
                                        <IconButton aria-label={`make relay from ${node.name}?`} onClick={() => handleOpenRelay({...node})} disabled={node.ispending === "yes"}>
                                            <MultilineChart />
                                        </IconButton>
                                    </Tooltip> 
                                }
                            </Grid>
                            {displayedNodeFields.map((fieldName) => (
                                <Grid key={fieldName + ':' + i} item className={classes.cell} xs={fieldName === displayedNodeFields[0] || (node.isegressgateway === "yes" && fieldName === displayedNodeFields[2])? 10 : 10} md={3}>
                                    <TextField
                                            id="filled-full-width"
                                            label={Util.NODE_DISPLAY_NAMES[fieldName]}
                                            placeholder={fieldName === displayedNodeFields[2] ? Util.timeConverter(node[fieldName]) : node[fieldName]}
                                            fullWidth
                                            disabled
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            variant="outlined"
                                        />
                                </Grid>
                            ))}
                            {node.ispending === "yes" ? 
                            <Grid item xs={12} md={1}>
                                <Tooltip title='APPROVE' placement='top'>
                                    <IconButton aria-label={`approve node ${node.name}`} onClick={() => approveNode(node.network, node.macaddress, node.name)}>
                                        <CheckBox />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            : null}
                            {node.isegressgateway === "yes" ? 
                            <Grid item xs={1} md={1}>
                                <Tooltip title={`${node.name} IS AN EGRESS GATEWAY`} placement='top'>
                                    <LowPriority className={classes.gateway} />
                                </Tooltip>
                            </Grid>
                            : null}
                            {node.isingressgateway === "yes" ? 
                            <Grid item xs={1} md={1}>
                                <Tooltip title={`${node.name} IS AN INGRESS GATEWAY`} placement='top'>
                                    <SettingsInputAntenna className={classes.gateway} />
                                </Tooltip>
                            </Grid>
                            : null}
                            {node.isrelay === "yes" ? 
                            <Grid item xs={1} md={1}>
                                <Tooltip title={`${node.name} IS RELAYING`} placement='top'>
                                    <MultilineChart className={classes.gateway} />
                                </Tooltip>
                            </Grid>
                            : null}
                        </Grid>
                    </CardContent>
                </Card> )
            : <div className={classes.nodeTitle}><h3>There are no nodes...</h3></div>
            }
            </Grid>
        </Grid>
    )
}
