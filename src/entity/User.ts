// import metadata
import "reflect-metadata";
// import typeorm
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany
} from "typeorm";

// models
import { Station } from "./Station";

// User entity
@Entity()
class User {

    // internal
    @PrimaryGeneratedColumn({ type:"integer" })
    id: number;

    // User fields
    @Column({ select: true, unique: true })
    username: string;
    @Column({ select: false })
    password: string;

    // relational
    @ManyToMany(type => Station, station => station.users)
    @JoinTable()
    stations: Station[];
    @OneToMany(type => Station, station => station.owner)
    ownedStations: Station[];

    // safety
    @CreateDateColumn({ select: true })
    created: number;
    @UpdateDateColumn({ select: true })
    modified: number;

}

// export
export { User };