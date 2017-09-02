import React from 'react';
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>HELLO</div>
    )
  } 
}


const mapStateToProps = (state) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch) => {

};

export var UnwrappedApp = App;
export default connect(mapStateToProps, mapDispatchToProps)(App);