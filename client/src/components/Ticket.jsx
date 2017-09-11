import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel } from '../redux/actionCreators.js';
import { Panel as BootstrapPanel } from 'react-bootstrap';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

let ticketStyle = {
  color: 'black',
  fontFamily: 'Avenir Next',
  backgroundColor: '#ffffff',
  borderColor: '#9B9B9B'
};

// let ticketTypeColors = {
//   devOps: {
//     background: '#417505',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   },

//   bug: {
//     background: '#9012FE',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   },

//   feature: {
//     background: '#F6A623',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   }
// };

// let ticketStatusColors = {
//   notStarted: {
//     background: '#4990E2',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   },

//   inProgress: {
//     background: '#F8E81C',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   },

//   done: {
//     background: '#7ED321',
//     width: '19px',
//     height: '16px',
//     borderRadius: '50%'
//   }
// };

// let priorityStatusLines = {
//   borderTop: '100px #B8E986',
//   borderBottom: '100px',
//   borderRight: '100px',
//   borderLeft: '100px',
// };

let ticketHeaderAndFooter = {
  display: '-webkit-inline-box', 
  flexWrap: 'wrap', 
  justifyContent: 'space-around'
}

let ticketTextStyle = {
  color: 'black', 
  fontFamily: 'Avenir Next', 
  margin: '0 auto'
}

/** Ticket Priority vertical lines can be made with hr HTML tag **/
// <hr width="1" size="60" color="#B8E986">
//<hr width="1" size="60" color="#D0011B">
//<hr width="1" size="60" color="#F8E81C"> */

class Ticket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Ticket',
      description: 'The job of this ticket is to finish the UI components',
      status: 'done',
      priority: 1,
      type: 'feature',
      creator_id: this.props.userId,
      assignee_id: this.props.userId,
      assignee: 'dsc03',
      panel_id: this.props.currentPanel,
      board_id: this.props.currentBoardId,
      hovered: false
    }
  }

  handleHover() {
    this.setState({
      hovered: !this.state.hovered
    });
  }

  render() {
    return (
      <BootstrapPanel 
        onMouseEnter={this.handleHover.bind(this)}
        onMouseLeave={this.handleHover.bind(this)}
        bsStyle={this.state.priority === 0 ? 'info' : (this.state.priority === 1) ? 'warning' : 'danger'}
        header= {<div style={ticketHeaderAndFooter}><div> <img src={(this.state.type === 'devOps' ? require('../images/devOps-circle.png') : (this.state.type === 'bug') ? require('../images/bug-circle.png') : require('../images/feature-circle.png'))}/></div> <h4 style={ticketTextStyle}>{this.state.title}</h4>
        </div>}
        footer={<div style={ticketHeaderAndFooter}><div> <img src={(this.state.type === 'not started' ? require('../images/notstarted-circle.png') : (this.state.type === 'in progress') ? require('../images/inprogress-circle.png') : require('../images/circle-done.png'))}/></div> <h6 style={ticketTextStyle}>{this.state.assignee}</h6></div>}>
        {this.state.description}
      </BootstrapPanel>
    );
  }
}

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentTicket': state.currentTicket
  };
};

export var UnwrappedTicket = Ticket;
export default connect(mapStateToProps)(Ticket);