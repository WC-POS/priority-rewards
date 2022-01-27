import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { FPOSTableOptions } from "../types";
import { SyncHistory } from "./sync-history";

@Entity()
export class SyncError {
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

  @ManyToOne(() => SyncHistory, (syncHistory) => syncHistory.errors)
  history: SyncHistory;
}
