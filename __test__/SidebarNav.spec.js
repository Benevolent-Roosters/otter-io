import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import SidebarNav, { UnwrappedSidebar } from '../client/src/components/SidebarNav.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<SidebarNav />', () => {
  let store = {
    gitHandle: 'something',
    profilePicture: 'someUrl',
    boards: [],
    currentBoard: {
      boardId: 0,
      teamName: '',
      repoName: '',
      owner: '',
      repoUrl: ''
    }
  };
  it ('should render the unconnected component correctly', () => {
    const wrapper = shallow(<UnwrappedSidebar />);
    expect(wrapper).toMatchSnapshot();
  });
  it ('should render the connected component correctly', () => {
    const wrapper = shallow(<Provider store={store}><SidebarNav /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });
})