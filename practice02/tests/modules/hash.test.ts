import { describe, expect, it } from 'vitest'
import { hashModule } from '../../src/project/modules'

describe('Test hash module', () => {
  const password = 'kdsanadssajndsakjdnajkl233982399309'

  it('must generate a hash', () => {
    const hash = hashModule.generate(password)
    expect(hash).toBeTypeOf('string')
    expect(hash !== password).toEqual(true)
  })

  it('must compare an input with a hash generated from input', () => {
    const hash = hashModule.generate(password)
    expect(hashModule.compare(password, hash)).toEqual(true)
  })

  it('must compare an input with a hash generated from other string', () => {
    const hash = hashModule.generate(password)
    expect(hashModule.compare('other string', hash)).toEqual(false)
  })
})
