import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { FPOSTableOptions } from "../types";
import { SyncHistory } from "./sync-history";

@Entity()
export class SyncUpload {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  table: FPOSTableOptions;

  @Column("uuid")
  fposId: string;

  @Column()
  message: string;

  @Column()
  at: number;

  @ManyToOne(() => SyncHistory, (syncHistory) => syncHistory.uploads)
  history: SyncHistory;
}
