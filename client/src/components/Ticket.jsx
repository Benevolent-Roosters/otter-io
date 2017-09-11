import React from 'react';
import { connect } from 'react-redux';
import { getTicketsByPanel } from '../redux/actionCreators.js';
import { Panel as BootstrapPanel } from 'react-bootstrap';

class Ticket extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Ticket',
      description: '',
      status: '',
      priority: 0,
      type: '',
      creator_id: this.props.userId,
      assignee_id: this.props.userId,
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
        bsStyle={this.state.hovered ? 'primary' : 'success'}
        header={this.state.title}>
        Example Ticket
      </BootstrapPanel>
    )
  }
};

//NOTE: most likely NOT necessary if upon entering new board we navigate to new route, because navigating to new route will re-render app (we think).
const mapStateToProps = (state) => {
  return {
    'currentTicket': state.currentTicket
  };
};

export var UnwrappedTicket = Ticket;
export default connect(mapStateToProps)(Ticket);