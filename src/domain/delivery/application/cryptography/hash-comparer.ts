export abstract class HashComaprer {

  abstract compare(plain: string, hash: string): Promise<boolean>

}