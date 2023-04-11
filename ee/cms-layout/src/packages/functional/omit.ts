export function omit<const T extends Object, const K extends keyof T>(object: T, properties: ReadonlyArray<K>): Omit<T, K> {
  const next: Partial<T> = { ...object }

  for (let key of properties) {
    if (key in object) {
      delete next[key]
    } else {
      throw new Error(`Key "${String(key)}" does not exist in object ${JSON.stringify(object)}`)
    }
  }

  return next as Omit<T, K>
}
