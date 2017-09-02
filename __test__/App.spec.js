import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import { UnwrappedApp } from '../client/src/components/App.jsx';

describe('App', () => {
  it('should render App correctly', () => {
    const component = shallow(<UnwrappedApp/>);
    expect(component).toMatchSnapshot();
  });
});