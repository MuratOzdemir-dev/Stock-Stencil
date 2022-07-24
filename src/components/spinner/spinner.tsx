import { Component, h } from '@stencil/core'

@Component({
  tag: 'siu-spinner',
  shadow: true,
  styleUrl: 'spinner.css',
})
export class Spinner {
  render() {
    return (
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }
}
