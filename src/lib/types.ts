export interface Project {
  id: string
  n: string
  e: string
  pct: number
  phN: number
  phase: string
  health: string
  col: string
  cr: string
  tkn: number
  cost: number
  days: number
  term: string
  dom: string
  stack: string
  model: string
  prompts: number
  last: string
  next: string
  todos: number
  ideas: number
  rev: number
  mkt: string
}

export interface Agent {
  n: string
  e: string
  typ: string
  st: string
  mdl: string
  proj: string
  tkn: string
  cost: string
  pr: number
  suc: number
  act: string
  col: string
  bg: string
}

export interface Skill {
  n: string
  cat: string
  st: number
  p: number
  orig: string
}

export interface Idea {
  n: string
  cat: string
  st: string
  date: string
  txt: string
  f: number
  pot: number
  c: number
  spd: number
  r: number
  res: string
  rec: string
  col: string
}

export interface Todo {
  id: number
  txt: string
  proj: string
  prio: string
  due: string
  done: boolean
  ov: boolean
}

export interface Notification {
  typ: string
  ico: string
  tit: string
  sub: string
  t: string
}

export interface CalendarEntry {
  t: string
  n: string
  s: string
  today: boolean
}

export interface MemoryFile {
  ico: string
  n: string
  m: string
  b: string
}
