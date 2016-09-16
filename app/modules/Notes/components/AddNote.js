import React, { Component } from 'react';
import { observer } from 'mobx-react';


@observer
export default class AddNote extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const body = e.target.body.value;
    if (title && body) {
      this.props.store.add(title, body);
      e.target.title.value = '';
      e.target.body.value = '';
    }
  }

  render() {
    return (
      <section>
        <h3>Add new</h3>
        <form onSubmit={this.handleSubmit}>
          <textarea name="title" placeholder="title" />
          <textarea name="body" rows="6" placeholder="note" />
          <button>Add</button>
        </form>
      </section>
    )
  }
}
