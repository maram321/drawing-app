import React, { Component } from 'react';

let snapShot 

class DrawingApp extends Component {
  state = { 
    isDrawing : false,
    shape : "pen",
    lineColor : "#000000",
    lineWidth : 5,
    fillshape : false,
    startPoint : { x: 0, y: 0 },
    endPoint : { x: 0, y: 0 },
  } 

  handleStartDrawing = (e) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    this.setState({isDrawing : true});
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = this.state.lineWidth;
    ctx.strokeStyle = this.state.lineColor;
    ctx.fillStyle = this.state.lineColor;
    this.setState({startPoint : { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }});
    snapShot = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
  };

  handleDrawing = (e) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    this.setState({endPoint :{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }});
    if (!this.state.isDrawing) return;
    ctx.putImageData(snapShot, 0, 0);
    if (this.state.shape === "pen") {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke(); 
    }
    if (this.state.shape === "line") {
      ctx.beginPath();
      ctx.moveTo(this.state.startPoint.x, this.state.startPoint.y);
      ctx.lineTo(this.state.endPoint.x, this.state.endPoint.y);
      ctx.stroke(); 
    }
    if (this.state.shape === "rectangle"){
      const {x:x1, y:y1} = this.state.startPoint;
      const {x:x2, y:y2} = this.state.endPoint;
      if (!this.state.fillshape) {ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)};
      if (this.state.fillshape) {ctx.fillRect(x1, y1, x2 - x1, y2 - y1)};
    }
    if (this.state.shape === "circle") {
      const {x:x1, y:y1} = this.state.startPoint;
      const {x:x2} = this.state.endPoint;  
      ctx.beginPath();
      ctx.arc(x1, y1, Math.abs(x2 - x1)/2, 0, Math.PI * 2);
      (!this.state.fillshape)? ctx.stroke() : ctx.fill();
    }
    if (this.state.shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(this.state.startPoint.x, this.state.startPoint.y);
      ctx.lineTo(this.state.endPoint.x, this.state.endPoint.y);
      ctx.lineTo(this.state.startPoint.x * 2 - this.state.endPoint.x, this.state.endPoint.y);
      ctx.closePath();
      (!this.state.fillshape)? ctx.stroke() : ctx.fill();
    }
  };
  
  handleStopDrawing = (e) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    this.setState({isDrawing : false});
    ctx.closePath();
  };
  
  handleShapeChange = (newShape) => {
    this.setState({shape : newShape});
    this.setState({lineWidth : 5});
    this.setState({lineColor : "#000000"})
  };
  
  eraser = () => {
    this.setState({shape : "pen"});
    this.setState({lineWidth : 10});
    this.setState({lineColor :"#FFFFFF"});
  };
  
  clear = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };

  handleFillShapeChange = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = this.state.lineColor;
    ctx.lineWidth = this.state.lineWidth;
    if (!this.state.fillshape) {this.setState({fillshape : true});}
    if (this.state.fillshape) {this.setState({fillshape : false});}
  };
  
  render() { 
      return (
        <div>
          <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">Lets Draw!</span>
              <input
                type="color"
                value={this.state.lineColor}
                onChange={(e) => this.setState({lineColor : e.target.value})}
              />
              <input
                type="number"
                value={this.state.lineWidth}
                onChange={(e) => this.setState({lineWidth : e.target.value})}
                min="1"
                max="100"
              />
              <div className="form-check form-switch">
                <input className="form-check-input mb-0" type="checkbox" id="flexSwitchCheckDefault" value="" onChange={this.handleFillShapeChange}/>
                <label className="form-check-label" type="text" for="flexSwitchCheckDefault">Fill Shape</label>
              </div>
              <button className='btn btn-secondary' onClick={() => this.handleShapeChange("pen")}>Pen</button>
              <button className='btn btn-secondary' onClick={() => this.handleShapeChange("line")}>Line</button>
              <button className='btn btn-secondary' onClick={() => this.handleShapeChange("rectangle")}>Rectangle</button>
              <button className='btn btn-secondary' onClick={() => this.handleShapeChange("circle")}>Circle</button>
              <button className='btn btn-secondary' onClick={() => this.handleShapeChange("triangle")}>Triangle</button>
              <button className='btn btn-dark' onClick={this.eraser}>Eraser</button>
              <button className='btn btn-danger' onClick={this.clear}>Clear</button>
            </div>
          </nav>
          <canvas
            id="canvas"
            onMouseDown={this.handleStartDrawing}
            onMouseMove={this.handleDrawing}
            onMouseUp={this.handleStopDrawing}
            onMouseLeave={this.handleStopDrawing}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ border: '3px solid black' }}
          />
        </div>
      );
    }
}
 
export default DrawingApp;