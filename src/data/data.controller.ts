import { Controller, Delete, Param, ValidationPipe } from '@nestjs/common';
import { DataService } from './data.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Data } from './schemas/data.schema';
import { CreateDataDto } from './dtos/createData.dto';

@Controller('data')
export class DataController {
    constructor(
        private readonly dataService: DataService
    ) { }

    @MessagePattern('createData')
    async createData(
        @Payload(new ValidationPipe()) data: CreateDataDto
    ): Promise<void> {
        try {
            await this.dataService.createData(data)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('removeData')
    async removeData(
        @Payload() dataId: string
    ): Promise<void> {
        try {
            await this.dataService.removeData(dataId)
        } catch (error) {
            throw error
        }
    }

    @MessagePattern('getOneData')
    async getOneData(
        @Payload() dataId: string
    ): Promise<Data> {
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
    ): Promise<Data[]> {
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
    ): Promise<Data> {
        try {
            
            const data = await this.dataService.updateData(dataId)
            if (!data) {
                throw new Error("data not found")
            }
            return data
        } catch (error) {
            throw error
        }
    }
}

