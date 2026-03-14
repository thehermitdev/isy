import { Activity } from '../entities/Activity.js';
import { Repository } from './Repository.js';

export interface ActivityRepository extends Repository<Activity> {}
