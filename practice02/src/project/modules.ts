import { IHashModule } from '../modules/hash/contract'
import { BCryptHashModule } from '../modules/hash/modules/bcryptHash'

export const hashModule: IHashModule = new BCryptHashModule()
