import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Panel from '../client/src/components/Panel.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<Panel />', () => {
  it ('should render the component correctly', () => {
    const wrapper = shallow(<Panel />);
    expect(wrapper).toMatchSnapshot();
  })
})