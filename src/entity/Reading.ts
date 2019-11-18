// import metadata
import "reflect-metadata";
// import typeorm
import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    PrimaryColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";

// models
import { Input } from "./Input";

// Reading entity
@Entity()
class Reading {

    // internal
    @PrimaryColumn({ type:"integer", select: true })
    @Generated()
    id: number;

    // Reading fields
    @Column({ select: true })
    reading: number;
    @Column({ select: true })
    time: string;

    // relational
    @ManyToOne(type => Input, input => input.readings, { cascade: true })
    input: Input;

    // safety
    @CreateDateColumn({ select: true })
    created: number;
    @UpdateDateColumn({ select: true })
    modified: number;

}

// export
export { Reading };
