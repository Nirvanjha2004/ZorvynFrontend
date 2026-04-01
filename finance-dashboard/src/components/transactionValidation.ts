export interface FormValues {
  date: string
  description: string
  amount: string
}

export interface FormErrors {
  date?: string
  description?: string
  amount?: string
}

export function validateTransaction(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.date) errors.date = 'Date is required'
  if (!values.description.trim()) errors.description = 'Description is required'
  const amt = parseFloat(values.amount)
  if (!values.amount) errors.amount = 'Amount is required'
  else if (isNaN(amt) || amt <= 0) errors.amount = 'Amount must be a positive number'
  return errors
}
