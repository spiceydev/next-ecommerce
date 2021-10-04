import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import NextLink from 'next/link';

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
    </List>
  );
};

export default Menu;
