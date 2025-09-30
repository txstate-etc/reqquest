import { type FastifyInstanceTyped, HttpError, fileHandler } from 'fastify-txstate'
import { Readable } from 'stream'
import { fileTypeFromStream } from 'file-type'
import { AppRequestService } from '../appRequest/appRequest.service.js'
import { appConfig } from '../internal.js'

export function installDownloadRoutes (app: FastifyInstanceTyped) {
    app.get('/download/:appReqId/:promptKey/*', {
        schema: {
        params: {
            type: 'object',
            properties: {
            appReqId: { type: 'number', description: 'App request id' },
            promptKey: { type: 'string', description: 'Prompt key'},
            '*': { type: 'string', description: 'Route id mapping to prompt checksum for download'}
            },
            required: ['appReqId', 'promptKey', '*']
        }
        }
    }, async (req, reply) => {
        const ctx = await appConfig.getCtx(req)
        const svc = ctx.svc(AppRequestService)
        const appReqData = await svc.getData(req.params.appReqId)
        if (appReqData[req.params.promptKey] == null) throw new HttpError(404)
        const checksum = getChecksumFromPrompt(appReqData[req.params.promptKey], req.params['*'])
        if (checksum == null) throw new HttpError(404)        
        if (!fileHandler.exists(checksum)) throw new HttpError(404)
        const [branch1, branch2] = Readable.toWeb(fileHandler.get(checksum)).tee()
        const [branch3, branch4] = branch1.tee()
        const ftfs = await fileTypeFromStream(Readable.fromWeb(branch2))
        const contentType = ftfs?.mime ?? 'text/plain' 
        let contentLength = 0
        for await (const chunk of branch3) contentLength += chunk.length
        reply.headers({'Content-Type': contentType, 'Content-Length': contentLength, 'Transfer-Encoding': 'chunked'})
        return Readable.fromWeb(branch4)
    })
}

function getChecksumFromPrompt(prompt: any, routePropParams: string): string | null {
    const props = routePropParams.split('/') 
    let obj = prompt
    for (const prop of props) {
        if (!Object.hasOwn(obj, prop)) return null
        obj = obj[prop]
    }
    return (typeof obj === 'string') ? obj : null
}