import EventEmitter from 'events';
import log from 'electron-log';
import { main } from './config/config';

export const LivePeerAPI = () => new EventEmitter({ config: main, log });
