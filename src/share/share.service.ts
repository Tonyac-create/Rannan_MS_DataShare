import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Share, ShareDocument } from './schemas/share.schema';
import { Model } from 'mongoose';
import { Data, DataDocument } from 'src/data/schemas/data.schema';
import { error } from 'console';
import { type } from 'os';
const { ObjectId } = require('mongodb')


type GetShareParams = {
    user_id: number
    target: string
}

@Injectable()
export class ShareService {
    constructor(
        @InjectModel(Share.name)
        private shareModel: Model<ShareDocument>,

        @InjectModel(Data.name)
        private dataModel: Model<DataDocument>
    ) { }

    // Récupération de toutes les shares
    async allShares() {
        return this.shareModel.find({})
    }

    // Récupérer une share
    async getOneShare(id: string) {
        const share = this.shareModel.findById({ _id: id })
        return share
    }

    // Suppression d'une share entière
    async removeShare(share_id: any): Promise<any> {
        const share = await this.shareModel.findById({ _id: share_id })
        // Récupère les datas id dans la share
        const dataIds = share.datas.filter((data) => share.datas)
        // Boucle pour récupérer le ou les ids data pour suppression dans data.shares
        for(const dataId of dataIds) {
            await this.dataModel.findOneAndUpdate(
            { _id: dataId },
            { $pull: { shares: share_id } },
            { new: true })
        }
        // Suppresion de la share en entier
        await this.shareModel.findByIdAndDelete(share_id)
    }
    
    // Suppression d'une data dans share et de share dans data
    async removeDataInShare(share_id: {id: string, data_id: string}): Promise<any> {
        try {
        const dataId = share_id.data_id
        // Récupération de la share
        const share = await this.shareModel.findById({ _id: share_id.id })
        if (!share) {
            throw error
        } else {
            // Récupère les datas id dans la share
            const data_id = share.datas.filter((data) => share.datas)
            // Récupère la data
            const dataFind = await this.dataModel.findById({ _id: dataId })
            // Conversion de l'id reçu en mongoId
            const shareIdObject = new ObjectId(share_id)
            // Cherche et supprime dans le tableau shares de data l'id de la data partagée
            const dataSorted = dataFind.shares.map(async (e) => {
                const test = shareIdObject.equals(e);
                await this.dataModel.findOneAndUpdate(
                    { _id: dataFind._id },
                    { $pull: { shares: shareIdObject } },
                    { new: true })
            })
            // Supprime la data de la share existante
            await this.shareModel.findOneAndUpdate(
                { _id: share_id.id },
                { $pull: { datas: dataFind._id } },
                { new: true })
            
        }
        } catch (error) {
            throw error
        }
        

    }

    // Création d'une data
    async createShare(body: { data_id: string, target: string, target_id: number, owner_id: any }): Promise<any> {
        try {

            const owner_id = body.owner_id.user_id
            body.owner_id = owner_id
            // Cherche et vérifie si la data exist
            const data = await this.dataModel.findOne({ _id: body.data_id });
            if (!data) {
                throw new Error('Data not found');
            }
            // Révupère toute les shares
            const allShare = await this.allShares()

            let shareId: any
            let shareFind: any
            let shareGet: any

            // Cherche si share existante
            const existShare = allShare
                .filter((share) => {
                    shareFind = share.target_id === body.target_id && share.owner_id === body.owner_id
                    // Si une share existe, récupération id share et objet share
                    if (shareFind === true) {
                        shareId = share._id
                        shareGet = share
                    }
                })

            // si pas de share existante
            if (!shareFind) {
                const newShare = await this.shareModel.create({
                    target: body.target,
                    target_id: body.target_id,
                    owner_id: body.owner_id,
                    datas: [body.data_id]
                })

                data.shares.push(newShare._id);
                await data.save()
                // si une share existe
            } else {
                shareGet.datas.push(body.data_id);
                data.shares.push(shareId)
                await shareGet.save()
                await data.save()
            }

        } catch (error) {
            throw error
        }
    }

    // Récupérer la liste des users avec qui on paratge des datas
    async getListUsersShare(params: GetShareParams) {
        const shares = this.shareModel.find({owner_id: params.user_id, target: params.target})
        
        return shares
    }


    // Récupérer les shares entre le user connecté et un(ou des) user(s)
    async getShares(body: {target: any, target_id: any}) {
        const shares = this.shareModel.find({target: body.target, target_id: body.target_id})
        
        return shares
    }

    // Récupérer les shares entre un user et user connecté
    async getSharesBetweenUsers(body: { userId_profile: any, user_id: any}) {
        // console.log("🚀 ~ file: share.service.ts:136 ~ ShareService ~ getSharesBetweenUsers ~ body:", body)
        
        const shares = this.shareModel.find({owner_id: body.userId_profile.userId_profile, target_id: body.user_id})

        return shares
    }
}
