import { Controller } from '@nestjs/common';
import { DataService } from './data.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Data } from './schemas/data.schema';
import { CreateDataDto } from './dtos/createData.dto';

@Controller()
export class DataController {
    constructor(
        private readonly dataService: DataService
    ) { }

    @MessagePattern('createData')
    async createData(
        @Payload() data: CreateDataDto
    ): Promise<Data> {
        try {
            return await this.dataService.createData(data)
        } catch (error) {
            throw new RpcException('Erreur lors de la création de la data')
        }
    }

    @MessagePattern('removeData')
    async removeData(
        @Payload() _id: string
    ): Promise<void> {
        try {
            await this.dataService.removeData(_id)
        } catch (error) {
            throw new RpcException('Erreur lors de la suppression de la data')
        }
    }

    @MessagePattern('getOneData')
    async getOneData(
        @Payload() dataId: string
    ): Promise<Data> {
        console.log("🚀 ~ file: data.controller.ts:39 ~ DataController ~ dataId:", dataId)
        try {
            const data = await this.dataService.getOneDataById(dataId)
            // if (!data) {
            //     throw new Error('Data inexistante')
            // }
            return data
        } catch (error) {
            throw new RpcException('Erreur lors de la lecture de la data')
        }
    }

    @MessagePattern('getAllDatasOneUser')
    async getAllDatasOneUser(
        @Payload() user_id: number
    ): Promise<Data[]> {
        try {
            const datas = await this.dataService.getAllDatasOneUser(user_id)
            if (!datas) {
                throw new Error("No datas")
            }
            return datas
        } catch (error) {
            throw new RpcException('Erreur lors de la lecture des datas')
        }
    }

    @MessagePattern('updateData')
    async updateData(
        @Payload() data: { _id: string, type: string, name: string, value: string }
    ): Promise<Data> {
        try {
            const updateData = await this.dataService.updateData(data)
            if (!updateData) {
                throw new Error("data not found")
            }
            return updateData
        } catch (error) {
            throw new RpcException('Erreur lors de la mise à jour de la data')
        }
    }
}

