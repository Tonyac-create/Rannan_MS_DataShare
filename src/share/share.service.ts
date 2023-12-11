import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Share, ShareDocument } from './schemas/share.schema';
import { Model } from 'mongoose';
import { Data, DataDocument } from 'src/data/schemas/data.schema';
import { error } from 'console';
import { CreateShareDto } from 'src/share/dtos/createShare.dto';
import { RpcException } from '@nestjs/microservices';
const { ObjectId } = require('mongodb')


type GetShareParams = {
    user: number
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
    async allShares(): Promise<Share[]> {
        try {
            return this.shareModel.find({})
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des shares')
        }
    }

    // Récupérer une share
    async getOneShare(id: string): Promise<Share> {
        try {
            const share = this.shareModel.findById({ _id: id })
            return share
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération de la share')
        }
    }

    // Suppression d'une share entière
    async removeShare(share_id: any): Promise<void> {
        try {
            await this.shareModel.findByIdAndDelete(share_id)
        } catch (error) {
            throw new RpcException('Erreur lors de la suppression de la share')
        }
    }

    // Suppression d'une data dans share et de share dans data
    async removeDataInShare(share_id: { id: string, data_id: string }): Promise<any> {
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

                // Supprime la data de la share existante
                await this.shareModel.findOneAndUpdate(
                    { _id: share_id.id },
                    { $pull: { datas: dataFind._id } },
                    { new: true })
            }
        } catch (error) {
            throw new RpcException('Erreur lors de la suppression de la data dans share')
        }


    }

    // Création d'une data
    async createShare(share: CreateShareDto)
        : Promise<Share> {
        try {
            // Cherche et vérifie si la data exist
            const data = await this.dataModel.findOne({ _id: share.data_id })
            if (!data) {
                throw new Error('Data not found');
            }
            // Récupère toute les shares
            const allShare = await this.allShares()

            let shareId: any
            let shareFind: any
            let shareGet: any

            // Cherche si share existante
            allShare.filter(async (shareElement: any) => {
                shareFind = shareElement.target_id === share.target_id && shareElement.owner_id === share.owner_id
                // Si une share existe, récupération id share et objet share
                if (shareFind === true) {
                    shareId = shareElement._id
                    shareGet = shareElement
                    shareGet.datas.push(share.data_id);
                    await shareGet.save()
                }
            })

            // si pas de share existante
            if (shareFind === false) {
                console.log("!sharefind");

                const newShare = await this.shareModel.create({
                    target: share.target,
                    target_id: share.target_id,
                    owner_id: share.owner_id,
                    datas: [share.data_id]
                })
                return newShare
            }
        } catch (error) {
            throw new RpcException('Erreur lors de la création de la share')
        }
    }

    // Récupérer la liste des users avec qui on paratge des datas
    async getListUsersShare(params: GetShareParams): Promise<Share[]> {
        try {
            const shares = this.shareModel.find({ owner_id: params.user, target: params.target })
            return shares
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des utilisateurs')
        }
    }

    // Récupérer les shares entre le user connecté et un(ou des) user(s)
    async getShares(body: { target: string, target_id: number }): Promise<Share[]> {
        try {
            const share = this.shareModel.find({ target: body.target, target_id: body.target_id })
            return share
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des shares')
        }
    }

    // Récupérer les shares entre un user et user connecté
    async getSharesBetweenUsers(body: { userId_profile: any, user_id: any }): Promise<Share[]> {
        try {
            const shares = this.shareModel.find({ owner_id: body.userId_profile.userId_profile, target_id: body.user_id })
            return shares
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des shares avec user_profile')
        }
    }
}
