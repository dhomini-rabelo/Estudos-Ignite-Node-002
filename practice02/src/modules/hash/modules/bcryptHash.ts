import { IHashModule } from '../contract'
import bcrypt from 'bcrypt'

export class BCryptHashModule implements IHashModule {
  protected readonly saltRounds = 7

  generate(input: string): string {
    return bcrypt.hashSync(input, this.saltRounds)
  }

  compare(input: string, hashForCompare: string): boolean {
    return bcrypt.compareSync(input, hashForCompare)
  }
}
