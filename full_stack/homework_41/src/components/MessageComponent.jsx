import { use } from 'react'
import PropTypes from 'prop-types'
import { ThemeContext } from '../context/ThemeContext.js'

/**
 * Читає дані з Promise за допомогою хука use().
 * Поки Promise у стані pending, компонент "призупиняється" і React показує
 * fallback найближчого <Suspense>. Якщо Promise відхилено — помилка
 * передається до ErrorBoundary.
 */
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise)
  // use() також можна використовувати для читання контексту
  const theme = use(ThemeContext)

  return (
    <div className={`message message--${theme}`}>
      <p className="message__text">{message.text}</p>
      <small className="muted">Отримано о {message.receivedAt}</small>
    </div>
  )
}

MessageComponent.propTypes = {
  messagePromise: PropTypes.instanceOf(Promise).isRequired,
}

export default MessageComponent
