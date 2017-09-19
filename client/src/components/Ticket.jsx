import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel, toggleEditTicket, setCurrentTicket, setCurrentPanel } from '../redux/actionCreators.js';
import { Panel as BootstrapPanel, NavItem } from 'react-bootstrap';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import '../../../ticketStyle.css';

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
  display: 'flex'
};

let ticketTextStyle = {
  color: 'black', 
  fontFamily: 'Avenir Next', 
  margin: '0px auto 0 10px'
};

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
      creator_id: this.props.ticketInfo.creator_id,
      assignee_handle: this.props.ticketInfo.assignee_handle,
      panel_id: this.props.ticketInfo.panel_id,
      board_id: this.props.ticketInfo.board_id,
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
        bsStyle={this.props.ticketInfo.priority === 1 ? 'info' : (this.props.ticketInfo.priority === 2) ? 'warning' : 'danger'}
        className='ticket-panel'
        header= {
          <div style={ticketHeaderAndFooter}>
            <div> <img src={(this.props.ticketInfo.type === 'devOps' ? require('../images/devOps-circle.png') : (this.props.ticketInfo.type === 'bug') ? require('../images/bug-circle.png') : require('../images/feature-circle.png'))}/>
            </div> 
            <h4 style={ticketTextStyle}>
              {this.props.ticketInfo.title}
              </h4>
              <div><NavItem eventKey={1} onClick={() => {
                this.props.handleSetCurrentTicket(this.props.ticketInfo);
                this.props.handleSetCurrentPanel(this.props.panelInfo);
                this.props.handleEditTicketRendered();
                }}>Edit</NavItem>
            </div>
          </div>}

        footer={<div style={ticketHeaderAndFooter}><div> <img src={(this.props.ticketInfo.status === 'not started' ? require('../images/notstarted-circle.png') : (this.props.ticketInfo.status === 'in progress') ? require('../images/inprogress-circle.png') : require('../images/circle-done.png'))}/></div> <h6 style={ticketTextStyle}>{this.props.ticketInfo.assignee_handle}</h6></div>}>
        {this.props.ticketInfo.description}
      </BootstrapPanel>
    );
  }
}

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentTicket': state.rootReducer.currentTicket
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleEditTicketRendered() {
      dispatch(toggleEditTicket());
    },
    handleSetCurrentTicket(ticketInfo) {
      dispatch(setCurrentTicket(ticketInfo));
    },
    handleSetCurrentPanel(panel) {
      dispatch(setCurrentPanel(panel));
    }
  };
};

export var UnwrappedTicket = Ticket;
export default connect(mapStateToProps, mapDispatchToProps)(Ticket);