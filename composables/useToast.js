import { inject } from 'vue'

export const useToast = () => {
  const toast = inject('toast', null)
  
  if (!toast) {
    console.warn('useToast: Toast provider not found. Make sure to use this composable within admin layout.')
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {}
    }
  }
  
  const success = (title, message = '', duration = 4000) => {
    return toast.addToast({
      type: 'success',
      title,
      message,
      duration
    })
  }
  
  const error = (title, message = '', duration = 6000) => {
    return toast.addToast({
      type: 'error',
      title,
      message,
      duration
    })
  }
  
  const info = (title, message = '', duration = 4000) => {
    return toast.addToast({
      type: 'info',
      title,
      message,
      duration
    })
  }
  
  const warning = (title, message = '', duration = 5000) => {
    return toast.addToast({
      type: 'warning',
      title,
      message,
      duration
    })
  }
  
  return {
    success,
    error,
    info,
    warning
  }
} 