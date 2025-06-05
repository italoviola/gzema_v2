import { Tools } from './api';
import { Part } from './part';

export interface Machine extends Tools {
  notationPattern: number;
  hasBAxis: number;
}

export interface GZemaFile extends Part {
  machine: Machine;
}
