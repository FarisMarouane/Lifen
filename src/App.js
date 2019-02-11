import React, { Component } from 'react';

import './App.css';
import ServerInfo from './ServerInfo';
import DropZone from './Dropzone';
import { API, SUCESS_STATUS } from './constants';

class App extends Component {
  state = {
    file: [
      {
        name: '',
      },
    ],
    status: undefined,
    numberOfBinary: undefined,
  };

  onDrop = file => {
    if (file.length > 0) {
      this.setState({
        file: file,
      });
    }
  };

  renderStatus = status => {
    if (status === 'success') {
      return <h4>The file was successfully uploaded</h4>;
    } else if (status === 'failure') {
      return (
        <h4>An error occured while uploading the file. Please try again</h4>
      );
    }
  };

  renderTitle = file => {
    if (file.length > 0) {
      if (file[0].name.length > 20)
        return <h1 id="title">{file[0].name.slice(0, 20) + '...'}</h1>;
    }
    return <h1 id="title">File name</h1>;
  };

  componentDidMount() {
    const evtSource = new EventSource('http://localhost:5000/api/event-stream');
    const cb = message => {
      // this.onDrop(message.data);
      console.log('SSE: ', message);
    };
    evtSource.addEventListener('file', cb, false);

    fetch(`${API}/Binary`)
      .then(response => response.json())
      .then(r => {
        this.setState({
          numberOfBinary: r.entry.length,
        });
      });
  }

  componentDidUpdate(_, prevState) {
    const { file } = this.state;
    if (prevState.file[0].name !== file[0].name) {
      fetch(`${API}/Binary`, {
        method: 'POST',
        headers: new Headers({
          'Content-type': file.type,
        }),
        body: file,
      })
        .then(response => {
          if (response.status === SUCESS_STATUS) {
            this.setState({
              status: 'success',
            });

            return fetch(`${API}/Binary`);
          } else {
            this.setState({
              status: 'failure',
            });
          }
        })
        .then(r => r.json())
        .then(r =>
          this.setState({
            numberOfBinary: r.entry.length,
          }),
        );
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderTitle(this.state.file)}
        <DropZone onDrop={this.onDrop} />
        {this.renderStatus(this.state.status)}
        <ServerInfo numberOfBinary={this.state.numberOfBinary} />
      </div>
    );
  }
}

export default App;
