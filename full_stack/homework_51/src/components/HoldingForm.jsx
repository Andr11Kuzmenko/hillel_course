import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

function HoldingForm({ coins, onAdd }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { coinId: '', amount: '', buyPrice: '', date: today, note: '' },
  })

  const coinId = watch('coinId')
  const selected = coins.find((c) => c.id === coinId)

  const onSubmit = (data) => {
    onAdd({
      id: crypto.randomUUID(),
      coinId: data.coinId,
      amount: Number(data.amount),
      buyPrice: Number(data.buyPrice),
      date: data.date,
      note: data.note.trim(),
      createdAt: Date.now(),
    })
    reset({ coinId: '', amount: '', buyPrice: '', date: today, note: '' })
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Монета
        <select {...register('coinId', { required: 'Оберіть монету' })}>
          <option value="">— оберіть —</option>
          {coins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()})
            </option>
          ))}
        </select>
        {errors.coinId && <span className="field-error">{errors.coinId.message}</span>}
      </label>

      <label>
        Кількість
        <input
          type="number"
          step="any"
          placeholder="0.5"
          {...register('amount', {
            required: 'Вкажіть кількість',
            min: { value: 0.00000001, message: 'Кількість має бути більшою за 0' },
            max: { value: 1e9, message: 'Занадто велике значення' },
          })}
        />
        {errors.amount && <span className="field-error">{errors.amount.message}</span>}
      </label>

      <label>
        Ціна купівлі, $
        <div className="input-row">
          <input
            type="number"
            step="any"
            placeholder="60000"
            {...register('buyPrice', {
              required: 'Вкажіть ціну купівлі',
              min: { value: 0.00000001, message: 'Ціна має бути більшою за 0' },
            })}
          />
          {selected && (
            <button
              type="button"
              className="ghost"
              onClick={() => setValue('buyPrice', selected.current_price, { shouldValidate: true })}
            >
              Поточна
            </button>
          )}
        </div>
        {errors.buyPrice && <span className="field-error">{errors.buyPrice.message}</span>}
      </label>

      <label>
        Дата купівлі
        <input
          type="date"
          max={today}
          {...register('date', {
            required: 'Вкажіть дату',
            validate: (v) => v <= today || 'Дата не може бути в майбутньому',
          })}
        />
        {errors.date && <span className="field-error">{errors.date.message}</span>}
      </label>

      <label className="wide">
        Нотатка (необов&apos;язково)
        <input type="text" placeholder="Довгострокова інвестиція" {...register('note', { maxLength: { value: 60, message: 'Максимум 60 символів' } })} />
        {errors.note && <span className="field-error">{errors.note.message}</span>}
      </label>

      <button type="submit" className="primary wide" disabled={isSubmitting}>
        + Додати в портфель
      </button>
    </form>
  )
}

HoldingForm.propTypes = {
  coins: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default HoldingForm
