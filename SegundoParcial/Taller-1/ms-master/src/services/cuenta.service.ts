import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from '../entities/cuenta.entity';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
  ) {}

  async findAll(): Promise<Cuenta[]> {
    return this.cuentaRepository.find();
  }

  async findById(id: number): Promise<Cuenta> {
    return this.cuentaRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Cuenta>): Promise<Cuenta> {
    const cuenta = this.cuentaRepository.create(data);
    return this.cuentaRepository.save(cuenta);
  }

  /**
   * Debit money from account
   * Used when transferencia is created (money leaves this account)
   */
  async debit(cuentaId: number, monto: number): Promise<Cuenta> {
    const cuenta = await this.findById(cuentaId);
    if (!cuenta) {
      throw new Error(`Cuenta con ID ${cuentaId} no encontrada`);
    }
    if (cuenta.saldo < monto) {
      throw new Error(`Saldo insuficiente. Disponible: ${cuenta.saldo}, Solicitado: ${monto}`);
    }
    cuenta.saldo = Number((Number(cuenta.saldo) - monto).toFixed(2));
    return this.cuentaRepository.save(cuenta);
  }

  /**
   * Credit money to account
   * Used when transferencia is completed (money arrives at this account)
   */
  async credit(cuentaId: number, monto: number): Promise<Cuenta> {
    const cuenta = await this.findById(cuentaId);
    if (!cuenta) {
      throw new Error(`Cuenta con ID ${cuentaId} no encontrada`);
    }
    cuenta.saldo = Number((Number(cuenta.saldo) + monto).toFixed(2));
    return this.cuentaRepository.save(cuenta);
  }

  /**
   * Get account by numero (account number)
   */
  async findByNumero(numero: string): Promise<Cuenta> {
    return this.cuentaRepository.findOne({ where: { numero } });
  }
}
