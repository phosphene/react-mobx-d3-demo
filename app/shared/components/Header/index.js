import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
//import { Button } from 'react-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

export default function Header() {
  return (
    <div>
      <Navbar>
        <Nav bsStyle="tabs">
          <NavItem href="/">Home</NavItem>
          <NavItem href="thrashdash">Thrash Dash</NavItem>
          <NavItem href="dreamdash">Dream Dash</NavItem>
          <NavItem href="noaadash">NOAA Dash</NavItem>
          <NavItem href="parallel">Para Coord</NavItem>
        </Nav>
       </Navbar>

    </div>
  );
}
