import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import checkData from '../checkData';

Meteor.publish('user', (id) => {
  check(id, Match.Where(checkData.notEmpty));

  return Meteor.users.find(id);
});

Meteor.methods({
  'user.insert': function insert(requestData) {
    const requestDataFormat = {
      email: String,
      password: String,
    };

    check(requestData, requestDataFormat);
    check(requestData.email, String);
    check(requestData.password, String);

    Accounts.createUser(requestData);
  },

  'user.update': function update(requestData) {
    const requestDataFormat = {
      name: Match.Maybe(String),
      avatar: Match.Maybe(String),
      email: Match.Maybe(String),
    };

    if (!this.userId) {
      throw new Meteor.Error(401, 'Access denied');
    }

    check(requestData, requestDataFormat);

    const userData = {};

    if (requestData.name) {
      userData['profile.name'] = requestData.name;
    }

    if (requestData.avatar) {
      userData['profile.avatar'] = requestData.avatar;
    }

    if (requestData.email) {
      userData.emails = [{ address: requestData.email, verified: false }];
    }

    if (!userData.isEmpty) {
      Meteor.users.upsert(this.userId, {
        $set: {
          ...userData,
        },
      });
    }
  },
});

Meteor.publish('Users', function publishUsers() {
  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  // $ne don't work { _id: { $ne: this.userId } }
  return Meteor.users.find();
});

Meteor.publish('GroupMembers', function publishGroupMembers() {
  if (!this.userId) {
    return this.error(new Meteor.Error(401, 'Access denied'));
  }

  return Meteor.users.find();
});