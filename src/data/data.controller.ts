import { Controller, HttpException, HttpStatus } from '@nestjs/common';
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
            const dataCreated = await this.dataService.createData(data)
            console.log("🚀 ~ DataController ~ dataCreated:", dataCreated)
            return dataCreated
        } catch (error) {
            throw new RpcException({ status: 'error', message: "Erreur lors de la création", detail: error })
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
        try {
            const data = await this.dataService.getOneDataById(dataId)
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

