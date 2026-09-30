import { ErrorMessage, Field, useField } from 'formik'

// Обгортка над Field: підпис, підсвітка помилки (лише для touched-полів) і текст помилки
export default function FormField({ label, name, as, children, ...props }) {
  const [, meta] = useField(name)
  const hasError = meta.touched && meta.error
  const isValid = meta.touched && !meta.error

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Field
        id={name}
        name={name}
        as={as}
        className={`field__control ${hasError ? 'is-invalid' : ''} ${isValid ? 'is-valid' : ''}`}
        aria-invalid={Boolean(hasError)}
        {...props}
      >
        {children}
      </Field>
      <ErrorMessage name={name} component="div" className="field__error" />
    </div>
  )
}
