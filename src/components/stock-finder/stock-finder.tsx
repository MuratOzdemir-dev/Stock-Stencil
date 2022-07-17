import { Component, h } from '@stencil/core'
import { rapidApiKey } from '../../settings/keys'

@Component({
  tag: 'siu-stock-finder',
  styleUrl: 'stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement

  findStockHandler(event: Event) {
    event.preventDefault()
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.stockNameInput.value}&apikey=${rapidApiKey}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <form onSubmit={this.findStockHandler.bind(this)}>
        <input type="text" ref={el => (this.stockNameInput = el)} />
        <button type="submit">find</button>
      </form>
    )
  }
}
