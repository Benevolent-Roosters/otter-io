import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import PerformanceDashboard from '../client/src/components/PerformanceDashboard.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<PerformanceDashboard />', () => {
  it ('should render the component correctly', () => {
    const wrapper = shallow(<PerformanceDashboard />);
    expect(wrapper).toMatchSnapshot();
  })
})