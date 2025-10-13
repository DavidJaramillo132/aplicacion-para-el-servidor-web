"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDispositivoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dispositivo_dto_1 = require("./create-dispositivo.dto");
class UpdateDispositivoDto extends (0, mapped_types_1.PartialType)(create_dispositivo_dto_1.CreateDispositivoDto) {
}
exports.UpdateDispositivoDto = UpdateDispositivoDto;
//# sourceMappingURL=update-dispositivo.dto.js.map