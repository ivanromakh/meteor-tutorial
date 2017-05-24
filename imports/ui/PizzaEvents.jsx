import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
 
// Event component - represents a single todo item
export default class PizzaEvent extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('events.setChecked', this.props.event._id, !this.props.event.checked);
  }
 
  deleteThisEvent() {
    Meteor.call('events.remove', this.props.event._id);
  }

  togglePrivate() {
    Meteor.call('events.setPrivate', this.props.event._id, ! this.props.event.private);
  }
 
  render() {
    const eventClassName = classnames({
      checked: this.props.event.checked,
      private: this.props.event.private,
    });
 
    return (
      <li className={eventClassName}>
        <button className="delete" onClick={this.deleteThisEvent.bind(this)}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly
          checked={this.props.event.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.event.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
 
        <span className="text">
          <strong>{this.props.event.username}</strong>: {this.props.event.text}
        </span>
      </li>
    );
  }
}

PizzaEvent.propTypes = {
  event: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};