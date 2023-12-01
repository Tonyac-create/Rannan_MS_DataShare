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
        @Payload() data: { enum: string, name: string, value: string, user_id: number }
    ): Promise<any> {
        const newData = await this.dataService.createData(data)
        return newData
    }

    @MessagePattern('removeData')
    async removeData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            await this.dataService.removeData(dataId)
        } catch (error) {
            console.log("error :", error);
        }
    }

    @MessagePattern('getOneData')
    async getOneData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            const datas = await this.dataService.getOneDataById(dataId)
            return datas
        } catch (error) {
            console.log("error :", error);
        }
    }

    @MessagePattern('getAllDatasOneUser')
    async getAllDatasOneUser(
        @Payload() user_id: number
    ): Promise<any> {
        try {
            const datas = await this.dataService.getAllDatasOneUser(user_id)
            return datas
        } catch (error) {
            console.log("error :", error);
        }
    }

    @MessagePattern('updateData')
    async updateData(
        @Payload() dataId: string
    ): Promise<any> {
        try {
            const data = await this.dataService.updateData(dataId)
            console.log("🚀 ~ file: data.controller.ts:60 ~ DataController ~ dataId:", dataId)
            // console.log("🚀 ~ file: data.controller.ts:60 ~ DataController ~ data:", data)
            return data
        } catch (error) {
            console.log("error :", error);
        }
    }
}

