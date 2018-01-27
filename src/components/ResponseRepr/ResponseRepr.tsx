import * as React from 'react'
import * as css from './ResponseRepr.css'
import * as I from './ResponseRepr.module'
import * as D from 'common/Dispatcher'
import RObject from 'components/RObject/RObject'
import * as classNames from 'classnames'
import { parse } from '../../filter-parser/filter.pegjs'
import { Store } from 'common/Dispatcher'
import { compileCode } from 'common/Trasformer'

class ResponseRepr extends React.Component<I.IProps, I.IState> {
  private listeners: string[]
  constructor(props: I.IProps) {
    super(props)
    const response = props.store.get(D.StoreKeys.Response, {})

    this.state = {
      response,
      sortKey: Object.keys(response[0] || {})[0],
      sortDesc: false,
      filter: '',
    }
  }

  componentDidMount() {
    this.listeners = [
      D.register(D.ActionTypes.UPDATE_RESPONSE, () => {
        const viewKey = Store.getState().get(D.StoreKeys.ViewKey)
        let response = Store.getState().get(D.StoreKeys.Response)
        if (viewKey) {
          response = this.objectByPath(response, viewKey)
        }
        this.setState({ response })
      }),

      D.register(D.ActionTypes.UPDATE_VIEWKEY, (viewKey) => {
        let response = Store.getState().get(D.StoreKeys.Response, {})
        response = response && viewKey ? this.objectByPath(response, viewKey) : response
        this.setState({ response })
      }),
    ]
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => D.AppDispatcher.unregister(listener))
  }

  private objectByPath(obj: any, key: string) {
    return key.split('.').reduce((acc, cur, i) => {
      if (acc.hasOwnProperty(cur)) {
        return acc[cur]
      } else {
        throw new Error('invalid key!')
      }
    }, obj)
  }

  private sortBy(key: string) {
    this.setState((cur) => ({
      sortKey: key,
      sortDesc: Boolean(cur.sortKey === key && !cur.sortDesc)
    }))
  }

  private processedResponse() {
    let response = this.state.response || []
    const keys = Object.keys(response)
    const isArray = response.constructor === Array
    const transform = this.props.store.get(D.StoreKeys.ResponseTransform)
    
    if (!keys.length) {
      return [{ key: this.props.store.get(D.StoreKeys.ViewKey), value: JSON.stringify(response) }]
    }

    if (typeof response === 'string' || typeof response === 'number' && response) {
      return [{ type: typeof response, value: JSON.stringify(response) }]
    }

    try {
      if (!isArray) {
        let flag = false
        keys.forEach((key) => {
          const row = response[key]
          if (!row || !Object.keys(row || {}).length) {
            flag = true
          }
        })

        response = keys.map((key) => {
          let row = response[key]
          let oldVal: any
          if (typeof row !== 'string' && typeof row !== 'number' && row) {
            oldVal = row
            if (flag) {
              row = { key: row._id || row.id || key, value: row }
            } else {
              row = { key: row._id || row.id || key, ...row }
            }
          } else {
            flag = true
            row = { key: key, value: row }
          }
          if (Object.keys(row).length < 2) {
            row = { key: row.key, value: JSON.stringify(oldVal) }
          }
          return row
        })
      }

      if (transform) {
        const oldResponse = response
        const transformed = compileCode(transform)({
          console: console,
          response
        })
        if (transformed) {
          response = transformed
          console.debug('transformed:', transformed)
        } else {
          throw new Error('response returned a falsy value')
        }
      }

      if (response[0].hasOwnProperty(this.state.sortKey)) {
        const desc = this.state.sortDesc
        const key = this.state.sortKey

        response = response.sort((a, b) => {
          // numbers are matching
          if (typeof a[key] === 'number' && typeof b === 'number' ||
              isFinite(a[key]) && isFinite(b[key])) {
            const result = parseFloat(a[key]) - parseFloat(b[key])
            return desc ? -result : result
          }

          if (a[key] > b[key]) {
            return desc ? -1 : 1
          // tslint:disable-next-line:triple-equals
          } else if (a[key] == b[key]) {
            return 0
          } else if (a[key] < b[key]) {
            return desc ? 1 : -1
          }

          if (!a && !b) {
            return 0
          }

          return a.valueOf() - b.valueOf()
        })
      }
      
      if (this.state.filter.trim().length) {
        const filter = this.state.filter.trim().replace(/\s{2,}/g, ' ')
        const filterOps = parse(filter)

        response = response.filter((row) => {
          for (const key in filterOps) {
            if (!filterOps.hasOwnProperty(key)) {
              continue
            }
            const { oper, value } = filterOps[key]
            switch (oper) {
              case '>':
                return row[key] > value
              case '>=':
                return row[key] >= value
              case '<':
                return row[key] < value
              case '<=':
                return row[key] <= value
              case '=':
                // tslint:disable-next-line:triple-equals
                return row[key] == value
              case '!=':
                // tslint:disable-next-line:triple-equals
                return row[key] != value
              default:
                return true
            }
          }
        })
      }
    } catch (e) {
      console.warn(e)
    }

    return response
  }

  private filterInput() {
    return (
      <input className={css.filterInput}
        type="text" value={this.state.filter}
        placeholder={`Filter data (e.g.: first_name="John" age>=32)`}
        onChange={(e) => this.setState({ filter: e.target.value })} />
    )
  }
  
  private columns(response: any[]) {
    // const keyCollate = {}
    // response.forEach((row) => {
    //   Object.keys(row).forEach((k) => keyCollate[k] = true)
    // })
    // const keys = Object.keys(keyCollate)
    const keys = Object.keys(response[0] || { key: null, value: null })

    return keys.sort((a, b) => {
      if (a === 'key') {
        return -1
      } else if (b === 'key') {
        return 1
      }

      return a > b ? 1 : a < b ? -1 : 0
    }).map((key) => {
      const cls = classNames(css.sortIcon, 'material-icons', {
        [css.active]: this.state.sortKey === key
      })
      
      return (
        <h3 key={`col-th-${key}`}
          onClick={() => this.sortBy(key)}
          className={classNames({ [css.keyColumn]: true })}>
          {key}
          <i className={cls}>
            {this.state.sortKey === key && this.state.sortDesc ? 'arrow_drop_down' : 'arrow_drop_up'}
          </i>
        </h3>
      )
    })
  }

  private table() {
    const response = this.processedResponse()
    const columns = this.columns(response)
    const firstLine = response && response.length ? response[0] : {}
    const colAmt = columns.length - 1

    return (
      <div>
        {this.filterInput()}

        <div className={css.table}
          style={{gridTemplateColumns: `min-content repeat(${colAmt}, auto)`}}>
            {columns}
            {(response).map((row, i) => {
              const cls = (j) => {
                return classNames(css.cell, {
                  [css.rowStart]: j % (colAmt + 1) === 0,
                  [css.rowEnd]: j % (colAmt + 1) === colAmt,
                })
              }

              return (
                <RObject className={cls}
                  key={`row-${i}`}
                  data={row} />
              )
            })}
          </div>
      </div>
      )
  }

  render() {
    const className = [
      css.ResponseRepr,
      this.props.className
    ].join(' ')
    
    return (
      <div className={className}>
        {this.table()}
      </div>
    )
  }
}

export default ResponseRepr
