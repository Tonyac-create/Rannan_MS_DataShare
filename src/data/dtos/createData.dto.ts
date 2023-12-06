import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateDataDto{

    @IsNotEmpty()
    @IsNumber()
    user_id: number

    @IsString()
    type :string

    @IsString()
    name: string

    @IsString()
    value: string
}