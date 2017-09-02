import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import { UnwrappedApp } from '../client/src/components/app.jsx';

describe('App', () => {
  it('should render App correctly', () => {
    let component = shallow(<UnwrappedApp/>);
    expect(component).toMatchSnapshot();
  });
});