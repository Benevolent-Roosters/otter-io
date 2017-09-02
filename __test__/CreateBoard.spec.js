import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import CreateBoard, { UnwrappedCreateBoard }from '../client/src/components/CreateBoard.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<CreateBoard />', () => {
  let store = {
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
    const wrapper = shallow(<UnwrappedCreateBoard />);
    expect(wrapper).toMatchSnapshot();
  });
  it ('should render the connected component correctly', () => {
    const wrapper = shallow(<Provider store={store}><CreateBoard /></Provider>);
    expect(wrapper).toMatchSnapshot();
  });
})