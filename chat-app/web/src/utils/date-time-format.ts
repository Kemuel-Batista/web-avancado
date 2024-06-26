import { format } from 'date-fns'

export const dateTimeFormat = (date: string) => {
  if (!Date.parse(date)) return ''
  return format(Date.parse(date), 'dd/MM/yyyy HH:mm:ss')
}
