import { AmazonKendraRetriever } from 'langchain/retrievers/amazon_kendra'
import { INode, INodeData, INodeParams, ICommonObject } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

class AmazonKendraRetriever_Retrievers implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'Amazon Kendra Retriever'
        this.name = 'AmazonKendraRetriever'
        this.version = 1.0
        this.type = 'AmazonKendraRetriever'
        this.icon = 'amazonkendraretriever.svg'
        this.category = 'Retrievers'
        this.description = 'Amazon Kendra retriever to retrieve key word search results from the Amzon Kendra index.'
        this.baseClasses = [this.type, ...getBaseClasses(AmazonKendraRetriever)]
        this.credential = {
            label: 'AWS Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['awsApi'],
            optional: true
        }
        this.inputs = [
            {
                label: 'Region',
                name: 'region',
                type: 'options',
                options: [
                    { label: 'us-east-1', name: 'us-east-1' },
                    { label: 'us-east-2', name: 'us-east-2' },
                    { label: 'us-west-2', name: 'us-west-2' },
                    { label: 'eu-west-1', name: 'eu-west-1' },
                    { label: 'eu-west-2', name: 'eu-west-1' },
                    { label: 'ap-south-1', name: 'ap-south-1' },
                    { label: 'ap-southeast-1', name: 'ap-southeast-1' },
                    { label: 'ap-southeast-2', name: 'ap-southeast-2' },
                    { label: 'ap-northeast-1', name: 'ap-northeast-1' }
                ],
                default: 'us-east-1'
            },
            {
                label: 'Index ID',
                name: 'indexId',
                type: 'string'
            },
            {
                label: 'Top K',
                name: 'topK',
                type: 'number',
                default: 5,
                optional: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const iRegion = nodeData.inputs?.region as string
        const topk = nodeData.inputs?.topK as string
        const iTopK = parseInt(topk, 5)
        const iIndexId = nodeData.inputs?.indexId as string

        let credentials = {}
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        if (credentialData && Object.keys(credentialData).length !== 0) {
            const credentialApiKey = getCredentialParam('awsKey', credentialData, nodeData)
            const credentialApiSecret = getCredentialParam('awsSecret', credentialData, nodeData)
            const credentialApiSession = getCredentialParam('awsSession', credentialData, nodeData)
            credentials = {
                accessKeyId: credentialApiKey,
                secretAccessKey: credentialApiSecret,
                sessionToken: credentialApiSession
            }
        }

        const retriever = new AmazonKendraRetriever({
            indexId: iIndexId,
            region: iRegion,
            topK: iTopK,
            clientOptions: credentials
        })

        return retriever
    }
}

module.exports = { nodeClass: AmazonKendraRetriever_Retrievers }