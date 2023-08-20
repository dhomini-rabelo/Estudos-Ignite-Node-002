export interface IHashModule {
  generate(input: string): string
  compare(input: string, hashForCompare: string): boolean
}
