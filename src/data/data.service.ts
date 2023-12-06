import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data, DataDocument } from './schemas/data.schema';
import { Model } from 'mongoose';
import { CreateDataDto } from './dtos/createData.dto';

@Injectable()
export class DataService {
    constructor(
        @InjectModel(Data.name)
        private dataModel: Model<DataDocument>
    ) { }

    // Création d'une data
    async createData(data: CreateDataDto): Promise<void> {
        await this.dataModel.create(data)
    }

    // Suppresion d'une data
    async removeData(dataId: string): Promise<void> {
        const dataToRemoved = await this.dataModel.findByIdAndDelete(dataId)
        if(!dataToRemoved) {
            throw new HttpException(
                'Erreur lors de la suppression de la donnée',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    // Récupérer une data par son id
    async getOneDataById(dataId: string): Promise<Data> {
        console.log("🚀 ~ file: data.service.ts:29 ~ DataService ~ getOneDataById ~ dataId:", dataId)
        return await this.dataModel.findOne({ _id: dataId })
    }

    // Récupérer les datas d'un user
    async getAllDatasOneUser(user_id: number): Promise<Data[]> {
        const datas = await this.dataModel.find({ user_id: user_id })
        return datas
    }

    // Modifier une data
    async updateData(id: any): Promise<Data> {
        console.log("🚀 ~ file: data.service.ts:44 ~ DataService ~ updateData ~ id:", id)
        return await this.dataModel.findOneAndUpdate({ _id: id._id }, { typeData: id.typeData, name: id.name, value: id.value }, { new: true })
    }
}
