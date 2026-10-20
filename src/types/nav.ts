export interface NavLink {
  name: 'pickup' | 'yun' | 'k1' | 'k2' | 'anna'
  path: string
  icon: string
}

export interface dataType {
  consignee: string
  ctns: number
  date: string
  delivery: string
  hide: boolean
  no: number
  px: string
  tick: boolean
}