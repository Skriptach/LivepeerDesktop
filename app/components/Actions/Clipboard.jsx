import React from 'react'
const { clipboard } = require('electron')

import copy from '../../static/copy.svg';

class Clipboard extends React.Component {
	constructor(props) {
      super(props);
	  this.state = { copySuccess: this.props.copyLabel || 'Copy' }
  	}

	copyToClipboard = (e) => {

		clipboard.writeText(this.props.value);
		this.setState({ copySuccess: 'Copied!' });
		setTimeout(() => this.setState({ copySuccess: this.props.copyLabel || 'Copy' }), 2000)

    }

	render() {
		return (
			<button onClick={(e) => this.copyToClipboard(e) } className="Clipboard withBorder withBorder-light">
				<i className="Clipboard-icon" dangerouslySetInnerHTML={{__html: copy }}></i>
				<label>{this.state.copySuccess}</label>
			</button>
		);
	}
}


export default Clipboard
