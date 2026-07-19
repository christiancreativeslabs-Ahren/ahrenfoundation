import type { DB as BaseDB } from "./drizzle.base";
import type { DB as TransactionDB } from "./drizzle.transaction";

export type appDB = BaseDB | TransactionDB;
