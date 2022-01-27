import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { SyncError } from "./sync-error";
import { SyncUpload } from "./sync-upload";

@Entity()
export class SyncHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  startDate: number;

  @Column()
  endDate: number;

  @OneToMany(() => SyncError, (syncError) => syncError.history)
  errors: SyncError[];

  @OneToMany(() => SyncUpload, (syncUpload) => syncUpload.history)
  uploads: SyncUpload[];
}
