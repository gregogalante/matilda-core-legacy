import { useContext } from 'react'
import { MatildaContext } from './MatildaContext'

/**
 * @function useMatildaTranslator
 * @returns 
 */
 export function useMatildaTranslator() {
  const { _Translator: { translations } } = useContext(MatildaContext)

  /**
   * @function translate
   * @param {string} key Stringa che identifica la traduzione
   * @returns 
   */
  const translate = (key) => {
    return translations[key] || key
  }

  return { translate, t: translate }
}