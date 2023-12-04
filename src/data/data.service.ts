import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data, DataDocument } from './schemas/data.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class DataService {
    constructor(
        @InjectModel(Data.name)
        private dataModel: Model<DataDocument>
    ) { }

    // Création d'une data
    async createData(data: { enum: string, name: string, value: string, user_id: any }): Promise<any> {
        const user_id = data.user_id.user_id
        data.user_id = user_id
        await this.dataModel.create(data)
    }

    // Suppresion d'une data
    async removeData(dataId: string): Promise<any> {
       await this.dataModel.findByIdAndDelete(dataId)
    }

    // Récupérer une data par son id
    async getOneDataById(dataId: string): Promise<any> {
        const res = await this.dataModel.findOne({ _id: dataId })
        return res
    }

    // Récupérer les datas d'un user
    async getAllDatasOneUser(user_id: number): Promise<any> {
        const datas = await this.dataModel.find({ user_id: user_id })
        return datas
    }

    // Modifier une data
    async updateData(id: any): Promise<any> {
        await this.dataModel.findOneAndUpdate({_id: id._id}, {typeData: id.typeData, name: id.name, value: id.value}, { new: true })
    }
}
