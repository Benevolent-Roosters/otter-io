import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel, toggleEditTicket, setCurrentTicket, setCurrentPanel } from '../redux/actionCreators.js';
import { Panel as BootstrapPanel, NavItem, Grid, Row, Col } from 'react-bootstrap';
import '../../../styles.css';


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
      background: this.props.ticketInfo.type === 'devops' ? '#417505' : (this.props.ticketInfo.type === 'bug') ? '#9012FE' : '#F6A623',
      width: '16px',
      height: '16px',
      borderRadius: '50%'
    };

    /** TICKET STATUS CONDITIONAL STYLING **/
    const ticketStatusColor = {
      background: this.props.ticketInfo.status === 'not started' ? '#4990E2' : (this.props.ticketInfo.status === 'in progress') ? '#F8E81C' : '#7ED321',
      width: '16px',
      height: '16px',
      borderRadius: '50%'
    };

    /** TICKET CONDITIONAL URGENCY **/
    const ticketPriorityColor = {
      borderLeft: '2pt solid',
      borderColor: this.props.ticketInfo.priority === 1 ? '#B8E986' : (this.props.ticketInfo.priority === 2) ? '#F8E81C' : '#D0011B',
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
      <div className="ticket-body">

            <div className="ticket-info" style={ticketPriorityColor}>
              <div className="description">{this.props.ticketInfo.description}</div>
            </div>

            <div className="status">
              <div className="status-circle" style={ticketStatusColor}></div>
              <div className="status-text">{this.props.ticketInfo.status}</div>
            </div>
        </div>
    );

    /** TICKET FOOTER **/
    const ticketFooter = (
      <div className="ticket-footer">
        <h6 className="assigned-to">ASSIGNED TO: </h6>
        <h6 className="assignee-handle">@{this.props.ticketInfo.assignee_handle}</h6>
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