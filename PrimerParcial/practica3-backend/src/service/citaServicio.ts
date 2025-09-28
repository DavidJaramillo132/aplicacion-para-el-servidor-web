import { IContratoCita } from "../domain/contratoCita";
import { ICita } from "../domain/cita";
import { ICliente } from "../domain/cliente";
import { v4 as uuidv4 } from "uuid";

const id = uuidv4();
export class CitaService {
    constructor(private contrato: IContratoCita) { }


    // CREATE con validación
    async agendar(cliente: ICliente, servicio: string, fecha: Date, tiempoEstimado: number, estado: 'pendiente'): Promise<ICita> {
        const citas = await this.contrato.list();

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula latencia de 2 segundos

        if (citas.some(c => c.fecha.getTime() === fecha.getTime())) {
            throw new Error("Horario ocupado");
        }
        let cita: ICita = {
            id: uuidv4(),
            clienteID: cliente.id,
            fecha,
            servicio,
            tiempoEstimado: tiempoEstimado.toString(),
            estado
        }
        return this.contrato.create(cita);
    }

    async listar(): Promise<ICita[]> {
        try {
            console.log("Consultando listado completo de citas...");
            const citas = await this.contrato.list();
            console.log(`Se encontraron ${citas.length} citas`);
            return citas;
        } catch (error) {
            console.error("Error al listar citas:", error);
            throw new Error("No se pudieron obtener las citas");
        }
    }

    async cancelar(id: string): Promise<ICita> {
        return this.contrato.findById(id)
            .then((cita: ICita | null) => {

                if (!cita) {
                    throw new Error("Cita no encontrada");
                }

                // Actualización parcial
                return this.contrato.update({
                    ...cita,
                    estado: "cancelada"
                });
            })
            .then((citaActualizada: ICita) => {
                console.log("Cita cancelada:", citaActualizada.id);
                return citaActualizada;
            })
            .catch((error: Error) => {
                console.error("Error cancelando cita:", error.message);
                throw error;
            });
    }

    async eliminar(id: string): Promise<boolean> {
        try {
            console.log(`Intentando eliminar cita con ID: ${id}`);

            const citaExistente = await this.contrato.findById(id);
            if (!citaExistente) {
                console.warn(`No se puede eliminar: cita ${id} no existe`);
                return false; 
            }

            await this.contrato.delete(id);
            console.log(`✅ Cita ${id} eliminada exitosamente`);

            return true; 

        } catch (error) {

            console.error(`Error eliminando cita ${id}:`, error);
            return false; 
        }
    }
}
