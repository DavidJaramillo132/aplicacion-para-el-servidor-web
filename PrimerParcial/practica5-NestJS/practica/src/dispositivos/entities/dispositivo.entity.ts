import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

 @Entity()
 export class Dispositivo {

    @PrimaryGeneratedColumn("uuid")
    id:string;
    
    @Column()
    nombre:string;
    
    @Column()
    tipo:string;
    
    @Column()
    valor:number;
}
