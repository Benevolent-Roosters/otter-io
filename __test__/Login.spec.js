import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Login from '../client/src/components/Login.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<Login />', () => {
  it ('should render the component correctly', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper).toMatchSnapshot();
  })
})