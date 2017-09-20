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

let ticketHeaderAndFooter = {
  display: 'flex'
};

let ticketTextStyle = {
  color: 'black', 
  fontFamily: 'Avenir Next', 
  margin: '0px auto 0 10px',
  fontStyle: 'bold'
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

    /** TICKET TYPE CONDITIONAL STYLING **/
    const ticketTypeColor = {
      background: this.props.ticketInfo.type === 'devOps' ? '#417505' : (this.props.ticketInfo.type === 'bug') ? '#9012FE' : '#F6A623',
      width: '16px',
      height: '16px',
      borderRadius: '50%'
    };

    /** TICKET STATUS STYLING **/
    const ticketStatusColor = {
      background: this.props.ticketInfo.status === 'not started' ? '#4990E2' : (this.props.ticketInfo.status === 'in progress') ? '#F8E81C' : '#7ED321',
      width: '16px',
      height: '16px',
      borderRadius: '50%'
    };

    /** TICKET URGENCY **/
    const ticketPriorityColor = {
      borderLeft: '2pt solid',
      borderColor: this.props.ticketInfo.priority === 1 ? '#B8E986' : (this.props.ticketInfo.status === 2) ? '#F8E81C' : '#D0011B',
    };

    /** TICKET HEADER **/
    const ticketHeader = (
      <div>

        <div className="ticket-title">
            <div className="ticket-type" style={ticketTypeColor}>
            </div> 

            <h4>
              {this.props.ticketInfo.title}
            </h4>
          </div>

          <div className="ticket-edit">
            <NavItem eventKey={1} onClick={() => {
            this.props.handleSetCurrentTicket(this.props.ticketInfo);
            this.props.handleSetCurrentPanel(this.props.panelInfo);
            this.props.handleEditTicketRendered();
            }}>Edit</NavItem>
          </div>
      </div>
    );

    /** TICKET BODY **/

    const ticketBody = (
      <div className="ticketBody" style={ticketPriorityColor}>
          <div className="description" style={{marginLeft: '5px'}}>
            <div>{this.props.ticketInfo.description}</div>
          </div>
        <div className="status">
            <div className="status-circle" style={ticketStatusColor}></div>
            <p>{this.props.ticketInfo.status}</p>
        </div>
      </div>
    );

    /** TICKET FOOTER **/
    const ticketFooter = (
      <div className="ticket-footer">
        <h6 style={{marginRight: '10px'}}>ASSIGNED TO: </h6>
        <h6>{this.props.ticketInfo.assignee_handle}</h6>
      </div>
    );

    return (
      <BootstrapPanel 
        className='ticket-panel'
        header= {ticketHeader}
        footer= {ticketFooter}>
        {ticketBody}
      </BootstrapPanel>
    );
  }
}

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