import { Controller, Get } from '@nestjs/common';
import { ShareService } from './share.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DataService } from 'src/data/data.service';
import { Share } from './schemas/share.schema';

@Controller('share')
export class ShareController {
    constructor(
        private readonly shareService: ShareService,
        private readonly dataService: DataService
    ) { }

    @MessagePattern('createShare')
    async createShare(
        @Payload() share: { data_id: string, target: string, target_id: number, owner_id: any }
    ): Promise<Share> {
        try {
            const newShare = await this.shareService.createShare(share)
            return newShare
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getOneShare')
    async getShare(
        @Payload() share: any
    ): Promise<Share> {
        try {
            const shareFind = await this.shareService.getOneShare(share)
            console.log("🚀 ~ file: share.controller.ts:30 ~ ShareController ~ shareFind:", shareFind)
            if (!shareFind) {
                throw new Error("Share don't exist")
            }
            return shareFind
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('removeShare')
    async removeShare(
        @Payload() share_id: any
    ): Promise<void> {
        try {
            await this.shareService.removeShare(share_id)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('removeDataInShare')
    async removeDataInShare(
        @Payload() share_id: { id: string, data_id: string }
    ): Promise<void> {
        try {
            await this.shareService.removeDataInShare(share_id)
        } catch (error) {
            throw error
        }
    }

    @Get()
    async getAllShares(): Promise<void> {
        try {
            const shares = await this.shareService.allShares()
            console.log("🚀 ~ file: share.controller.ts:28 ~ ShareController ~ getAllShares ~ shares:", shares)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getListUsers')
    async getListUsersShare(
        @Payload() list: any
    ): Promise<any> {
        try {
            const shares = await this.shareService.getListUsersShare(list)
            console.log("🚀 ~ file: share.controller.ts:28 ~ ShareController ~ getAllShares ~ shares:", shares)
            // Récupération des ids (target-id) des users avec qui userconnecté partage des informations
            const usersToShare: any = shares.map((share) => share.target_id)
            console.log("🚀 ~ file: share.controller.ts:69 ~ ShareController ~ usersToShare:", usersToShare)

            return shares
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getShares')
    async getShares(
        @Payload() list: any
    ): Promise<any> {
        try {
            const share = await this.shareService.getShares(list)
            // console.log("🚀 ~ file: share.controller.ts:28 ~ ShareController ~ getAllShares ~ shares:", share)
            const usersToShareIds: string[] = share.flatMap((share) => share.datas.map((data: any) => data.toString()))
            const dataObjects = await Promise.all(usersToShareIds.map(async (data_id: any) => {
                console.log("🚀 ~ file: share.controller.ts:90 ~ ShareController ~ dataObjects ~ data_id:", data_id)
                const data = await this.dataService.getOneDataById(data_id)
                const id = data_id
                const name = data.name
                const value = data.value
                return { id, name, value }
            }))
            return dataObjects
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getSharesBetweenUsers')
    async getSharesBetweenUsers(
        @Payload() list: any
    ): Promise<any[]> {
        try {
            const share: any = await this.shareService.getSharesBetweenUsers(list)
            console.log("🚀 ~ file: share.controller.ts:113 ~ ShareController ~ share:", share)
            const usersToShareIds: string[] = share.flatMap((share) => share.datas.map((data: any) => data.toString()))
            const dataObjects = await Promise.all(usersToShareIds.map(async (data_id: any) => {
                console.log("🚀 ~ file: share.controller.ts:90 ~ ShareController ~ dataObjects ~ data_id:", data_id)
                const data = await this.dataService.getOneDataById(data_id)
                return data
            }))
            console.log("🚀 ~ file: share.controller.ts:93 ~ ShareController ~ dataObjects ~ dataObjects:", dataObjects)
            let dataList = []
            dataObjects.map((data) => {
                // const id = data._id
                const name = data.name
                const value = data.value
                return dataList.push({ name, value}) // id, 
            })
            console.log("🚀 ~ file: share.controller.ts:94 ~ ShareController ~ dataList:", dataList)
            return dataList
            
        } catch (error) {
            throw error
        }
    }
}
