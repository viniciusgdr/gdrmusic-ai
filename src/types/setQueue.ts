import { Queue } from '@gdrmusic/models/music';
import { Dispatch, SetStateAction } from 'react';

export type SetQueue = Dispatch<SetStateAction<Queue[]>>