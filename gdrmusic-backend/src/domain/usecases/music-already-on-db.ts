export interface MusicAlreadyOnDB {
  check: (id: string, PATH: string) => Promise<boolean>
}
