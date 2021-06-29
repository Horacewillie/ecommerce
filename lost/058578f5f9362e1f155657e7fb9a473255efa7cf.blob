import React, { Component } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress } from "@material-ui/core";

class FileUpload extends Component {
  constructor() {
    super();

    this.state = {
      uploadedFiles: [],
      uploading: false,
    };
  }

  onDrop = (files) => {
    this.setState({ uploading: true });
    const formdata = new FormData();
    const config = {
      header: { "Content-Type": "multipart/form-data" },
    };

    formdata.append("file", files[0]);

    axios
      .post("/api/users/uploadimage", formdata, config)
      .then((res) => {
        this.setState(
          {
            uploading: false,
            uploadedFiles: [...this.state.uploadedFiles, res.data],
          },
          () => this.props.imagesHandler(this.state.uploadedFiles)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onRemove = (e, id) => {
    e.stopPropagation()
    axios.get(`/api/users/removeimage?public_id=${id}`).then(res => {
      let images = this.state.uploadedFiles.filter((item) => {
        return item.public_id !== id
      });

      this.setState({
        uploadedFiles: images
      }, () => this.props.imagesHandler(images))
    }).catch(err => {
      console.log(err)
    })
  };

  showUploadedImages = () => {
    return this.state.uploadedFiles.map((item) => (
      <div
        key={item.public_id}
        onClick={(e) => this.onRemove(e,item.public_id)}
      >
        <div
        className = 'wrap'
          style={{
            width: "90px",
            height: "85px",
            background: `url(${item.url}) no-repeat`,
            border: 'none',
            backgroundSize: 'contain',
            margin: "7px",
            position: "absolute",
          }}
        ></div>
      </div>
    ));
  };

  static getDerivedStateFromProps = (props, state) => {
    if(props.reset){
      return state ={
        uploadedFiles: []
      }
    }
    return null
  }

  render() {
    return (
      <div>
        <section>
          <div className="dropzone clear">
            <Dropzone
              onDrop={(e) => this.onDrop(e)}
              multiple={false}
              className="dropzone_box"
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  className="wrap"
                  {...getRootProps()}
                  style={{ height: "100px", display: 'flex' }}
                >
                  <input {...getInputProps()} />
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    style={{
                      width: "50px",
                      height: "35px",
                      padding: "25px",
                      background: "#eaeaea",
                      marginTop: "7px",
                      marginLeft: "7px",
                    }}
                  />
                  
                  {this.state.uploading ? (
                    <span
                      style={{
                        padding: "20px",
                      }}
                    >
                      <CircularProgress
                        thickness={7}
                        style={{ color: "#00bcd4" }}
                      />
                    </span>
                  ) : null}
                  {this.showUploadedImages()}
                </div>
              )}
            </Dropzone>
          </div>
        </section>
      </div>
    );
  }
}

export default FileUpload;
