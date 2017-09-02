import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Ticket from '../client/src/components/Ticket.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<Ticket />', () => {
  it ('should render the component correctly', () => {
    const wrapper = shallow(<Ticket />);
    expect(wrapper).toMatchSnapshot();
  })
})