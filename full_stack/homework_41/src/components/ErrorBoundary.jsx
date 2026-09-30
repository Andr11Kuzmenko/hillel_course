import { Component } from 'react'
import PropTypes from 'prop-types'

/** Перехоплює помилки рендеру дочірніх компонентів (у т.ч. відхилені Promise у use()). */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary перехопив помилку:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-box">
          <p className="error">⚠ {this.state.error.message}</p>
          <button className="btn" type="button" onClick={this.handleReset}>
            Спробувати ще раз
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  onReset: PropTypes.func,
}

export default ErrorBoundary
