import { Controller, Delete, Param } from '@nestjs/common';
import { DataService } from './data.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('data')
export class DataController {
    constructor(
        private readonly dataService: DataService
    ) { }

    @MessagePattern('createData')
    async createData(
        @Payload() data: { enum: string, name: string, value: string, user_id: any }
    ): Promise<any> {
        try {
            await this.dataService.createData(data)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('removeData')
    async removeData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            await this.dataService.removeData(dataId)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getOneData')
    async getOneData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            const data = await this.dataService.getOneDataById(dataId)
            console.log("🚀 ~ file: data.controller.ts:41 ~ DataController ~ data:", data)
            if (!data) {
                throw new Error("Data inexistante")
            }
            return data
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getAllDatasOneUser')
    async getAllDatasOneUser(
        @Payload() user_id: number
    ): Promise<any> {
        try {
            const datas = await this.dataService.getAllDatasOneUser(user_id)
            console.log("🚀 ~ file: data.controller.ts:57 ~ DataController ~ datas:", datas)
            if (!datas) {
                throw new Error("No datas")   
            }
            return datas
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('updateData')
    async updateData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            if (!dataId) {
                throw new Error("data not found")
            }
            const data = await this.dataService.updateData(dataId)
            return data
        } catch (error) {
            throw error
        }
    }
}

