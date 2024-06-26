function maskCurrency(value: string) {
  value = value.replace(/\D/g, '')

  if (value === '0') {
    return 'R$ 0,00'
  }

  value = value.replace(/(\d+)(\d{2})$/, 'R$ $1,$2')
  // Montar um bloco de 3 digitos quetiver logo em seguida um valor não númerico (,) e adicionar um ponto
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')

  return value
}

function maskEventDate(value?: string) {
  if (value === undefined) {
    return
  }

  const date = new Date(value)

  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' }) // "Jul"
  const year = date.getFullYear()

  return `${day} ${month} - ${year}`
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const hours = date.getHours() // Reduz 3 horas
  const minutes = date.getMinutes()
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
}

export { maskCurrency, maskEventDate, formatTimestamp }
