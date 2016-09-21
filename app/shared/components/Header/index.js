import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
//import { Button } from 'react-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';


export default function Header() {
  return (
       <div>
       <Navbar>
         <Nav bsStyle="tabs">
            <NavItem href="/">Home</NavItem>
            <NavItem href="thrashdash">Thrash Dash</NavItem>
            <NavItem href="dreamdash">Dream Dash</NavItem>
        </Nav>
       </Navbar>
       </div>
  );
}
