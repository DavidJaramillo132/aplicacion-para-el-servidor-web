import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { Dispositivo } from './entities/dispositivo.entity';
import { Repository } from 'typeorm';
export declare class DispositivosService {
    private disppositivoRepository;
    constructor(disppositivoRepository: Repository<Dispositivo>);
    create(createDispositivoDto: CreateDispositivoDto): Promise<Dispositivo>;
    findAll(): Promise<Dispositivo[]>;
    findOne(id: string): Promise<Dispositivo>;
    update(id: string, updateDispositivoDto: UpdateDispositivoDto): Promise<Dispositivo | null>;
    remove(id: string): Promise<void>;
}
