import type dispositivo = require("./dispositivo");
import type respuesto = require("./respuesto");
import type servicio = require("./servicio");
import type tecnico = require("./tecnico");

export interface ISoporte {
    id: number;
    detalle: string;
    fecha: Date;
    estado: boolean;
    descripcion: string;
    servicio: servicio.IServicio[];
    dispositivo: dispositivo.IDispositivo[];
    repuesto: respuesto.IRespuesto[];
    tecnico: tecnico.ITecnico[];
}
