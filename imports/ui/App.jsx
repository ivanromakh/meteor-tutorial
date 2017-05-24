import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Events } from '../api/events.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
import PizzaEvents from './PizzaEvents.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';

    Meteor.call('events.insert', text);
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
 
  renderEvents() {
   let filteredEvents = this.props.events;
    if (this.state.hideCompleted) {
      filteredEvents = filteredEvents.filter(event => !event.checked);
    }
    return filteredEvents.map((event) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = event.owner === currentUserId;
      console.log(event.owner);
      return (
        <PizzaEvent
          key={event._id}
          event={event}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Events
          </label>
          <AccountsUIWrapper />
          <form className="new-event" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new events"
            />
          </form>
        </header>
 
        <ul>
          {this.renderEvents()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  events: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('events');

  return {
    events: Events.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Events.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);