import { format } from 'date-fns'

export const dateFormat = (date: string) => {
  if (!Date.parse(date)) return ''
  return format(Date.parse(date), 'dd/MM')
}
