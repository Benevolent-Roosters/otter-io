import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import UserProfile from '../client/src/components/UserProfile.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<UserProfile />', () => {
  it ('should render the component correctly', () => {
    const wrapper = shallow(<UserProfile />);
    expect(wrapper).toMatchSnapshot();
  })
})