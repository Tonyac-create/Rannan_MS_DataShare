import { BadRequestException, Controller, HttpException, HttpStatus } from '@nestjs/common';
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
        @Payload() data: CreateDataDto
    ): Promise<void> {
        try {
            const dataCreated = await this.dataService.createData(data)
        } catch (error) {
            throw new BadRequestException(
                'Something bad happened',
                { cause: new Error(), description: 'Erreur lors de la création de la donnée' })
        }
    }

    @MessagePattern('removeData')
    async removeData(
        @Payload() dataId: string
    ): Promise<void> {
        try {
            await this.dataService.removeData(dataId)
        } catch (error) {
            throw new HttpException(
                'Erreur lors de la suppression de la donnée',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    @MessagePattern('getOneData')
    async getOneData(
        @Payload() dataId: string
    ): Promise<Data> {
        try {
            const data = await this.dataService.getOneDataById(dataId)
            if (!data) {
                throw Error
            }
            return data
        } catch (error) {
            throw new HttpException(
                'Erreur lors de la lecture de la donnée',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
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
            throw new HttpException(
                'Erreur lors de la lecture des données',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    @MessagePattern('updateData')
    async updateData(
        @Payload() dataId: string
    ): Promise<Data> {
        console.log("🚀 ~ file: data.controller.ts:80 ~ DataController ~ dataId:", dataId)
        try {

            const data = await this.dataService.updateData(dataId)
            if (!data) {
                throw new Error("data not found")
            }
            return data
        } catch (error) {
            throw new HttpException(
                'Erreur lors de la mise à jour de la donnée',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}

