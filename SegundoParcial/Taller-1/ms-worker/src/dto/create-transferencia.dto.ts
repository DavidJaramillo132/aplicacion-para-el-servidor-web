import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateTransferenciaDto {
  @IsNumber()
  cuentaOrigenId: number;

  @IsNumber()
  cuentaDestinoId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  monto: number;
}
