import { Controller, Get } from '@nestjs/common';
import { ShareService } from './share.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { Share } from './schemas/share.schema';
import { Data } from 'src/data/schemas/data.schema';
import { CreateShareDto } from 'src/share/dtos/createShare.dto';
import { error } from 'console';

@Controller()
export class ShareController {
    constructor(
        private readonly shareService: ShareService,
        private readonly dataService: DataService
    ) { }

    @MessagePattern('createShare')
    async createShare(
        @Payload() share: CreateShareDto
    ): Promise<Share> {
        try {
            const newShare = await this.shareService.createShare(share)
            return newShare
        } catch (error) {
            throw new RpcException('Erreur lors de la création de la share')
        }
    }

    @MessagePattern('getOneShare')
    async getShare(
        @Payload() users: {owner_id: number, target_id: number}
    ): Promise<Share> {
        console.log("🚀 ~ ShareController ~ _id:", users)
        try {
            const shareFind = await this.shareService.getOneShare(users)
            if (!shareFind) {
                throw new Error("Share don't exist")
            }
            return shareFind
        } catch (error) {
            throw new RpcException('Erreur lors de la lecture de la share')
        }
    }

    @MessagePattern('removeShare')
    async removeShare(
        @Payload() share_id: string
    ): Promise<void> {
        try {
            await this.shareService.removeShare(share_id)
        } catch (error) {
            throw new RpcException('Erreur lors de la suppression de la share')
        }
    }

    @MessagePattern('removeDataInShare')
    async removeDataInShare(
        @Payload() share_id: { share_id: string, data_id: string }
    ): Promise<any> {
        try {
            return await this.shareService.removeDataInShare(share_id)
        } catch (error) {
            throw new RpcException('Erreur lors de la suppression de la data dans share')
        }
    }

    @MessagePattern('getAllShares')
    async getAllShares(): Promise<void> {
        try {
            const shares = await this.shareService.allShares()
        } catch (error) {
            throw new RpcException('Erreur lors de la lecture des shares')
        }
    }

    @MessagePattern('getListUsers')
    async getListUsersShare(
        @Payload() body: { user: number, target: string }
    ): Promise<Number[]> {
        try {
            const shares = await this.shareService.getListUsersShare(body)
            // Récupération des ids (target-id) des users avec qui userconnecté partage des informations
            const usersToShare = shares.map((share) => share.target_id)
            return usersToShare
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des utilisateurs')
        }
    }

    @MessagePattern('getShares')
    async getShares(
        // Récupération d'une partie des datas(non pris en compte type)
        @Payload() shareObjet: { owner_id: number, target: string, target_id: number }
    ): Promise<any> {
        try {
            const share: any = await this.shareService.getShares(shareObjet)
            const idShare = share[0]._id.toString()
            
            const shareFind: any[] = share.filter((share) => {
                return share.owner_id === shareObjet.owner_id && share.target_id === shareObjet.target_id
            })

            const usersToShareIds: string[] = shareFind.flatMap((share: any) => share.datas.map((data: any) => data.toString()))

            const dataObjects = await Promise.all(usersToShareIds.map(async (data_id: any) => {
                const data: any = await this.dataService.getOneDataById(data_id)
                const id = data._id
                const name = data.name
                const value = data.value
                
                return { idShare, id, name, value }
            }))
            return dataObjects
        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des shares')
        }
    }

    @MessagePattern('getSharesBetweenUsers')
    async getSharesBetweenUsers(
        @Payload() list: any
    ): Promise<Data[]> {
        try {
            const share: any = await this.shareService.getSharesBetweenUsers(list)
            // console.log("🚀 ~ file: share.controller.ts:113 ~ ShareController ~ share:", share)
            const usersToShareIds: string[] = share.flatMap((share) => share.datas.map((data: any) => data.toString()))
            const dataObjects = await Promise.all(usersToShareIds.map(async (data_id: any) => {
                // console.log("🚀 ~ file: share.controller.ts:90 ~ ShareController ~ dataObjects ~ data_id:", data_id)
                const data = await this.dataService.getOneDataById(data_id)
                return data
            }))
            // console.log("🚀 ~ file: share.controller.ts:93 ~ ShareController ~ dataObjects ~ dataObjects:", dataObjects)
            let dataList = []
            dataObjects.map((data: any) => {
                const id = data._id
                // console.log("🚀 ~ file: share.controller.ts:131 ~ ShareController ~ dataObjects.map ~ data:", data)
                const name = data.name
                const value = data.value
                return dataList.push({ id, name, value })
            })
            return dataList

        } catch (error) {
            throw new RpcException('Erreur lors de la récupération des shares avec user_profile')
        }
    }
}
