import * as React from 'react'
import * as css from './Cell.css'

interface ReprProps {
  className?: string
  preClassName?: string
  children?: any
  [prop: string]: any
}

interface AnyProps {
  title?: string
}

export function Any({children, className, preClassName, title, ...props}: ReprProps & AnyProps) {
  return (
    <div className={className} {...props}>
      {title ? <label>{title}</label> : ''}
      <div className={preClassName}>
        {children}
      </div>
    </div>
  )
}

function _JSON({children, className, preClassName, title, ...props}: ReprProps & AnyProps) {
  if (!children || children.constructor !== Array) {
    children = [children]
  }

  return (
    <div className={className} {...props}>
      {title ? <label>{title}</label> : ''}
        {children.map((child, i) => {
          let str = JSON.stringify(child, null, '\t').split(`\\`).join('')
          const maxLen = 400
        
          if (str.length > maxLen) {
            str = str.slice(0, maxLen) + '\u2026'
          }

          return (
            <div key={['child', 'i', Math.random().toString()].join('_')}
              className={preClassName}>
              {str}
            </div>
          )
        })}
    </div>
  )
}

export { _JSON as JSON }
