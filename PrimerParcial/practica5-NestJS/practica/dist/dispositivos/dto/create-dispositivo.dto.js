"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDispositivoDto = void 0;
const types_1 = require("util/types");
class CreateDispositivoDto {
    nombre;
    tipo;
    valor;
}
exports.CreateDispositivoDto = CreateDispositivoDto;
__decorate([
    (0, types_1.isStringObject)(),
    __metadata("design:type", String)
], CreateDispositivoDto.prototype, "nombre", void 0);
__decorate([
    (0, types_1.isStringObject)(),
    __metadata("design:type", String)
], CreateDispositivoDto.prototype, "tipo", void 0);
__decorate([
    (0, types_1.isNumberObject)(),
    Min(1),
    __metadata("design:type", Number)
], CreateDispositivoDto.prototype, "valor", void 0);
//# sourceMappingURL=create-dispositivo.dto.js.map