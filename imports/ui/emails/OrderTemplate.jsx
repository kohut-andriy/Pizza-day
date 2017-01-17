import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Oy, { Table, TBody, TR, TD, Img } from 'oy-vey';

const propTypes = {
  userName: PropTypes.string,
  eventName: PropTypes.string,
  eventDate: PropTypes.string,
  totalPrice: PropTypes.number,
  items: PropTypes.arrayOf(Object),
};

const OrderTemplate = (props) => {
  const getListItems = () =>
    props.items.map(item => (<TR key={item._id}>
      <TD>
        { item.name }
      </TD>
      <TD>
        { item.price }
      </TD>
      <TD>
        { item.count }
      </TD>
    </TR>));

  return (<Table>
    <TBody>
      <TR>
        <TD>
          <span>Hello { props.userName } !</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span>Event { `"${props.eventName}"` } was ordered.</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span>Here is Your order.</span>
        </TD>
      </TR>
      <TR>
        <Table align="center" cellSpacing={20} style={{ border: '1px solid black' }}>
          <TR>
            <TD>Name</TD>
            <TD>Price</TD>
            <TD>Count</TD>
          </TR>
          { getListItems() }
        </Table>
      </TR>
      <TR>
        <TD>
          <span>Total price: { props.totalPrice }</span>
        </TD>
      </TR>
      <TR>
        <TD>
          <span> Event date: { props.eventDate }</span>
        </TD>
      </TR>
      <TR>
        <TD align="center">
          <Img
            src={FlowRouter.url('/:image', { image: '/images/logo.png' })}
            height={100}
            width={100}

            alt="Pizza-day logo"
          />
        </TD>
      </TR>
    </TBody>
  </Table>);
};

OrderTemplate.propTypes = propTypes;

const orderEmail = props =>
  Oy.renderTemplate(<OrderTemplate
    {...props}
  />, {
    title: 'Your order',
    previewText: 'Get order',
  });

export default orderEmail;
