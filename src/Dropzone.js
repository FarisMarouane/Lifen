import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import './dropzone.css';

class MyDropzone extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
      console.log(acceptedFiles)
      this.props.onDrop(acceptedFiles);
  };

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', {
                'dropzone--isActive': isDragActive,
              })}
            >
              <input {...getInputProps()} />
              <div className="dropzone-inner">
                <i className="fas fa-cloud-upload-alt fa-10x" />
                {isDragActive ? (
                  <p className="dropzone-text">Drop files here...</p>
                ) : (
                  <p className="dropzone-text">
                    Try dropping some files here, or click to select files to
                    upload.
                  </p>
                )}
              </div>
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

MyDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
}

export default MyDropzone;
