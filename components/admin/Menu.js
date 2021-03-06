import { List, ListItem, ListItemText } from '@material-ui/core';
import NextLink from 'next/link';
import React from 'react';

const Menu = ({ selected }) => {
  return (
    <List>
      <NextLink href="/admin/dashboard" passHref>
        <ListItem
          selected={selected === 'dashboard' ? true : false}
          button
          component="a"
        >
          <ListItemText primary="Admin Dashboard"></ListItemText>
        </ListItem>
      </NextLink>
      <NextLink href="/admin/orders" passHref>
        <ListItem
          selected={selected === 'orders' ? true : false}
          button
          component="a"
        >
          <ListItemText primary="Orders"></ListItemText>
        </ListItem>
      </NextLink>
      <NextLink href="/admin/products" passHref>
        <ListItem
          selected={selected === 'products' ? true : false}
          button
          component="a"
        >
          <ListItemText primary="Products"></ListItemText>
        </ListItem>
      </NextLink>
      <NextLink href="/admin/users" passHref>
        <ListItem
          selected={selected === 'users' ? true : false}
          button
          component="a"
        >
          <ListItemText primary="Users"></ListItemText>
        </ListItem>
      </NextLink>
    </List>
  );
};

export default Menu;
