import React from 'react';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            red: 94,
            green: 36,
            blue: 102,
            previousColors: [],
            colorSurfInterval: null,
            resetTimeout: null,
            optionsTimeout: null,
            hasBeenReset: false,
            surfingColors: true,
            optionsOpen: false,
            theColors: [
                {red: 44,  green: 44,  blue: 88,  name: "indigo"},
                {red: 0,   green: 0,   blue: 0,   name: "black" },
                {red: 158, green: 20,  blue: 20,  name: "red"   },
                {red: 239, green: 90,  blue: 173, name: "pink"  },
                {red: 25,  green: 60,  blue: 9,   name: "green" },
                {red: 49,  green: 115, blue: 198, name: "blue"  }
            ],
            currentColor: 0
        }

        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
        this.deleteColor = this.deleteColor.bind(this);
        this.openDeleteDialog = this.openDeleteDialog.bind(this);

        this.deleteDialog = React.createRef();
    }

    componentDidMount() {
        this.surfColors()
    }

    mouseDown() {
        if (!this.state.surfingColors && !this.state.optionsOpen) {
            this.resetTimeout()
        } else if (this.state.surfingColors && !this.state.optionsOpen) {
            this.optionsTimeout()
        }
    }

    mouseUp() {
        this.setState({hasBeenReset: false})
        clearTimeout(this.state.resetTimeout)
        clearTimeout(this.state.optionsTimeout)
        if (!this.state.hasBeenReset && !this.state.optionsOpen) {
            clearInterval(this.state.colorSurfInterval)
            this.setState({surfingColors: false})
            this.changeColor()
        }
    }

    changeColor() {
        let thePreviousColors = this.state.previousColors
        let theColors = this.state.theColors
        let availableColors = [] //specifying which colors are viable to choose
        for (let i = 0; i < theColors.length; i++) {
            if (!thePreviousColors.includes(i)) {
                availableColors.push(i)
            }
        }

        let chosenColorIndex = availableColors[randomInteger(0, availableColors.length - 1)] //choosing a new color to change to

        thePreviousColors.push(chosenColorIndex) //updating previous colors array in state
        if (thePreviousColors.length<3) {
            this.setState({
                previousColors: thePreviousColors
            })
        } else {
            this.setState({
                previousColors: thePreviousColors.slice(1,thePreviousColors.length)
            })
        }

        this.setState({ //changing the color
            red: theColors[chosenColorIndex].red,
            green: theColors[chosenColorIndex].green,
            blue: theColors[chosenColorIndex].blue
        })
    }

    surfColors(colorInputObject) {                          //setting up a color shifting wait screen
        this.setState({surfingColors: true})
        let redT = randomInteger(0, 100)   //initial values for the variable; sin of this variable will be the color value
        let greenT = randomInteger(0, 100)
        let blueT = randomInteger(0, 100)
        if (colorInputObject) {                                //if from a reset; starting with the color we reset from
            redT = Math.asin((colorInputObject.red - 128)/128)
            greenT = Math.asin((colorInputObject.green - 128)/128)
            blueT = Math.asin((colorInputObject.blue - 128)/128)
        }
        let redRate = randomInteger(0, 100)/10000 + 0.005 //how fast this color value changes
        let greenRate = randomInteger(0, 100)/10000 + 0.005
        let blueRate = randomInteger(0, 100)/10000 + 0.005

        let colorSurfInterval = setInterval(()=>{
            redT = redT + redRate
            greenT = greenT + greenRate
            blueT = blueT + blueRate
            this.setState(
                {
                    red:   Math.floor((Math.sin(redT))*128 + 128), //sin is used to avoid rapid shift from 255 to 0
                    green: Math.floor((Math.sin(greenT))*128 + 128),
                    blue:  Math.floor((Math.sin(blueT))*128 + 128)
                }
            )
        }, 16.67) //60hz
        this.setState({colorSurfInterval: colorSurfInterval})
    }

    resetTimeout() {
        let resetTimeout = setTimeout(() => {
            this.setState({previousColors: [], hasBeenReset: true}) //reset
            this.surfColors({
                red: this.state.red,
                green: this.state.green,
                blue: this.state.blue
            })
        }, 1000)                                    //hold for 1 sec to reset
        this.setState({resetTimeout: resetTimeout})
    }

    optionsTimeout() {
        let optionsTimeout = setTimeout(() => {
            clearInterval(this.state.colorSurfInterval)
            this.setState({optionsOpen: true, surfingColors: false}) //open em up
            this.openOptions()
        }, 1000)                                    //hold for 1 sec to open
        this.setState({optionsTimeout: optionsTimeout})
    }

    openOptions() {
        let initRed = this.state.red
        let initGreen = this.state.green
        let initBlue = this.state.blue

        let redRate = Math.floor(initRed/30) + 1
        let greenRate = Math.floor(initGreen/30) + 1
        let blueRate = Math.floor(initBlue/30) + 1

        let openOptionsInterval = setInterval(()=>{
            if (this.state.red > 0 || this.state.green > 0 || this.state.blue > 0) {
                this.setState({
                    red: this.state.red - redRate,
                    green: this.state.green - greenRate,
                    blue: this.state.blue - blueRate
                })
            } else {
                clearInterval(openOptionsInterval)
                this.setState({
                    red: 0,
                    green: 0, 
                    blue: 0
                })
            }
        }, 16.67)
    }

    optionsMenu(optionsOpen, theColors) {
        if (!optionsOpen) {
            return null
        } else {
            let colorArray = []
            let i = 0
            for (let color of theColors) {
                colorArray.push(
                    <div key={i} className="color-item">
                        <div className="color-item-inner">
                            <label style={{color: "white"}}><strong>color {i+1}</strong></label>
                            <svg className="color-box" viewBox="0 0 10 5">                    {/*a little box to show what the color is*/}
                                <polygon points="0,0 10,0 10,5 0,5" style={{fill: `rgb(${color.red},${color.green},${color.blue})`, stroke: "white", strokeWidth: "1"}}/>
                            </svg>
                            <label style={{
                                color: `rgb(${color.red},${color.green},${color.blue})`,
                                textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"
                            }}>
                                <strong>{color.name}</strong>
                            </label>
                        </div>
                        <div className="color-item-inner">
                            <svg className="edit-button" viewBox="0 0 10 10" onClick={()=>{}}>                    {/* this is the pencil icon for editing*/}
                                <polygon points="1,9 2,7 8,1 9,2 3,8" style={{fill: "green", stroke: "green", strokeWidth: "1"}}/>
                            </svg>
                            <svg id={"red-x-" + i} className="red-x" viewBox="0 0 10 10" onClick={this.openDeleteDialog}>                    {/* this is the x to remove a color*/}
                                <polygon id={i} points="1,2 2,1 9,8 8,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}}/>
                                <polygon id={i} points="9,2 8,1 1,8 2,9" style={{fill: "red", stroke: "red", strokeWidth: "1"}} />
                            </svg>
                        </div>
                    </div>
                )
                i++;
            }
            return ( 
                <div id="options-menu">
                    <div id="the-x-div">
                        <svg id="the-x" viewBox="0 0 10 10" onClick={this.closeOptions}>                    {/* this is the x to get out of the options*/}
                            <polygon points="1,2 2,1 9,8 8,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}}/>
                            <polygon points="9,2 8,1 1,8 2,9" style={{fill: "white", stroke: "white", strokeWidth: "1"}} />
                        </svg>
                    </div>
                    <h1>Options</h1>
                    <h2>Colors</h2>
                    {colorArray}
                </div>
            )
        }
    }

    closeOptions() {
        this.setState( {optionsOpen: false} )
        let black = {
            red: 0,
            green: 0,
            blue: 0
        }
        this.surfColors(black)
    }

    openDeleteDialog(event) {
        console.log(Number(event.target.id.slice(-1)))
        this.setState( {currentColor: Number(event.target.id.slice(-1))} )
        this.deleteDialog.current.showModal();
    }

    deleteColor() {
        let colorNumber = this.state.currentColor
        let theColors = this.state.theColors
        theColors.splice(colorNumber, 1)
        this.setState( {theColors: theColors} )
    }

    render() {
        let color = this.state.theColors[this.state.currentColor]
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onMouseUp={this.mouseUp}
                onMouseDown={this.mouseDown}
            >
                {this.optionsMenu(this.state.optionsOpen, this.state.theColors)}
                <dialog id="delete-dialog" ref={this.deleteDialog}>
                    <form method="dialog">
                        <h4>Are you sure you want to delete "{color.name}"????</h4>
                        <p>r: {color.red} g: {color.green} b: {color.blue}</p>
                        <menu>
                            <button value="cancel">cancel</button>
                            <button id="confirm" value="default" onClick={this.deleteColor}>delete</button>
                        </menu>
                    </form>
                </dialog>
            </div>
        )
    }
}

//----helper functions----//

function randomInteger(min, max) {
    let range = max - min + 1
    return Math.floor(range*(Math.random())) + min
}

export default App;

//----------planned features-------------//

//  Xoptions menu
//      *help
//      *custom color rotation
//      *random color
//          *random color within range
//      *show color name
//      *show color value
//      *pseudo random toggle
//          *pseudo random # of previous choices excluded
//      *text display
//  Xreset function
//  *cookies to save settings