import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data, DataDocument } from './schemas/data.schema';
import mongoose, { Model } from 'mongoose';
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
            console.log("Data inexistante");
        }
    }

    // Récupérer une data par son id
    async getOneDataById(dataId: string): Promise<Data> {
        return await this.dataModel.findOne({ _id: dataId })
    }

    // Récupérer les datas d'un user
    async getAllDatasOneUser(user_id: number): Promise<Data[]> {
        const datas = await this.dataModel.find({ user_id: user_id })
        return datas
    }

    // Modifier une data
    async updateData(id: any): Promise<Data> {
        return await this.dataModel.findOneAndUpdate({ _id: id._id }, { typeData: id.typeData, name: id.name, value: id.value }, { new: true })
    }
}
