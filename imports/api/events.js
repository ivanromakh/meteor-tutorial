import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Events = new Mongo.Collection('events');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish events that are public or belong to the current user
  Meteor.publish('events', function eventsPublication() {
    return Events.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'events.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a event
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Events.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'events.remove'(eventId) {
    check(eventId, String);
 
    const event = Events.findOne(eventId);
    if (event.private && event.owner !== Meteor.userId()) {
      // If the event is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Events.remove(eventId);
  },

  'events.setPrivate'(eventId, setToPrivate) {
    check(eventId, String);
    check(setToPrivate, Boolean);
 
    const event = Events.findOne(eventId);
 
    // Make sure only the event owner can make a event private
    if (event.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Events.update(eventId, { $set: { private: setToPrivate } });
  },

  'events.setChecked'(eventId, setChecked) {
    check(eventId, String);
    check(setChecked, Boolean);
 
    Events.update(eventId, { $set: { checked: setChecked } });
  },
  
});