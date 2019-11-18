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
import { Station } from "./Station";

// Output entity
@Entity()
class Output {

    // internal
    @PrimaryColumn({ type:"integer", select: true })
    @Generated()
    id: number;
    @Column({ select: true, unique: true })
    code: string;
    @Column({ select: true })
    keys: string;

    // Output fields
    @Column({ select: true})
    name: string;
    @Column({ select: true})
    description: string;
    @Column({ select: true })
    state: boolean;

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
    @ManyToOne(type => Station, station => station.outputs, { cascade: true })
    station: Station;

    // safety
    @CreateDateColumn({ select: true })
    created: number;
    @UpdateDateColumn({ select: true })
    modified: number;

}

// export
export { Output };
