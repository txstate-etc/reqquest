function convertJsonToCsv (jsonData: any[]) {
  const headers = Object.keys(jsonData[0])

  let csvContent = headers.join(',') + '\n'

  jsonData.forEach(item => {
    const values = Object.values(item)
    csvContent += values.join(',') + '\n'
  })

  return csvContent
}

export function downloadCsv (data: any[], title = 'App_Requests') {
  const csvString = convertJsonToCsv(data)

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8,' })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', title + '.csv')

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
