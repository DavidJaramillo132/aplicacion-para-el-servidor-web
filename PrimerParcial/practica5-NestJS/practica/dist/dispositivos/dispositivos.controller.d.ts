import { DispositivosService } from './dispositivos.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
export declare class DispositivosController {
    private readonly dispositivosService;
    constructor(dispositivosService: DispositivosService);
    create(createDispositivoDto: CreateDispositivoDto): Promise<import("./entities/dispositivo.entity").Dispositivo>;
    findAll(): Promise<import("./entities/dispositivo.entity").Dispositivo[]>;
    findOne(id: string): Promise<import("./entities/dispositivo.entity").Dispositivo>;
    update(id: string, updateDispositivoDto: UpdateDispositivoDto): Promise<import("./entities/dispositivo.entity").Dispositivo | null>;
    remove(id: string): Promise<void>;
}
