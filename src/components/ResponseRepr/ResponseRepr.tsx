import * as React from 'react'
import * as css from './ResponseRepr.css'
import * as I from './ResponseRepr.module'
import * as D from 'common/Dispatcher'
import RObject from 'components/RObject/RObject'
import * as classNames from 'classnames'
import { parse } from '../../filter-parser/filter.pegjs'

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
      D.register(D.ActionTypes.UPDATE_RESPONSE, (response) => {
        const viewKey = this.props.store.get(D.StoreKeys.ViewKey)
        if (viewKey) {
          response = this.objectByPath(response, viewKey)
        }
        this.setState({ response })
      }),

      D.register(D.ActionTypes.UPDATE_VIEWKEY, (viewKey) => {
        let response = this.props.store.get(D.StoreKeys.Response, {})
        response = response && viewKey ? this.objectByPath(response, viewKey) : response
        this.setState({ response: response })
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
  
  private columns() {
    const keys = Object.keys(this.state.response[0] || {})
    return keys.map((key) => {
      const cls = classNames(css.sortIcon, 'material-icons', {
        [css.active]: this.state.sortKey === key
      })
      
      return (
        <h3 key={`col-th-${key}`}
          onClick={() => this.sortBy(key)}>
          {key}
          <i className={cls}>
            {this.state.sortKey === key && this.state.sortDesc ? 'arrow_drop_down' : 'arrow_drop_up'}
          </i>
        </h3>
      )
    })
  }

  private processedResponse() {
    let response = this.state.response || []
    if (!response.length) {
      return []
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
      })

    }
    
    if (this.state.filter.trim().length) {
      const filter = this.state.filter.trim().replace(/\s{2,}/g, ' ')
      try {
        const filterOps = parse(filter)
        console.debug({filterOps})

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
      } catch (e) {
        console.warn(e)
      }
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

  private table() {
    const keys = Object.keys(this.state.response && this.state.response[0] || {})
    const colAmt = keys.length

    return (
      <div>
        {this.filterInput()}
        <div className={css.table}
          style={{gridTemplateColumns: `repeat(${colAmt}, auto)`}}>
            {this.columns()}
            {this.processedResponse().map((row, i) => {
              const cls = (j) => {
                return classNames(css.cell, {
                  [css.rowStart]: j % colAmt === 0,
                  [css.rowEnd]: j % colAmt === colAmt - 1,
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

  private getRObjectList() {
    const { response } = this.state
    let colAmt

    if (response && response.constructor === Array) {
      return this.table()
    }

    colAmt = Object.keys(response || {})

    return (
      <div className={css.table}
        style={{gridTemplateRows: `repeat(${colAmt}, min-content)`}}>
        <RObject data={response} />
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
        {this.getRObjectList()}
      </div>
    )
  }
}

export default ResponseRepr
