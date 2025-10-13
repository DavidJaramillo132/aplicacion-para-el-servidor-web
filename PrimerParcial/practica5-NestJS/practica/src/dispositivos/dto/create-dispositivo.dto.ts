import { IsNumber, IsString, Min } from "class-validator";

export class CreateDispositivoDto {
    @IsString()
    nombre:string;

    @IsNumber()
    @Min(1)
    valor:number;

    @IsString()
    tipo:string;
}
