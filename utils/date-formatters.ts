const localEsDateFormatter = (date: Date | string): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export default localEsDateFormatter;
