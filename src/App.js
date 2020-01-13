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
                {red: 44,  green: 44,  blue: 88 },     //default/indigo
                {red: 0,   green: 0,   blue: 0  },     //black
                {red: 73,  green: 9,   blue: 9  },     //red
                {red: 239, green: 90,  blue: 173},     //pink
                {red: 25,  green: 60,  blue: 9  },     //green
                {red: 49,  green: 115, blue: 198}      //blue
            ]
        }
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.closeOptions = this.closeOptions.bind(this);
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

        let redRate = Math.floor(initRed/60) + 1
        let greenRate = Math.floor(initGreen/60) + 1
        let blueRate = Math.floor(initBlue/60) + 1

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
                    <div key={i}>
                        <label style={{color: `rgb(${color.red},${color.green},${color.blue})`}}>Color {i+1}</label>
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
                    <h2>Options</h2>
                    <h3>Colors</h3>
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

    render() {
        return (
            <div
                id="the-div"
                style={{backgroundColor: `rgb(${this.state.red},${this.state.green},${this.state.blue})`}}
                onMouseUp={this.mouseUp}
                onMouseDown={this.mouseDown}
            >
                {this.optionsMenu(this.state.optionsOpen, this.state.theColors)}
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
//  Xreset function
//  *cookies to save settings