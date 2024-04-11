import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data, DataDocument } from './schemas/data.schema';
import { Model } from 'mongoose';
import { CreateDataDto } from './dtos/createData.dto';
import { RpcException } from '@nestjs/microservices';
import { error } from 'console';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(Data.name)
    private dataModel: Model<DataDocument>,
  ) {}

  // Création d'une data
  async createData(data: CreateDataDto): Promise<Data> {
    try {
      const newdata = await this.dataModel.create(data);
      console.log('🚀 ~ DataService ~ createData ~ newdata:', newdata);
      return newdata;
    } catch (error) {
      throw new RpcException({
        status: 'error',
        message: 'Erreur lors de la création',
        detail: error,        
      });
    }
  }

  // Suppression d'une data
  async removeData(_id: string): Promise<void> {
    try {
      const dataToRemoved = await this.dataModel.findByIdAndDelete(_id);
      if (!dataToRemoved) {
        throw new error();
      }
    } catch (error) {
      throw new RpcException('Data inexistante');
    }
  }

  // Récupérer une data par son id
  async getOneDataById(_id: string): Promise<Data> {
    try {
      const data = await this.dataModel.findOne({ _id });
      return data;
    } catch (error) {
      throw new RpcException('Data inexistante');
    }
  }

  // Récupérer les datas d'un user
  async getAllDatasOneUser(user_id: number): Promise<Data[]> {
    try {
      return await this.dataModel.find({ user_id });
    } catch (error) {
      throw new RpcException('Datas inexistantes');
    }
  }

  // Modifier une data
  async updateData(data: {
    _id: string;
    type: string;
    name: string;
    value: string;
  }): Promise<Data> {
    try {
      // console.log("🚀 ~ file: data.service.ts:44 ~ DataService ~ updateData ~ data:", data)
      return await this.dataModel.findOneAndUpdate(
        { _id: data._id },
        { type: data.type, name: data.name, value: data.value },
        { new: true },
      );
    } catch (error) {
      throw new RpcException('Erreur lors de la mise à jour de la data');
    }
  }
}
