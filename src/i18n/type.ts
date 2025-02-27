export interface LanguageResource {
  header: {
    login: string
    logout: string
    docs: string
    networks: string
    nodes: string
    accessKeys: string
    dns: string
    externalClients: string
    users: string
  }
  breadcrumbs: {
    home: string
    networks: string
    nodes: string
    edit: string
    accessKeys: string
  }
  common: {
    disabled: string
    notFound: string
    version: string
    server: string
    delete: string
    cancel: string
    save: string
    submit: string
    reset: string
    edit: string
  }
  network: {
    allowmanualsignup: string
    networks: string
    addressrange: string
    addressrange6: string
    localrange: string
    displayname: string
    nodeslastmodified: string
    networklastmodified: string
    defaultinterface: string
    defaultlistenport: string
    defaultpostup: string
    defaultpostdown: string
    defaultkeepalive: string
    checkininterval: string
    defaultextclientdns: string
    defaultmtu: string
    isdualstack: string
    defaultsaveconfig: string
    accesskeys: string
    defaultudpholepunch: string
  }
  node: {
    nodes: string
    id: string
    accesskey: string
    lastpeerupdate: string
    keyupdatetimestamp: string
    checkininterval: string
    ispending: string
    action: string
    localrange: string
    isingressgateway: string
    isegressgateway: string
    pullchanges: string
    dnson: string
    isdualstack: string
    ipforwarding: string
    roaming: string
    islocal: string
    isserver: string
    ingressgatewayrange: string
    address: string
    address6: string
    name: string
    listenport: string
    publickey: string
    endpoint: string
    expdatetime: string
    postup: string
    postdown: string
    persistentkeepalive: string
    saveconfig: string
    interface: string
    lastmodified: string
    lastcheckin: string
    macaddress: string
    network: string
    localaddress: string
    egressgatewayranges: string
    allowedips: string
    udpholepunch: string
    isstatic: string
    mtu: string
    relayaddrs: string
    os: string
  }
  login: {
    validation: {
      username: string
      password: string
    }
    label: {
      username: string
      password: string
    }
    header: string
    login: string
    loginFailed: string
  }
}
