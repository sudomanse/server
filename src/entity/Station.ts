// import metadata
import "reflect-metadata";
// import typeorm
import {
    Column,
    CreateDateColumn,
    Entity,
    UpdateDateColumn,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
    BeforeInsert, JoinTable
} from "typeorm";

// models
import { User } from "./User";
import { Input } from "./Input";
import { Output } from "./Output";
import { Logger } from "../Logger";

// Station entity
@Entity()
class Station {

    // internal
    @PrimaryGeneratedColumn({ type:"integer" })
    id: number;
    // @Column({ select: true, unique: true })
    @Column({ select: true, unique: true })
    code: string;

    // Station fields
    @Column({ select: true })
    name: string;
    @Column({ select: true })
    description: string;

    // relational
    @ManyToOne(type => User, user => user.ownedStations)
    owner: User;
    @ManyToMany(type => User, user => user.stations)
    @JoinTable()
    users: User[];
    @OneToMany(type => Input, input => input.station)
    inputs: Input[];
    @OneToMany(type => Output, output => output.station)
    outputs: Output[];

    // safety
    @CreateDateColumn({ select: true })
    created: number;
    @UpdateDateColumn({ select: true })
    modified: number;

}

// export
export { Station };