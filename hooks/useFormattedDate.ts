export function useFormattedDate() {
  const isValidDate = (dateString: string | undefined | null): boolean => {
    if (!dateString) return false
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  const formatDate = (dateString: string | undefined | null, options?: Intl.DateTimeFormatOptions) => {
    if (!isValidDate(dateString)) return "N/A"

    const date = new Date(dateString as string)
    return new Intl.DateTimeFormat(
      "uz-UZ",
      options || {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ).format(date)
  }

  const formatShortDate = (dateString: string | undefined | null) => {
    if (!isValidDate(dateString)) return "N/A"

    const date = new Date(dateString as string)
    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatDateTime = (dateString: string | undefined | null) => {
    if (!isValidDate(dateString)) return "N/A"

    const date = new Date(dateString as string)
    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return { formatDate, formatShortDate, formatDateTime, isValidDate }
}

