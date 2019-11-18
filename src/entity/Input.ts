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
    ManyToOne,
    OneToMany
} from "typeorm";

// models
import { Station } from "./Station";
import { Reading } from "./Reading";

// Input entity
@Entity()
class Input {

    // internal
    @PrimaryColumn({ type:"integer", select: true })
    @Generated()
    id: number;
    @Column({ select: true, unique: true })
    code: string;
    @Column({ select: true })
    keys: string;

    // Input fields
    @Column({ select: true })
    name: string;
    @Column({ select: true })
    description: string;
    @Column({ select: true })
    type: string;

    // mqtt
    @Column({ select: true })
    mqttAddress: string;
    @Column({ select: true })
    mqttTopic: string;
    @Column({ select: true })
    mqttWifiSsid: string;
    @Column({ select: true })
    mqttWifiPassword: string;

    // relational
    @ManyToOne(type => Station, station => station.inputs, { cascade: true })
    station: Station;
    @OneToMany(type => Reading, reading => reading.input)
    readings: Reading[];

    // safety
    @CreateDateColumn({ select: true })
    created: number;
    @UpdateDateColumn({ select: true })
    modified: number;

}

// export
export { Input };
