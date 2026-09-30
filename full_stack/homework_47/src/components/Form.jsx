import { ErrorMessage, Field, Form as FormikForm, Formik } from 'formik'
import FormField from './FormField.jsx'
import { GENDERS, initialValues, registrationSchema } from '../validationSchema.js'

// Імітація запиту до сервера
const fakeRequest = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 1000))

export default function Form({ onSuccess }) {
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    // cast() приводить типи (age -> number, trim рядків); confirmPassword не надсилаємо
    const cast = registrationSchema.cast(values)
    const data = {
      name: cast.name,
      email: cast.email,
      password: cast.password,
      age: cast.age,
      phone: cast.phone,
      gender: cast.gender,
      agree: cast.agree,
    }
    await fakeRequest(data)
    onSuccess(data)
    setSubmitting(false)
    resetForm()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registrationSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ isValid, isSubmitting, dirty, resetForm }) => (
        <FormikForm className="form" noValidate>
          <h2>Реєстрація</h2>

          <FormField label="Ім'я" name="name" placeholder="Тарас Шевченко" autoComplete="name" />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
          />

          <div className="form__row">
            <FormField label="Пароль" name="password" type="password" autoComplete="new-password" />
            <FormField
              label="Підтвердження пароля"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
          </div>

          <div className="form__row">
            <FormField label="Вік" name="age" type="number" min="0" placeholder="18" />
            <FormField
              label="Телефон"
              name="phone"
              type="tel"
              placeholder="+380501234567"
              autoComplete="tel"
            />
          </div>

          <FormField label="Стать" name="gender" as="select">
            <option value="">— оберіть —</option>
            {GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </FormField>

          <div className="field">
            <label className="checkbox">
              <Field type="checkbox" name="agree" />
              <span>Я погоджуюся з умовами використання та політикою конфіденційності</span>
            </label>
            <ErrorMessage name="agree" component="div" className="field__error" />
          </div>

          <div className="form__actions">
            <button type="submit" className="btn" disabled={!isValid || !dirty || isSubmitting}>
              {isSubmitting ? 'Надсилання…' : 'Зареєструватися'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => resetForm()}
              disabled={!dirty || isSubmitting}
            >
              Очистити
            </button>
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}
