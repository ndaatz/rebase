require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { color, bgcolor } = require('./lib/color')
const colors = require('colors')
const figlet = require('figlet')
const readline = require("readline")
const PairingCode = true
const PhoneNumber = require('awesome-phonenumber')
const { uncache, nocache } = require('./lib/loader')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: HyuuConnect, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@WhiskeySockets/Baileys")
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
  });
  return new Promise((resolve) => {
rl.question(text, resolve)
  })
};
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

require('./Hyuu.js')
nocache('../Hyuu.js', module => console.log(color(`'${module}'`, 'green'), 'Updated'))
require('./main.js')
nocache('../main.js', module => console.log(color(`'${module}'`, 'green'), 'Updated'))

console.log(color(figlet.textSync(`HyuuYT5`, {
font: 'Standard',
horizontalLayout: 'default',
vertivalLayout: 'default',
whitespaceBreak: false
}), 'aqua'))

async function startMd() {
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const Hyuu = HyuuConnect({
logger: pino({
level: 'silent'
}),
printQRInTerminal: !PairingCode,
auth: state,
browser: ['Chrome (Linux)', '', '']
});
if(PairingCode && !Hyuu.authState.creds.registered) {
		const phoneNumber = await question('Masukan Nomer Yang Aktif Awali Dengan 62:\n');
		const code = await Hyuu.requestPairingCode(phoneNumber.trim())
		console.log(`Masukin Nih Code Nya: ${code}`)
}

    store.bind(Hyuu.ev)

    Hyuu.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!Hyuu.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            if (mek.key.id.startsWith('FatihArridho_')) return
            m = smsg(Hyuu, mek, store)
            require("./Hyuu")(Hyuu, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })

   
    Hyuu.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    Hyuu.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = Hyuu.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })
    
    // WELCOME & LEAVE
Hyuu.ev.on('group-participants.update', async (anu) => {
console.log(anu)
try {
let metadata = await Hyuu.groupMetadata(anu.id)
let participants = anu.participants
let nameUser = await Hyuu.getName(anu.id)
const groupName = metadata.subject
const groupDesc = metadata.desc
let mem = metadata.participants.length
for (let num of participants) {
try {
ppuser = await Hyuu.profilePictureUrl(anu.id, 'image')
} catch {
ppuser = 'https://tinyurl.com/yx93l6da'
}
try {
ppgroup = await Hyuu.profilePictureUrl(anu.id, 'image')
} catch {
ppgroup = 'https://tinyurl.com/yx93l6da'
}
if (anu.action == 'add') {
let wel = `Hii @${num.split("@")[0]},\nWelcome To ${groupName}`
Hyuu.sendMessage(anu.id, {
                    document: fs.readFileSync('./media/doc.pdf'), 
                    jpegThumbnail: fs.readFileSync('./media/quoted.jpg'),
                    mimetype: 'application/pdf',
                    fileLength: 99999,
                    pageCount: '100',
                    fileName: `${fake}`,
                    caption: wel,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `© Welcome Message`,
                            body: `${namaowner}`,
                            thumbnailUrl: 'https://telegra.ph/file/280baeab1205c07e8e8fa.jpg',
                            sourceUrl: global.link,
                            mediaType: 1,
                            renderLargerThumbnail: true
                    }}})
} else if (anu.action == 'remove') {
let txtLeft = `GoodBye @${num.split("@")[0]} 👋\nLeaving From ${groupName}`
Hyuu.sendMessage(anu.id, {
                    document: fs.readFileSync('./media/doc.pdf'), 
                    jpegThumbnail: fs.readFileSync('./media/quoted.jpg'),
                    mimetype: 'application/pdf',
                    fileLength: 99999,
                    pageCount: '100',
                    fileName: `${fake}`,
                    caption: txtLeft,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `© GoodBye Message`,
                            body: `${namaowner}`,
                            thumbnailUrl: 'https://telegra.ph/file/9e5a54491b4b8c1d908ed.jpg',
                            sourceUrl: global.link,
                            mediaType: 1,
                            renderLargerThumbnail: true
                    }}})
} else if (anu.action == 'promote') {
let a = `Congratulations @${num.split("@")[0]}, on being promoted to admin of this group ${metadata.subject} 🎉`
Hyuu.sendMessage(anu.id, {
                    document: fs.readFileSync('./media/doc.pdf'), 
                    jpegThumbnail: fs.readFileSync('./media/quoted.jpg'),
                    mimetype: 'application/pdf',
                    fileLength: 99999,
                    pageCount: '100',
                    fileName: `${fake}`,
                    caption: a,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `Promoted In ${groupName}`,
                            body: `${namaowner}`,
                            thumbnailUrl: 'https://telegra.ph/file/86ad0204ef43dc2361bcb.jpg',
                            sourceUrl: global.link,
                            mediaType: 1,
                            renderLargerThumbnail: true
                    }}})
} else if (anu.action == 'demote') {
let a = `Congratulations @${num.split("@")[0]}, on being promoted to admin of this group ${metadata.subject} 🎉`
Hyuu.sendMessage(anu.id, {
                    document: fs.readFileSync('./media/doc.pdf'), 
                    jpegThumbnail: fs.readFileSync('./media/quoted.jpg'),
                    mimetype: 'application/pdf',
                    fileLength: 99999,
                    pageCount: '100',
                    fileName: `${fake}`,
                    caption: a,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            title: `Demoted In ${groupName}`,
                            body: `${namaowner}`,
                            thumbnailUrl: 'https://telegra.ph/file/656ebb4dc109a9e76167d.jpg',
                            sourceUrl: global.link,
                            mediaType: 1,
                            renderLargerThumbnail: true
                    }}})
}
}
} catch (err) {
console.log("Eror Di Bagian Welcome Group "+err)
}
})

    Hyuu.getName = (jid, withoutContact = false) => {
        id = Hyuu.decodeJid(jid)
        withoutContact = Hyuu.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = Hyuu.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === Hyuu.decodeJid(Hyuu.user.id) ?
            Hyuu.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    Hyuu.public = true

    Hyuu.serializeM = (m) => smsg(Hyuu, m, store)

    Hyuu.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        try {
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode
                if (reason === DisconnectReason.badSession) {
                    console.log(`Bad Session File, Please Delete Session and Scan Again`);
                    startMd()
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log("Connection closed, reconnecting....");
                    startMd();
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log("Connection Lost from Server, reconnecting...");
                    startMd();
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                    startMd()
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(`Device Logged Out, Please Scan Again And Run.`);
                    startMd();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log("Restart Required, Restarting...");
                    startMd();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log("Connection TimedOut, Reconnecting...");
                    startMd();
                } else Hyuu.end(`Unknown DisconnectReason: ${reason}|${connection}`)
            }
            if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
                console.log(`[Sedang mengkoneksikan]`)
            }
            if (update.connection == "open" || update.receivedPendingNotifications == "true") {
                console.log(`[Connecting to] WhatsApp web`)
                console.log(`[Connected] ` + JSON.stringify(Hyuu.user, null, 2))
            }

        } catch (err) {
            console.log('Error Di Connection.update ' + err)
            startMd();
        }

    })

    Hyuu.ev.on('creds.update', saveCreds)

    Hyuu.sendText = (jid, text, quoted = '', options) => Hyuu.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    Hyuu.sendTextWithMentions = async (jid, text, quoted, options = {}) => Hyuu.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    Hyuu.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await Hyuu.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    Hyuu.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await Hyuu.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    Hyuu.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    Hyuu.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    return Hyuu
}

startMd()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})