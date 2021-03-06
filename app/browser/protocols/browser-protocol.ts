import fs from 'fs'
import path from 'path'
import { SOURCE_PATH, RESOURCES_PATH } from 'constants/path'

const PROTOCOL_PREFIX = 'mp'
const PREFIX_LENGTH = PROTOCOL_PREFIX.length + 3

const resourceManifest: any = {
  'new-tab': {
    file: path.join(RESOURCES_PATH, 'homescreen.html')
  },
  idlescreen: {
    file: path.join(RESOURCES_PATH, 'idlescreen.html')
  }
}

export function registerBrowserProtocol(protocol: Electron.Protocol) {
  // TODO: don't allow referrer to nest in iframe
  // TODO: deal with resource loading
  protocol.registerFileProtocol(PROTOCOL_PREFIX, (request, callback) => {
    let relativePath = path.normalize(request.url.substr(PREFIX_LENGTH))
    if (relativePath.endsWith('/')) {
      relativePath = relativePath.substr(0, relativePath.length - 1)
    }

    if (resourceManifest.hasOwnProperty(relativePath)) {
      let filePath = resourceManifest[relativePath].file
      callback(filePath)
      return
    }

    callback()
  })
}
