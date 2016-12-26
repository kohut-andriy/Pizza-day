import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Groups from '../api/collections/groupsCollection';
import Menu from '../api/collections/menuCollection';
import MenuList from './MenuList';
import EventsListContainer from './Events';

class GroupPage extends Component {
  checkCreator() {
    return this.props.creator === Meteor.userId();
  }

  render() {
    return (<div className="group">
      <ul className="group__info">
        <li><img src={this.props.avatar} className="avatar" alt="" /></li>
        <li><div>Name: { this.props.name }</div></li>
        <li><div>Description: { this.props.description }</div></li>
        <li className="div">
          Events:
          <br />
          <EventsListContainer id={this.props.id} />
          <br />
        </li>
        { this.checkCreator() ? <li>
          <a href={FlowRouter.path('/groups/:id/create-event', { id: this.props.id })}>Create</a>
        </li> : '' }
      </ul>
      <div className="group__menu">
        <h1 className="group__menu-header">Menu</h1>
        <MenuList items={this.props.menu} />
      </div>
    </div>);
  }
}

GroupPage.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
  creator: PropTypes.string,
  menu: PropTypes.arrayOf(Object),
};

const GroupPageContainer = createContainer(({ id }) => {
  Meteor.subscribe('Group', id);
  Meteor.subscribe('GroupMenu', id);

  const { name, avatar, description, creator } = Groups.findOne() || {};

  return {
    id,
    name,
    description,
    avatar,
    creator,
    menu: Menu.find().fetch(),
  };
}, GroupPage);

export default GroupPageContainer;
