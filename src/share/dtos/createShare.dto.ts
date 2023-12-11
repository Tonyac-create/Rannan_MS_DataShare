import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ShareFormatEnum } from "src/enums/share.enum"

export class CreateShareDto{

    @IsNotEmpty()
    @IsString()
    @IsEnum(ShareFormatEnum)
    target: ShareFormatEnum

    @IsNotEmpty()
    @IsNumber()
    target_id: number

    @IsNotEmpty()
    @IsNumber()
    owner_id: number

    @IsNotEmpty()
    @IsNumber()
    data_id: string

    @IsArray()
    @IsString({ each: true })
    datas: string[]
}