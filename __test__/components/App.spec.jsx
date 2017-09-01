import React from 'react';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import App from '../../client/src/components/App.jsx';


describe('App', () => {
  it('should render App correctly', () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });
});