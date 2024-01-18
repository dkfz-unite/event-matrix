export function parseTransform(transformString: string) {
  const translate = transformString.match(/translate\(([^)]+)\)/)
  const scale = transformString.match(/scale\(([^)]+)\)/)

  return {
    translate: translate ? translate[1].split(',').map(Number) : [0, 0],
    scale: scale ? scale[1].split(',').map(Number) : [1, 1],
  }
}
