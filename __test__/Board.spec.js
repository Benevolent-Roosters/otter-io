import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Board, { UnwrappedBoard } from '../client/src/components/Board.jsx';
import { Provider } from 'react-redux';
import rootReducer from '../client/src/redux/reducers.js';

describe('<Board />', () => {
  let store = {
    currentBoard: {
      boardId: 0,
      teamName: '',
      repoName: '',
      owner: '',
      repoUrl: ''
    },
    panels: []
  };
  it ('should render the unconnected Board correctly', () => {
    const wrapper = shallow(<UnwrappedBoard />);
    expect(wrapper).toMatchSnapshot();
  });
  it ('should render the connected Board', () => {
    const wrapper = shallow(<Provider store={store}><Board /></Provider>);
    expect(wrapper).toMatchSnapshot();
  })
})