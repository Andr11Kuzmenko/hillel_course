import * as Yup from 'yup'

export const GENDERS = [
  { value: 'male', label: 'Чоловіча' },
  { value: 'female', label: 'Жіноча' },
  { value: 'other', label: 'Інша' },
]

export const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  phone: '',
  gender: '',
  agree: false,
}

export const registrationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ім'я має містити щонайменше 2 символи")
    .max(50, "Ім'я не може бути довшим за 50 символів")
    .matches(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ' -]+$/, "Ім'я може містити лише літери, пробіл, дефіс та апостроф")
    .required("Вкажіть ім'я"),
  email: Yup.string().trim().email('Некоректна адреса email').required('Вкажіть email'),
  password: Yup.string()
    .min(8, 'Пароль має містити щонайменше 8 символів')
    .matches(/[a-z]/, 'Пароль має містити малу латинську літеру')
    .matches(/[A-Z]/, 'Пароль має містити велику латинську літеру')
    .matches(/\d/, 'Пароль має містити цифру')
    .required('Вкажіть пароль'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Паролі не збігаються')
    .required('Підтвердіть пароль'),
  age: Yup.number()
    .typeError('Вік має бути числом')
    .integer('Вік має бути цілим числом')
    .min(18, 'Реєстрація доступна з 18 років')
    .max(120, 'Вкажіть реальний вік')
    .required('Вкажіть вік'),
  phone: Yup.string()
    .matches(/^\+380\d{9}$/, 'Телефон у форматі +380XXXXXXXXX')
    .required('Вкажіть номер телефону'),
  gender: Yup.string()
    .oneOf(
      GENDERS.map((g) => g.value),
      'Оберіть стать',
    )
    .required('Оберіть стать'),
  agree: Yup.boolean().oneOf([true], 'Необхідно погодитися з умовами'),
})
