import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Avatars from '../api/avatarsCollection';

/*
 *
 *  Create unmounting function to delete photos if group was not created
 *
 * */

class GroupCreate extends Component {
  constructor(props) {
    super(props);
    this.createGroup = this.createGroup.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.state = {
      imageId: null,
      image: null,
    };
  }

  createGroup(event) {
    event.preventDefault();

    const name = this.name.value.trim();
    const description = this.description.value.trim();
    const creator = Meteor.userId();
    const avatar = this.state.image;

    Meteor.call(
      'group.insert',
      { name, creator, description, avatar },
      this.handleMethodsCallbacks,
    );
  }

  handleMethodsCallbacks =
    handledFunction =>
      (err) => {
        if (err) {
          switch (err) {
            case 500: {
              console.log('Service unavailable');
              break;
            }
            default: {
              console.log('Something going wrong');
            }
          }
        }

        if (handledFunction) handledFunction();
      };

  imageDeletedCallback = () => {
    this.setState({
      imageId: null,
    });
  };

  loadFile(event) {
    event.preventDefault();

    if (this.state.imageId) {
      Avatars.remove(
        { _id: this.state.imageId },
        this.handleMethodsCallbacks(this.imageDeletedCallback),
      );
    }

    const file = this.image.files[0];

    if (file) {
      Avatars.insert(file, (err, fileObj) => {
        if (err) {
          throw new Error(err.reason);
        } else {
          fileObj.once('uploaded', () => {
            this.setState({
              imageId: fileObj._id,
              image: `/cfs/files/avatars/${fileObj._id}`,
            });
          });
        }
      });
    }

    return false;
  }

  render() {
    return (<form onSubmit={this.createGroup} className="form group-create">
      <ul className="group-create__list">
        <li className="group-create__item">
          <figure>
            <img src={this.state.image} onError={this.loadFile} className="avatar" alt="" />

            <figcaption>
              <input type="file" ref={(image) => { this.image = image; }} onChange={this.loadFile} />
            </figcaption>
          </figure>
        </li>
        <li className="group-create__item">
          <label className="form__label" htmlFor="name">
           Name:
          </label>
          <input
            type="text"
            ref={(name) => { this.name = name; }}
            id="name"
            className="form__input"
          />
        </li>
        <li className="group-create__item">
          <label className="form__label" htmlFor="description">
            Description:
          </label>
          <textarea
            ref={(description) => { this.description = description; }}
            id="description"
            className="form__textarea"
          />
        </li>
        <li className="group-create__item">
          <input type="submit" value="Create group" />
        </li>
      </ul>
    </form>);
  }
}

export default GroupCreate;