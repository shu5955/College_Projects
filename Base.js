import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from './Auth';
import styled from 'styled-components';

const DivParent= styled.div`
 height: 100%;
`;
 // A base component to load the children components. 

const Base = ({ children }) => (
    <DivParent>{children} </DivParent>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;




